import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Search, ShoppingBag } from "lucide-react";
import { Link } from "react-router";
import { useGetStores } from "@/hooks/data/use-get-stores";
import { useGetSouvenirs } from "@/hooks/data/use-get-souvenirs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StoreNavbar from "@/components/navbars/store-navbar";

export default function StoreDashboard() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);

  const storeData = useGetStores();
  const souvenirData = useGetSouvenirs();

  const filteredStores = storeData.stores?.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "" || store.status === statusFilter),
  );

  const filteredSouvenirs = souvenirData.souvenirs?.filter((souvenir) =>
    souvenir.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedSouvenirs =
    filteredSouvenirs && priceSort
      ? [...filteredSouvenirs].sort((a, b) =>
          priceSort === "asc" ? a.price - b.price : b.price - a.price,
        )
      : filteredSouvenirs;

  const statusTypes = storeData.stores
    ? [...new Set(storeData.stores.map((s) => s.status))]
    : [];

  return (
    <>
      <StoreNavbar />
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6 mt-20">
          Souvenir Store Dashboard
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 text-gray-500" />
            <Input
              placeholder="Search stores and souvenirs..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select
            value={statusFilter === "" ? "all" : statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-80 p-2 border rounded-md">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusTypes.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={priceSort === null ? "none" : priceSort}
            onValueChange={(value) =>
              setPriceSort(value === "none" ? null : (value as "asc" | "desc"))
            }
          >
            <SelectTrigger className="w-80 p-2 border rounded-md">
              <SelectValue placeholder="Sort by Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sort by Price</SelectItem>
              <SelectItem value="asc">Price: Low to High</SelectItem>
              <SelectItem value="desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="stores" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="stores">Stores</TabsTrigger>
            <TabsTrigger value="souvenirs">Souvenirs</TabsTrigger>
          </TabsList>

          <TabsContent value="stores">
            {storeData.isLoading ? (
              <div>Loading stores...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStores?.map((store) => (
                  <Link to={`/store/${store.id}`} key={store.id}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader className="p-0">
                        <img
                          src={store.image}
                          alt={store.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      </CardHeader>
                      <CardContent className="pt-4">
                        <CardTitle className="flex justify-between items-center">
                          <span>{store.name}</span>
                          <Badge
                            variant={store.isActive ? "default" : "destructive"}
                          >
                            {store.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        <div className="flex items-center mt-2 text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {store.openingTime} - {store.closingTime}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Badge variant="outline" className="bg-gray-100">
                          {store.status}
                        </Badge>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}

                {filteredStores?.length === 0 && (
                  <div className="col-span-3 text-center py-10">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-lg">No stores found</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="souvenirs">
            {souvenirData.isLoading ? (
              <div>Loading souvenirs...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedSouvenirs?.map((souvenir) => (
                  <Link
                    to={`/store/${souvenir.storeId}?souvenirId=${souvenir.id}`}
                    key={souvenir.id}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader className="p-0">
                        <img
                          src={souvenir.image}
                          alt={souvenir.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      </CardHeader>
                      <CardContent className="pt-4">
                        <CardTitle>{souvenir.name}</CardTitle>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-bold text-lg">
                            ${souvenir.price.toFixed(2)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}

                {sortedSouvenirs?.length === 0 && (
                  <div className="col-span-3 text-center py-10">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-lg">No souvenirs found</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
