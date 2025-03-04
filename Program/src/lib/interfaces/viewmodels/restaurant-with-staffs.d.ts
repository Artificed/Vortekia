import Restaurant from "../entities/restaurant";
import Staff from "../entities/staff";
import StaffWithSchedule from "./staff-with-schedule";

interface RestaurantWithStaffs {
  restaurant: Restaurant;
  staffs: Staff[];
}

export default RestaurantWithStaffs;
