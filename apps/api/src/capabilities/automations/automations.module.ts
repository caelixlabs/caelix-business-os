import { Module } from "@nestjs/common";

import { AUTOMATION_HANDLERS } from "./automation-handlers";
import { AutomationEngineService } from "./automation-engine.service";
import { AutomationsController } from "./automations.controller";
import { AutomationsService } from "./automations.service";

@Module({
  controllers: [AutomationsController],
  providers: [AutomationsService, AutomationEngineService, ...AUTOMATION_HANDLERS],
})
export class AutomationsModule {}
