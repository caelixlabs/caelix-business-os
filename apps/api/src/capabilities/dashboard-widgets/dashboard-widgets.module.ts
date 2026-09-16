import { Module } from "@nestjs/common";

import { DashboardWidgetsController } from "./dashboard-widgets.controller";
import { DashboardWidgetsService } from "./dashboard-widgets.service";

@Module({
  controllers: [DashboardWidgetsController],
  providers: [DashboardWidgetsService],
})
export class DashboardWidgetsModule {}
