import React, { useState } from "react";
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
import RestaurantTransaction from "@/lib/interfaces/entities/restaurant-transaction";
import { useGetCurrentUserRestaurantTransactions } from "@/hooks/data/use-get-current-user-restaurant-transactions";
import RestaurantNavbar from "@/components/navbars/restaurant-navbar";
import useAuth from "@/hooks/auth/use-auth";
import { useNavigate } from "react-router";

const TransactionHistoryPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  if (!auth?.user) {
    navigate("/");
  }

  const { currentUserRestaurantTransactions, isLoading, isError, refetch } =
    useGetCurrentUserRestaurantTransactions();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof RestaurantTransaction | null;
    direction: "ascending" | "descending";
  }>({
    key: "transactionDate",
    direction: "descending",
  });

  if (isError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your restaurant purchase history</CardDescription>
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

  const sortedTransactions = React.useMemo(() => {
    if (!currentUserRestaurantTransactions) return [];

    const sortableTransactions = [...currentUserRestaurantTransactions];

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
  }, [currentUserRestaurantTransactions, sortConfig]);

  const filteredTransactions = React.useMemo(() => {
    if (!sortedTransactions) return [];

    return sortedTransactions.filter(
      (transaction) =>
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.menuId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customerId.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [sortedTransactions, searchTerm]);

  const requestSort = (key: keyof RestaurantTransaction) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const totalSpent = React.useMemo(() => {
    if (!filteredTransactions) return 0;

    return filteredTransactions.reduce(
      (sum, transaction) => sum + transaction.price * transaction.quantity,
      0,
    );
  }, [filteredTransactions]);

  return (
    <>
      <RestaurantNavbar />
      <div className="w-full p-20 flex">
        <Card className="w-full mt-10">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your restaurant purchase history</CardDescription>
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
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Sort by:</span>
                <Select
                  onValueChange={(value) =>
                    requestSort(value as keyof RestaurantTransaction)
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
                        <TableHead
                          onClick={() => requestSort("menuId")}
                          className="cursor-pointer"
                        >
                          Menu Item{" "}
                          {sortConfig.key === "menuId" &&
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
                          className="cursor-pointer text-right"
                        >
                          Price{" "}
                          {sortConfig.key === "price" &&
                            (sortConfig.direction === "ascending" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {new Date(
                              transaction.transactionDate,
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{transaction.menuId}</TableCell>
                          <TableCell>{transaction.quantity}</TableCell>
                          <TableCell className="text-right">
                            ${transaction.price.toFixed(2)}
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
                      {currentUserRestaurantTransactions?.length || 0}{" "}
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
};

export default TransactionHistoryPage;
