import CustomerServiceNavbar from "@/components/navbars/customer-service-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateCustomerAccount } from "@/hooks/forms/use-create-customer-account";

export default function CsCreateCustomer() {
  const { formData, setFormData, handleChange, handleSubmit, loading } =
    useCreateCustomerAccount();

  return (
    <>
      <CustomerServiceNavbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-xl">Create Customer Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <Input
              type="text"
              name="balance"
              placeholder="Balance"
              value={formData.balance}
              onChange={handleChange}
            />
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
