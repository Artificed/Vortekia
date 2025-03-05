import MaintenanceTaskModal from "@/components/modals/maintenance-task-modal";
import MaintenanceManagerNavbar from "@/components/navbars/maintenance-manager-navbar";

export default function MaintenanceManagerDashboard() {
  return (
    <>
      <MaintenanceManagerNavbar />
      <div className="translate-y-96">
        <MaintenanceTaskModal />
      </div>
    </>
  );
}
