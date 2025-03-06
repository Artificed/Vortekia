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
import { useGetAllRideTransactions } from "@/hooks/data/use-get-all-ride-transactions";
import CfoNavbar from "@/components/navbars/cfo-navbar";

export default function CfoRideTransactionsPage() {
  const { rideTransactions, isLoading } = useGetAllRideTransactions();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const [filteredTransactions, setFilteredTransactions] = useState<
    typeof rideTransactions
  >([]);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [averageRideValue, setAverageRideValue] = useState(0);

  useEffect(() => {
    if (!rideTransactions) return;

    let filtered = [...rideTransactions];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (transaction) =>
          transaction.id.toLowerCase().includes(query) ||
          transaction.rideId.toLowerCase().includes(query) ||
          transaction.customerId.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (transaction) =>
          transaction.status.toLowerCase() === statusFilter.toLowerCase(),
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

    if (rideTransactions.length > 0) {
      const total = filtered.reduce(
        (sum, transaction) => sum + transaction.ridePrice,
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
        (sum, transaction) => sum + transaction.ridePrice,
        0,
      );
      setTodayRevenue(todayTotal);

      setAverageRideValue(total / filtered.length || 0);
    }
  }, [rideTransactions, searchQuery, statusFilter, dateRange]);

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

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateRange({
      from: addDays(new Date(), -30),
      to: new Date(),
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <>
      <CfoNavbar />
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6 mt-20">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Ride Transactions
            </h1>
            <p className="text-muted-foreground">
              View and manage all ride transactions
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
                  Average Ride Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(averageRideValue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {filteredTransactions?.length || 0} transactions
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
                  placeholder="Search by ID, ride, or customer..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Ride ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : !filteredTransactions ||
                  filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {truncateId(transaction.id)}
                      </TableCell>
                      <TableCell>
                        {truncateId(transaction.customerId)}
                      </TableCell>
                      <TableCell>{truncateId(transaction.rideId)}</TableCell>
                      <TableCell>
                        {formatDate(transaction.transactionDate)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(transaction.ridePrice)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusBadgeClass(transaction.status)}
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
