interface MaintenanceTask {
  id: number;
  name: string;
  description: string;
  assignedStaff: String;
  startTime: Date;
  endTime: Date;
  status: string;
}

export default MaintenanceTask;
