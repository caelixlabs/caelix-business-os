import { Global, Module } from "@nestjs/common";

import { CommunicationController } from "./communication.controller";
import { CommunicationService } from "./communication.service";
import { TemplatesService } from "./templates.service";

@Global()
@Module({
  controllers: [CommunicationController],
  providers: [CommunicationService, TemplatesService],
  exports: [CommunicationService],
})
export class CommunicationModule {}
