import LnfLog from "@/lib/interfaces/entities/lnf-log";

interface ItemProps {
  item: LnfLog;
}

const ItemDetailsContent: React.FC<ItemProps> = ({ item }) => (
  <div className="space-y-4 py-4">
    <div className="flex justify-center mb-4">
      <img
        src={item.image}
        alt={item.name}
        className="rounded-md max-h-64 object-contain"
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium text-gray-500">Name</p>
        <p>{item.name}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Type</p>
        <p>{item.type}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Color</p>
        <p>{item.color}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Status</p>
        <p>{item.status}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Last Seen</p>
        <p>{item.lastSeenLocation}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Owner ID</p>
        <p>{item.owner}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Finder ID</p>
        <p>{item.finder || "N/A"}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Item ID</p>
        <p>{item.id}</p>
      </div>
    </div>
  </div>
);

export default ItemDetailsContent;
