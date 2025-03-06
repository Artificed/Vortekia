import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Search } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { useGetRestaurantTransactions } from "@/hooks/data/use-get-restaurant-transactions";
import RestaurantTransaction from "@/lib/interfaces/entities/restaurant-transaction";
import { useGetRestaurants } from "@/hooks/data/use-get-restaurants";
import CfoNavbar from "@/components/navbars/cfo-navbar";

export default function CfoRestaurantTransactionsPage() {
  const { restaurantTransactions, isLoading } = useGetRestaurantTransactions();
  const { restaurants, isLoading: isLoadingRestaurants } = useGetRestaurants();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [restaurantFilter, setRestaurantFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const [filteredTransactions, setFilteredTransactions] = useState<
    RestaurantTransaction[]
  >([]);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);

  useEffect(() => {
    if (!restaurantTransactions) return;

    let filtered = [...restaurantTransactions];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (transaction) =>
          transaction.id.toLowerCase().includes(query) ||
          transaction.menuId.toLowerCase().includes(query) ||
          transaction.customerId.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (transaction) =>
          transaction.status.toLowerCase() === statusFilter.toLowerCase(),
      );
    }

    // Add restaurant filter logic
    if (restaurantFilter !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.restaurantId === restaurantFilter,
      );
    }

    if (dateRange?.from) {
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.transactionDate);
        if (dateRange.from && transactionDate < dateRange.from) return false;
        if (dateRange.to && transactionDate > dateRange.to) return false;
        return true;
      });
    }

    setFilteredTransactions(filtered);

    if (restaurantTransactions.length > 0) {
      const total = filtered.reduce(
        (sum, transaction) => sum + transaction.price * transaction.quantity,
        0,
      );
      setTotalRevenue(total);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTransactions = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.transactionDate);
        transactionDate.setHours(0, 0, 0, 0);
        return transactionDate.getTime() === today.getTime();
      });
      const todayTotal = todayTransactions.reduce(
        (sum, transaction) => sum + transaction.price * transaction.quantity,
        0,
      );
      setTodayRevenue(todayTotal);

      setAverageOrderValue(total / filtered.length || 0);
    }
  }, [
    restaurantTransactions,
    searchQuery,
    statusFilter,
    dateRange,
    restaurantFilter,
  ]); // Add restaurantFilter to dependencies

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "MMM d, yyyy");
  };

  const truncateId = (id: string) => {
    return id.length > 8 ? `${id.substring(0, 8)}...` : id;
  };

  // Add function to reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setRestaurantFilter("all");
    setDateRange({
      from: addDays(new Date(), -30),
      to: new Date(),
    });
  };

  return (
    <>
      <CfoNavbar />
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6 mt-20">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Restaurant Transactions
            </h1>
            <p className="text-muted-foreground">
              View and manage all transactions for your restaurant
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  For the selected period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(todayRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(), "MMMM d, yyyy")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Order Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(averageOrderValue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {filteredTransactions.length} transactions
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by ID, menu item, or customer..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Add Restaurant Filter */}
            <div className="w-full md:w-[200px] space-y-2">
              <Label htmlFor="restaurant">Restaurant</Label>
              <Select
                value={restaurantFilter}
                onValueChange={setRestaurantFilter}
              >
                <SelectTrigger id="restaurant">
                  <SelectValue placeholder="Select restaurant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Restaurants</SelectItem>
                  {!isLoadingRestaurants &&
                    restaurants?.map((restaurant) => (
                      <SelectItem key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-[200px] space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-auto space-y-2">
              <Label>Date Range</Label>
              <DatePickerWithRange
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </div>

            <Button
              variant="outline"
              className="mt-2 md:mt-0"
              onClick={resetFilters}
            >
              <Filter className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>

            <Button className="mt-2 md:mt-0">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Restaurant ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Menu Item</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {truncateId(transaction.id)}
                      </TableCell>
                      <TableCell>{transaction.restaurantId}</TableCell>
                      <TableCell>
                        {formatDate(transaction.transactionDate)}
                      </TableCell>
                      <TableCell>{transaction.menuId}</TableCell>
                      <TableCell>{transaction.customerId}</TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>{formatCurrency(transaction.price)}</TableCell>
                      <TableCell>
                        {formatCurrency(
                          transaction.price * transaction.quantity,
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            transaction.status.toLowerCase() === "completed"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : transaction.status.toLowerCase() === "pending"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
