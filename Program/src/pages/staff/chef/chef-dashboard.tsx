import useAuth from "@/hooks/auth/use-auth";
import { useGetStaffAssignedRestaurant } from "@/hooks/data/use-get-staff-assigned-restaurant";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import RestaurantTransaction from "@/lib/interfaces/entities/restaurant-transaction";
import { invoke } from "@tauri-apps/api/core";
import { ToastUtils } from "@/components/utils/toast-helper";
import { useQueryClient } from "@tanstack/react-query";
import { useGetRestaurantTransactionsByRestaurant } from "@/hooks/data/use-get-restaurant-transactions-by-restaurant";
import useTransactionStatusBadge from "@/hooks/utility/use-get-transaction-status-badge";
import ChefNavbar from "@/components/navbars/chef-navbar";

export default function ChefDashboard() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const { assignedRestaurant } = useGetStaffAssignedRestaurant(
    auth?.user?.id || "",
  );
  const { restaurantTransactions } = useGetRestaurantTransactionsByRestaurant(
    assignedRestaurant?.id ?? "",
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTransactions = (restaurantTransactions || []).filter(
    (transaction: RestaurantTransaction) =>
      (statusFilter === "all" || transaction.status === statusFilter) &&
      (transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.menuId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customerId
          .toLowerCase()
          .includes(searchTerm.toLowerCase())),
  );

  const { getStatusBadgeColor } = useTransactionStatusBadge();

  const markReadyToServe = async (transactionId: string) => {
    try {
      await invoke("update_restaurant_transaction_status", {
        id: transactionId,
        newStatus: "Ready to Serve",
      });
      ToastUtils.success({
        description: "Successfully marked order as ready to serve!",
      });
      queryClient.invalidateQueries({ queryKey: ["restaurantTransactions"] });
    } catch (error) {
      ToastUtils.error({
        description: String(error),
      });
    }
  };

  return (
    <>
      <ChefNavbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <Card className="w-full max-w-6xl">
          <CardHeader>
            <CardTitle className="text-2xl">Restaurant Transactions</CardTitle>
            <CardDescription>
              View and manage restaurant transaction logs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search Transaction"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Menu Item</TableHead>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Transaction Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center w-44">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.id}
                      </TableCell>
                      <TableCell>{transaction.menuId}</TableCell>
                      <TableCell>{transaction.customerId}</TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>${transaction.price.toFixed(2)}</TableCell>
                      <TableCell>
                        {transaction.transactionDate
                          .toString()
                          .replace("T", " ")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusBadgeColor(transaction.status)}
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          {transaction.status === "Cooking" ? (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => markReadyToServe(transaction.id)}
                            >
                              Finish Cooking
                            </Button>
                          ) : (
                            <h1>-</h1>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-gray-500"
                    >
                      No transactions found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
