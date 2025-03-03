import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
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
import { useGetStoreById } from "@/hooks/data/use-get-store-by-id";
import Souvenir from "@/lib/interfaces/entities/souvenir";
import { useGetSouvenirs } from "@/hooks/data/use-get-souvenirs";
import PurchaseModal from "@/components/modals/store-purchase-modal";
import StoreNavbar from "@/components/navbars/store-navbar";
import useAuth from "@/hooks/auth/use-auth";
import { ToastUtils } from "@/components/utils/toast-helper";
import { invoke } from "@tauri-apps/api/core";

export default function StoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const storeId = id || "";
  const souvenirIdParam = searchParams.get("souvenirId");

  const auth = useAuth();

  const [selectedSouvenirId, setSelectedSouvenirId] = useState<string | null>(
    souvenirIdParam,
  );
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const { store, isLoading: isLoadingStore } = useGetStoreById(storeId);
  const { souvenirs, isLoading: isLoadingSouvenirs } = useGetSouvenirs();

  const storeSouvenirs =
    souvenirs?.filter((souvenir: Souvenir) => souvenir.storeId === storeId) ||
    [];

  useEffect(() => {
    if (souvenirIdParam) {
      setSelectedSouvenirId(souvenirIdParam);
      setIsPurchaseModalOpen(true);
    }
  }, [souvenirIdParam]);

  const handleSouvenirSelect = (souvenirId: string) => {
    setSelectedSouvenirId(souvenirId);
    setIsPurchaseModalOpen(true);
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

    setIsPurchaseModalOpen(false);
    setSearchParams({});
  };

  const handleBackClick = () => {
    navigate("/");
  };

  if (isLoadingStore) {
    return (
      <div className="container mx-auto py-6 mt-20">
        Loading store details...
      </div>
    );
  }

  if (!store) {
    return <div className="container mx-auto py-6 mt-20">Store not found</div>;
  }

  return (
    <>
      <StoreNavbar />
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
            src={store.image}
            alt={store.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {store.name}
                </h1>
                <Badge
                  className="mb-2"
                  variant={store.isActive ? "default" : "destructive"}
                >
                  {store.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-600" />
                <span>
                  {store.openingTime} - {store.closingTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <Card className="flex-grow">
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Status:</span> {store.status}
                </div>
                <div>
                  <span className="font-medium">Hours:</span>{" "}
                  {store.openingTime} - {store.closingTime}
                </div>
                <div>
                  <span className="font-medium">Sales Associate:</span>{" "}
                  {store.salesAssociate}
                </div>
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  <Badge variant={store.isActive ? "default" : "destructive"}>
                    {store.isActive ? "Currently Active" : "Currently Inactive"}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Description:</span>{" "}
                  <p className="mt-2">{store.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
            isOpen={isPurchaseModalOpen}
            onClose={() => {
              setIsPurchaseModalOpen(false);
              setSearchParams({});
            }}
            onPurchase={handlePurchase}
          />
        )}
      </div>
    </>
  );
}
