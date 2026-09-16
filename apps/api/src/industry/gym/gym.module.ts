import { Module } from "@nestjs/common";

import { GymMemberController } from "./members/gym-member.controller";
import { GymMemberService } from "./members/gym-member.service";
import { GymClassController } from "./classes/gym-class.controller";
import { GymClassService } from "./classes/gym-class.service";
import { GymAttendanceController } from "./attendance/gym-attendance.controller";
import { GymAttendanceService } from "./attendance/gym-attendance.service";
import { GymDashboardController } from "./dashboard/gym-dashboard.controller";
import { GymDashboardService } from "./dashboard/gym-dashboard.service";

@Module({
  controllers: [GymMemberController, GymClassController, GymAttendanceController, GymDashboardController],
  providers: [GymMemberService, GymClassService, GymAttendanceService, GymDashboardService],
})
export class GymModule {}
