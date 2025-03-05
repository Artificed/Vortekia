interface MaintenanceLog {
  id: string;
  taskId: string;
  message: string;
  createdAt: Date;
  approved: number;
  done: number;
}

export default MaintenanceLog;
