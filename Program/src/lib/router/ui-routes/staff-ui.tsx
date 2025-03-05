import CeoDashboard from "@/pages/staff/ceo/ceo-dashboard";
import CeoViewRestaurantProposals from "@/pages/staff/ceo/ceo-view-restaurant-proposals";
import CeoViewStoreProposals from "@/pages/staff/ceo/ceo-view-store-proposals";
import CfoDashboard from "@/pages/staff/cfo/cfo-dashboard";
import CfoViewRestaurantProposals from "@/pages/staff/cfo/cfo-view-restaurant-proposals";
import ChefDashboard from "@/pages/staff/chef/chef-dashboard";
import CooCreateStaff from "@/pages/staff/coo/coo-create-staff";
import CooDashboard from "@/pages/staff/coo/coo-dashboard";
import CooViewProposal from "@/pages/staff/coo/coo-view-proposals";
import CsChat from "@/pages/staff/customer-service/cs-chat";
import CsCreateCustomer from "@/pages/staff/customer-service/cs-create-customer";
import CsDashboard from "@/pages/staff/customer-service/cs-dashboard";
import FnbSupervisorDashboard from "@/pages/staff/fnb-supervisor/fnb-supervisor-dashboard";
import FnbSupervisorStaffManagement from "@/pages/staff/fnb-supervisor/fnb-supervisor-staff-management";
import LnfCreatelog from "@/pages/staff/lost-and-found-staff/lnf-create-log";
import LnfStaffDashboard from "@/pages/staff/lost-and-found-staff/lnf-staff-dashboard";
import MaintenanceManagerDashboard from "@/pages/staff/maintenance-manager/maintenance-manager-dashboard";
import ManageLogsPage from "@/pages/staff/maintenance-manager/manage-logs-page";
import MaintenanceStaffDashboard from "@/pages/staff/maintenance-staff/maintenance-staff-dashboard";
import RetailManagerDashboard from "@/pages/staff/retail-manager/retail-manager-dashboard";
import RetailManagerStoreDetail from "@/pages/staff/retail-manager/retail-manager-store-detail";
import RetailManagerViewSchedules from "@/pages/staff/retail-manager/retail-manager-view-schedules";
import RideManagerDashboard from "@/pages/staff/ride-manager/ride-manager-dashboard";
import RideManagerViewSchedules from "@/pages/staff/ride-manager/ride-manager-view-schedules";
import RideStaffDashboard from "@/pages/staff/ride-staff/ride-staff-dashboard";
import StaffLogin from "@/pages/staff/staff-login";
import WaiterDashboard from "@/pages/staff/waiter/waiter-dashboard";
import { Route, Routes } from "react-router";

export default function StaffUI() {
  return (
    <Routes>
      <Route path="/" element={<StaffLogin />} />

      {/* CS Routes */}
      <Route path="customer-service/dashboard" element={<CsDashboard />} />
      <Route
        path="customer-service/create-customer-account"
        element={<CsCreateCustomer />}
      />
      <Route path="customer-service/chat" element={<CsChat />} />

      {/* COO Routes */}
      <Route path="coo/dashboard" element={<CooDashboard />} />
      <Route path="coo/create-staff-account" element={<CooCreateStaff />} />
      <Route path="coo/view-ride-proposals" element={<CooViewProposal />} />

      {/* Lost And Found Staff Routes */}
      <Route
        path="lost-and-found-staff/dashboard"
        element={<LnfStaffDashboard />}
      />
      <Route path="lost-and-found-staff/add-log" element={<LnfCreatelog />} />

      {/* Ride Manager Routes */}
      <Route path="ride-manager/dashboard" element={<RideManagerDashboard />} />
      <Route
        path="ride-manager/view-schedules"
        element={<RideManagerViewSchedules />}
      />

      {/* Ride Staff Routes */}
      <Route path="ride-staff/dashboard" element={<RideStaffDashboard />} />

      {/* FnB Supervisor */}
      <Route
        path="fnb-supervisor/dashboard"
        element={<FnbSupervisorDashboard />}
      />
      <Route
        path="fnb-supervisor/staff-management"
        element={<FnbSupervisorStaffManagement />}
      />

      {/* Waiter */}
      <Route path="waiter/dashboard" element={<WaiterDashboard />} />

      {/* Chef */}
      <Route path="chef/dashboard" element={<ChefDashboard />} />

      {/* CFO */}
      <Route path="cfo/dashboard" element={<CfoDashboard />} />
      <Route
        path="cfo/view-restaurant-proposals"
        element={<CfoViewRestaurantProposals />}
      />

      {/* Maintenance Manager */}
      <Route
        path="maintenance-manager/dashboard"
        element={<MaintenanceManagerDashboard />}
      />
      <Route
        path="maintenance-manager/manage-logs"
        element={<ManageLogsPage />}
      />

      {/* Maintenance Staff */}
      <Route
        path="maintenance-staff/dashboard"
        element={<MaintenanceStaffDashboard />}
      />

      {/* CEO */}
      <Route path="ceo/dashboard" element={<CeoDashboard />} />
      <Route
        path="ceo/view-restaurant-proposals"
        element={<CeoViewRestaurantProposals />}
      />
      <Route
        path="ceo/view-store-proposals"
        element={<CeoViewStoreProposals />}
      />

      {/* Retail Manager */}
      <Route
        path="retail-manager/dashboard"
        element={<RetailManagerDashboard />}
      />
      <Route
        path="retail-manager/view-schedules"
        element={<RetailManagerViewSchedules />}
      />
      <Route
        path="retail-manager/store/:storeId"
        element={<RetailManagerStoreDetail />}
      />
    </Routes>
  );
}
