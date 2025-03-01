import Staff from "../entities/staff";
import StaffSchedule from "../entities/staff-schedule";

interface StaffWithSchedule {
  staff: Staff;
  schedules: StaffSchedule[];
}

export default StaffWithSchedule;
