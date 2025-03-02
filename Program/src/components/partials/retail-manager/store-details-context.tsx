import Store from "@/lib/interfaces/entities/store";

interface StoreDetailsProps {
  store: Store;
}

export default function StoreDetailsContent({ store }: StoreDetailsProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="flex justify-center mb-4">
        <img
          src={store.image}
          alt={store.name}
          className="rounded-md max-h-64 object-contain"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Name</p>
          <p>{store.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Opening Time</p>
          <p>{store.openingTime}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Closing Time</p>
          <p>{store.closingTime}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Status</p>
          <p>
            {isStoreOpen(store.openingTime, store.closingTime)
              ? "Open"
              : "Closed"}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Sales Associate</p>
          <p>{store.salesAssociate || "Not Assigned"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Store ID</p>
          <p>{store.id}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500">Description</p>
        <p>{store.description}</p>
      </div>
    </div>
  );

  function isStoreOpen(openingTime: string, closingTime: string): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const [openHour, openMinute] = openingTime.split(":").map(Number);
    const [closeHour, closeMinute] = closingTime.split(":").map(Number);

    const currentTimeValue = currentHour * 60 + currentMinute;
    const openTimeValue = openHour * 60 + openMinute;
    const closeTimeValue = closeHour * 60 + closeMinute;

    return (
      currentTimeValue >= openTimeValue && currentTimeValue <= closeTimeValue
    );
  }
}
