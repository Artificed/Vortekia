import LnfStaffNavbar from "@/components/navbars/lnf-staff-navbar";
import { Card, CardContent } from "@/components/ui/card";

const LnfLoadingState: React.FC = () => (
  <>
    <LnfStaffNavbar />
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-6xl">
        <CardContent className="p-8 text-center">
          Loading lost and found logs...
        </CardContent>
      </Card>
    </div>
  </>
);

export default LnfLoadingState;
