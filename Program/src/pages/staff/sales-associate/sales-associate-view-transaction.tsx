import React, { useState, useEffect, useCallback } from "react";
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
import { useNavigate, useParams } from "react-router";
import { useGetCurrentUserStoreTransactions } from "@/hooks/data/use-get-current-use-store-transactions";
import { useGetStoreById } from "@/hooks/data/use-get-store-by-id";
import { useGetSouvenirs } from "@/hooks/data/use-get-souvenirs";

export default function StoreTransactionHistoryPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { storeId } = useParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof StoreTransaction | null;
    direction: "ascending" | "descending";
  }>({
    key: "transactionDate",
    direction: "descending",
  });

  // Auth check effect - runs on mount and when auth changes
  useEffect(() => {
    if (!auth?.user) {
      navigate("/");
    }
  }, [auth, navigate]);

  // Safe refetch function with auth check
  const safeRefetch = useCallback(async () => {
    if (!auth?.user) {
      navigate("/");
      return false;
    }
    return true;
  }, [auth, navigate]);

  const {
    currentUserStoreTransactions,
    isLoading: isLoadingTransactions,
    isError,
    refetch: refetchTransactions,
  } = useGetCurrentUserStoreTransactions();

  const { store, isLoading: isLoadingStore } = useGetStoreById(storeId || "");
  const { souvenirs, isLoading: isLoadingSouvenirs } = useGetSouvenirs();

  // Combined refetch function with auth check
  const handleRefetch = useCallback(async () => {
    const canProceed = await safeRefetch();
    if (canProceed) {
      refetchTransactions();
    }
  }, [safeRefetch, refetchTransactions]);

  // Initial data load with auth check
  useEffect(() => {
    if (auth?.user) {
      refetchTransactions();
    }
  }, [auth, refetchTransactions]);

  // Error handling for auth related issues
  useEffect(() => {
    if (isError && auth?.user) {
      // Check if error is auth related (you might need to adjust this depending on your error structure)
      handleRefetch();
    }
  }, [isError, auth, handleRefetch]);

  const isLoading =
    isLoadingTransactions || isLoadingStore || isLoadingSouvenirs;

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
          <Button onClick={handleRefetch}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  // Get IDs of souvenirs belonging to this store
  const storeSouvenirIds = React.useMemo(() => {
    if (!souvenirs || !storeId) return [];

    return souvenirs
      .filter((souvenir) => souvenir.storeId === storeId)
      .map((souvenir) => souvenir.id);
  }, [souvenirs, storeId]);

  // Filter transactions by store's souvenirs - with null checks
  const storeTransactions = React.useMemo(() => {
    if (
      !currentUserStoreTransactions ||
      !Array.isArray(currentUserStoreTransactions) ||
      !storeSouvenirIds ||
      storeSouvenirIds.length === 0
    )
      return [];

    return currentUserStoreTransactions.filter((transaction) =>
      storeSouvenirIds.includes(transaction.souvenirId),
    );
  }, [currentUserStoreTransactions, storeSouvenirIds]);

  const sortedTransactions = React.useMemo(() => {
    if (!storeTransactions || !storeTransactions.length) return [];

    const sortableTransactions = [...storeTransactions];

    if (sortConfig.key) {
      sortableTransactions.sort((a, b) => {
        // Null check for values
        const aValue = a[sortConfig.key!] || "";
        const bValue = b[sortConfig.key!] || "";

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableTransactions;
  }, [storeTransactions, sortConfig]);

  const filteredTransactions = React.useMemo(() => {
    if (!sortedTransactions || !sortedTransactions.length) return [];

    if (!searchTerm) return sortedTransactions;

    const searchTermLower = searchTerm.toLowerCase();
    return sortedTransactions.filter(
      (transaction) =>
        (transaction.id &&
          transaction.id.toLowerCase().includes(searchTermLower)) ||
        (transaction.souvenirId &&
          transaction.souvenirId.toLowerCase().includes(searchTermLower)) ||
        (transaction.customerId &&
          transaction.customerId.toLowerCase().includes(searchTermLower)) ||
        (transaction.status &&
          transaction.status.toLowerCase().includes(searchTermLower)),
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
    if (!filteredTransactions || !filteredTransactions.length) return 0;

    return filteredTransactions.reduce((sum, transaction) => {
      const price = transaction.price || 0;
      const quantity = transaction.quantity || 0;
      return sum + price * quantity;
    }, 0);
  }, [filteredTransactions]);

  // Get souvenir name by id - with null checks
  const getSouvenirName = (souvenirId: string) => {
    if (!souvenirId || !souvenirs) return "Unknown Item";
    const souvenir = souvenirs.find((s) => s && s.id === souvenirId);
    return souvenir ? souvenir.name : "Unknown Item";
  };

  return (
    <>
      <StoreNavbar />
      <div className="w-full p-4 md:p-20 flex">
        <Card className="w-full mt-4 md:mt-10">
          <CardHeader>
            <CardTitle>
              {isLoadingStore ? "Loading..." : store?.name || "Store"}{" "}
              Transaction History
            </CardTitle>
            <CardDescription>
              Your purchase history from{" "}
              {isLoadingStore ? "this store" : store?.name || "this store"}
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
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">Sort by:</span>
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
                <Button variant="outline" size="sm" onClick={handleRefetch}>
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
                No transactions found for this store
              </div>
            ) : (
              <>
                <div className="rounded-md border overflow-x-auto">
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
                        <TableRow
                          key={transaction.id || Math.random().toString()}
                        >
                          <TableCell>
                            {transaction.transactionDate
                              ? new Date(transaction.transactionDate)
                                  .toLocaleString()
                                  .replace(",", "")
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {getSouvenirName(transaction.souvenirId)}
                          </TableCell>
                          <TableCell>{transaction.quantity || 0}</TableCell>
                          <TableCell>
                            ${(transaction.price || 0).toFixed(2)}
                          </TableCell>
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
                              {transaction.status || "Unknown"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            $
                            {(
                              (transaction.quantity || 0) *
                              (transaction.price || 0)
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 pt-4 border-t gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredTransactions.length} of{" "}
                      {storeTransactions.length} store transactions
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
