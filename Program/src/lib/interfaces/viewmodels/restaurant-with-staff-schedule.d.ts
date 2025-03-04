import Restaurant from "../entities/restaurant";
import StaffWithSchedule from "./staff-with-schedule";

interface RestaurantWithStaffSchedule {
  restaurant: Restaurant;
  staffWithSchedule: StaffWithSchedule[];
}

export default RestaurantWithStaffSchedule;
