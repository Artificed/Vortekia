interface MaintenanceRequest {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  approved: number;
  done: number;
}

export default MaintenanceRequest;
