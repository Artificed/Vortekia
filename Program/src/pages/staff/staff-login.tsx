import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useStaffLoginForm from "@/hooks/forms/use-staff-login-form";

export default function StaffLogin() {
  const { formData, error, loading, handleChange, handleLogin } =
    useStaffLoginForm();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Staff Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button onClick={handleLogin} disabled={loading} className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
