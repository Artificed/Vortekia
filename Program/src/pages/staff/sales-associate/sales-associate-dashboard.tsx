import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft } from "lucide-react";
import { useGetSouvenirs } from "@/hooks/data/use-get-souvenirs";
import PurchaseModal from "@/components/modals/store-purchase-modal";
import useAuth from "@/hooks/auth/use-auth";
import { ToastUtils } from "@/components/utils/toast-helper";
import { invoke } from "@tauri-apps/api/core";
import { useGetStaffAssignedStore } from "@/hooks/data/use-get-staff-assigned-store";
import SalesAssociateNavbar from "@/components/navbars/sales-associate-navbar";

export default function SalesAssociateDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const auth = useAuth();

  const { assignedStore, isLoading: isLoadingStore } = useGetStaffAssignedStore(
    auth?.user?.id || "",
  );
  const { souvenirs, isLoading: isLoadingSouvenirs } = useGetSouvenirs();

  const [selectedSouvenirId, setSelectedSouvenirId] = useState<string | null>(
    searchParams.get("souvenirId"),
  );

  const storeSouvenirs =
    souvenirs?.filter((souvenir) => souvenir.storeId === assignedStore?.id) ||
    [];

  useEffect(() => {
    if (searchParams.get("souvenirId")) {
      setSelectedSouvenirId(searchParams.get("souvenirId"));
    }
  }, [searchParams]);

  const handleSouvenirSelect = (souvenirId: string) => {
    setSelectedSouvenirId(souvenirId);
    setSearchParams({ souvenirId });
  };

  const handlePurchase = async (quantity: number) => {
    const selectedSouvenir = storeSouvenirs.find(
      (souvenir) => souvenir.id === selectedSouvenirId,
    );

    if (!selectedSouvenir) {
      ToastUtils.error({ description: "Souvenir must be selected!" });
      return;
    }

    try {
      await invoke("insert_store_transaction", {
        souvenirId: selectedSouvenir.id,
        customerId: auth?.user?.id,
        quantity: quantity,
        price: -selectedSouvenir.price,
      });
      ToastUtils.success({ description: "Successfully purchased souvenir!" });
    } catch (error) {
      ToastUtils.error({ description: String(error) });
    }

    setSearchParams({});
  };

  const handleBackClick = () => {
    navigate("/");
  };

  if (isLoadingStore) {
    return (
      <div className="container mx-auto py-6 mt-20">
        Loading store information...
      </div>
    );
  }

  if (!assignedStore) {
    return (
      <div className="container mx-auto py-6 mt-20">No store assigned</div>
    );
  }

  return (
    <>
      <SalesAssociateNavbar />
      <div className="container mx-auto py-6 pt-24">
        <button
          onClick={handleBackClick}
          className="flex items-center text-blue-600 mb-6 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>

        <div className="relative rounded-lg overflow-hidden mb-8">
          <img
            src={assignedStore.image}
            alt={assignedStore.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {assignedStore.name}
                </h1>
                <Badge
                  className="mb-2"
                  variant={assignedStore.isActive ? "default" : "destructive"}
                >
                  {assignedStore.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-600" />
                <span>
                  {assignedStore.openingTime} - {assignedStore.closingTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Souvenir Items</h2>
        {isLoadingSouvenirs ? (
          <div>Loading souvenir items...</div>
        ) : storeSouvenirs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storeSouvenirs.map((souvenir) => (
              <Card
                key={souvenir.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="p-0">
                  <img
                    src={souvenir.image}
                    alt={souvenir.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle>{souvenir.name}</CardTitle>
                  <p className="mt-2 text-gray-600">{souvenir.description}</p>
                  <p className="mt-2 font-bold text-lg">
                    ${souvenir.price.toFixed(2)}
                  </p>
                </CardContent>
                {auth?.user && (
                  <CardFooter>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSouvenirSelect(souvenir.id);
                      }}
                      className="cursor-pointer"
                    >
                      Purchase Now
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-lg">
              No souvenir items available for this store
            </p>
          </div>
        )}

        {selectedSouvenirId && (
          <PurchaseModal
            souvenirId={selectedSouvenirId}
            isOpen={!!selectedSouvenirId}
            onClose={() => setSelectedSouvenirId(null)}
            onPurchase={handlePurchase}
          />
        )}
      </div>
    </>
  );
}
