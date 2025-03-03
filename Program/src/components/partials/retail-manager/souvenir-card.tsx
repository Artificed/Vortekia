import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Eye, Edit, Trash, MoreVertical } from "lucide-react";
import Souvenir from "@/lib/interfaces/entities/souvenir";
import { useDeleteSouvenir } from "@/hooks/data/use-delete-souvenir";
import EditSouvenirModal from "@/components/modals/edit-souvenir-modal";

interface SouvenirCardProps {
  souvenir: Souvenir;
  storeId: string;
}

export default function SouvenirCard({ souvenir, storeId }: SouvenirCardProps) {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { deleteSouvenir, isPending } = useDeleteSouvenir();

  const handleDelete = () => {
    deleteSouvenir(souvenir.id);
    setIsDeleteModalOpen(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-1">
              {souvenir.name}
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50" forceMount>
                <DropdownMenuItem onClick={() => setIsViewModalOpen(true)}>
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-red-600"
                >
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-2 flex-grow">
          <div className="h-40 mb-4 overflow-hidden rounded-md">
            <img
              src={souvenir.image}
              alt={souvenir.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex justify-between items-center mb-2">
            <Badge variant="outline">{formatPrice(souvenir.price)}</Badge>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2">
            {souvenir.description}
          </p>
        </CardContent>
        <CardFooter className="pt-0">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsViewModalOpen(true)}
          >
            <Eye className="mr-2 h-4 w-4" /> View Details
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{souvenir.name}</DialogTitle>
            <DialogDescription>Souvenir details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center mb-4">
              <img
                src={souvenir.image}
                alt={souvenir.name}
                className="rounded-md max-h-64 object-contain"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Price</p>
                <p>{formatPrice(souvenir.price)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">ID</p>
                <p className="truncate text-sm">{souvenir.id}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p>{souvenir.description}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsViewModalOpen(false);
                setIsEditModalOpen(true);
              }}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isEditModalOpen && (
        <EditSouvenirModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          souvenir={souvenir}
          storeId={storeId}
        />
      )}

      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the souvenir "{souvenir.name}". This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
