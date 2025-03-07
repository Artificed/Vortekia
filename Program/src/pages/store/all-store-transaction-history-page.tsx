import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import StoreTransaction from "@/lib/interfaces/entities/store-transaction";
import StoreNavbar from "@/components/navbars/store-navbar";
import useAuth from "@/hooks/auth/use-auth";
import { useNavigate } from "react-router";
import { useGetCurrentUserStoreTransactions } from "@/hooks/data/use-get-current-use-store-transactions";
import { useGetStores } from "@/hooks/data/use-get-stores";
import { useGetSouvenirs } from "@/hooks/data/use-get-souvenirs";

export default function AllStoreTransactionHistoryPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  // useEffect(() => {
  //   if (!auth?.user) {
  //     navigate("/");
  //   }
  // }, [auth, navigate]);

  const {
    currentUserStoreTransactions,
    isLoading: isLoadingTransactions,
    isError,
    refetch,
  } = useGetCurrentUserStoreTransactions();

  const { stores, isLoading: isLoadingStores } = useGetStores();
  const { souvenirs, isLoading: isLoadingSouvenirs } = useGetSouvenirs();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState<string | "all">("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof StoreTransaction | null;
    direction: "ascending" | "descending";
  }>({
    key: "transactionDate",
    direction: "descending",
  });

  const isLoading =
    isLoadingTransactions || isLoadingStores || isLoadingSouvenirs;

  if (isError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your souvenir purchase history</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="text-destructive mb-4">
            Failed to load transaction history
          </p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  // Filter transactions by selected store if applicable
  const filteredByStoreTransactions = React.useMemo(() => {
    if (!currentUserStoreTransactions || !souvenirs) return [];

    if (selectedStoreId === "all") {
      return currentUserStoreTransactions;
    }

    // Get IDs of souvenirs belonging to selected store
    const storeSouvenirIds = souvenirs
      .filter((souvenir) => souvenir.storeId === selectedStoreId)
      .map((souvenir) => souvenir.id);

    // Filter transactions by store's souvenirs
    return currentUserStoreTransactions.filter((transaction) =>
      storeSouvenirIds.includes(transaction.souvenirId),
    );
  }, [currentUserStoreTransactions, souvenirs, selectedStoreId]);

  const sortedTransactions = React.useMemo(() => {
    if (!filteredByStoreTransactions.length) return [];

    const sortableTransactions = [...filteredByStoreTransactions];

    if (sortConfig.key) {
      sortableTransactions.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableTransactions;
  }, [filteredByStoreTransactions, sortConfig]);

  const filteredTransactions = React.useMemo(() => {
    if (!sortedTransactions.length) return [];

    return sortedTransactions.filter(
      (transaction) =>
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.souvenirId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.customerId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getSouvenirName(transaction.souvenirId)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        getStoreName(getSouvenirStoreId(transaction.souvenirId))
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
  }, [sortedTransactions, searchTerm]);

  const requestSort = (key: keyof StoreTransaction) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const totalSpent = React.useMemo(() => {
    if (!filteredTransactions.length) return 0;

    return filteredTransactions.reduce(
      (sum, transaction) => sum + transaction.price * transaction.quantity,
      0,
    );
  }, [filteredTransactions]);

  // Get souvenir name by id
  const getSouvenirName = (souvenirId: string) => {
    if (!souvenirs) return souvenirId;
    const souvenir = souvenirs.find((s) => s.id === souvenirId);
    return souvenir ? souvenir.name : souvenirId;
  };

  // Get souvenir's store id
  const getSouvenirStoreId = (souvenirId: string) => {
    if (!souvenirs) return "";
    const souvenir = souvenirs.find((s) => s.id === souvenirId);
    return souvenir ? souvenir.storeId : "";
  };

  // Get store name by id
  const getStoreName = (storeId: string) => {
    if (!stores || !storeId) return "";
    const store = stores.find((s) => s.id === storeId);
    return store ? store.name : "";
  };

  return (
    <>
      <StoreNavbar />
      <div className="w-full p-20 flex">
        <Card className="w-full mt-10">
          <CardHeader>
            <CardTitle>
              {selectedStoreId === "all"
                ? "All Stores"
                : getStoreName(selectedStoreId) || "Loading..."}{" "}
              Transaction History
            </CardTitle>
            <CardDescription>
              Your purchase history{" "}
              {selectedStoreId === "all"
                ? "from all stores"
                : `from ${getStoreName(selectedStoreId) || "this store"}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="w-full md:w-1/3">
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">Store:</span>
                <Select
                  onValueChange={(value) => setSelectedStoreId(value)}
                  defaultValue="all"
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select Store" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stores</SelectItem>
                    {stores?.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span className="text-sm font-medium ml-2">Sort by:</span>
                <Select
                  onValueChange={(value) =>
                    requestSort(value as keyof StoreTransaction)
                  }
                  defaultValue="transactionDate"
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transactionDate">Date</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="quantity">Quantity</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSortConfig({
                      ...sortConfig,
                      direction:
                        sortConfig.direction === "ascending"
                          ? "descending"
                          : "ascending",
                    })
                  }
                >
                  {sortConfig.direction === "ascending" ? "↑" : "↓"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Refresh
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                No transactions found
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead
                          onClick={() => requestSort("transactionDate")}
                          className="cursor-pointer"
                        >
                          Date{" "}
                          {sortConfig.key === "transactionDate" &&
                            (sortConfig.direction === "ascending" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead>Store</TableHead>
                        <TableHead
                          onClick={() => requestSort("souvenirId")}
                          className="cursor-pointer"
                        >
                          Souvenir Item{" "}
                          {sortConfig.key === "souvenirId" &&
                            (sortConfig.direction === "ascending" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead
                          onClick={() => requestSort("quantity")}
                          className="cursor-pointer"
                        >
                          Quantity{" "}
                          {sortConfig.key === "quantity" &&
                            (sortConfig.direction === "ascending" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead
                          onClick={() => requestSort("price")}
                          className="cursor-pointer"
                        >
                          Price{" "}
                          {sortConfig.key === "price" &&
                            (sortConfig.direction === "ascending" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead
                          onClick={() => requestSort("status")}
                          className="cursor-pointer"
                        >
                          Status{" "}
                          {sortConfig.key === "status" &&
                            (sortConfig.direction === "ascending" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {new Date(transaction.transactionDate)
                              .toLocaleString()
                              .replace(",", "")}
                          </TableCell>
                          <TableCell>
                            {getStoreName(
                              getSouvenirStoreId(transaction.souvenirId),
                            )}
                          </TableCell>
                          <TableCell>
                            {getSouvenirName(transaction.souvenirId)}
                          </TableCell>
                          <TableCell>{transaction.quantity}</TableCell>
                          <TableCell>${transaction.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                transaction.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : transaction.status === "Failed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {transaction.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            $
                            {(transaction.quantity * transaction.price).toFixed(
                              2,
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredTransactions.length} of{" "}
                      {selectedStoreId === "all"
                        ? currentUserStoreTransactions?.length || 0
                        : filteredByStoreTransactions.length}{" "}
                      transactions
                    </p>
                  </div>
                  <div className="text-lg font-medium">
                    Total: ${totalSpent.toFixed(2)}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
