import { useParams, useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, MapPin, Clock } from "lucide-react";
import RetailManagerNavbar from "@/components/navbars/retail-manager-navbar";
import SouvenirCard from "@/components/partials/retail-manager/souvenir-card";
import AddSouvenirModal from "@/components/modals/add-souvenir-modal";
import { useGetStoreById } from "@/hooks/data/use-get-store-by-id";
import { useGetStoreSouvenirs } from "@/hooks/data/use-get-store-souvenirs";
import { useState } from "react";
import Store from "@/lib/interfaces/entities/store";
import StoreEditModal from "@/components/modals/store-edit-modal";
import DeleteStoreProposalModal from "@/components/modals/propose-store-deletion-modal";

export default function RetailManagerStoreDetail() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { store } = useGetStoreById(storeId || "");
  const { storeSouvenirs } = useGetStoreSouvenirs(storeId || "");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!store) {
    return (
      <>
        <RetailManagerNavbar />
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
          <Card className="w-full max-w-2xl text-center p-6">
            <CardContent>
              <p className="mb-4">Store not found or loading...</p>
              <Button onClick={() => navigate("/retail-manager/dashboard")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <RetailManagerNavbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6 mt-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/retail-manager/dashboard")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Store
              </Button>
              <AddSouvenirModal />
              <DeleteStoreProposalModal />
            </div>
          </div>

          <StoreDetailsCard store={store} />

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Store Souvenirs</CardTitle>
                <Badge>{(storeSouvenirs || []).length} Items</Badge>
              </div>
              <CardDescription>
                All souvenirs available at this store
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(storeSouvenirs || []).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(storeSouvenirs || []).map((souvenir) => (
                    <SouvenirCard
                      key={souvenir.id}
                      souvenir={souvenir}
                      storeId={store.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p>No souvenirs available for this store</p>
                  <p className="mt-2 text-sm">
                    Add a new souvenir using the button above
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-xl w-full h-fit p-6 overflow-y-auto">
            <StoreEditModal
              formData={store}
              onCancel={() => setIsEditModalOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

function StoreDetailsCard({ store }: { store: Store }) {
  function isStoreOpen(store: Store): boolean {
    if (store.status === "Closed") {
      return false;
    }

    if (store.salesAssociate == null) {
      return false;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const [openHour, openMinute] = store.openingTime.split(":").map(Number);
    const [closeHour, closeMinute] = store.closingTime.split(":").map(Number);

    const currentTimeValue = currentHour * 60 + currentMinute;
    const openTimeValue = openHour * 60 + openMinute;
    const closeTimeValue = closeHour * 60 + closeMinute;

    return (
      currentTimeValue >= openTimeValue && currentTimeValue <= closeTimeValue
    );
  }

  const isOpen = isStoreOpen(store);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{store.name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <MapPin className="h-4 w-4" /> Store ID: {store.id}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 max-w-sm">
            <img
              src={store.image}
              alt={store.name}
              className="rounded-md max-h-64 w-full object-cover"
            />
          </div>

          <div className="flex-grow space-y-6">
            <div className="flex items-center">
              <Badge className={isOpen ? "bg-green-500" : "bg-red-500"}>
                {isOpen ? "Currently Open" : "Currently Closed"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Hours</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4" />
                  {store.openingTime} - {store.closingTime}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Sales Associate
                </h3>
                <p className="mt-1">{store.salesAssociate || "Not Assigned"}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1">{store.description}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
