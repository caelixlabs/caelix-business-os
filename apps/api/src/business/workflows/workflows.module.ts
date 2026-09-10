import { Global, Module, OnModuleInit } from "@nestjs/common";
import { WorkflowRegistryService } from "./application";
import { MUSIC_CUSTOMER_LIFECYCLE_WORKFLOW } from "@/industry/music-org/workflows/music-customer-lifecycle.workflow";
import { GYM_CUSTOMER_LIFECYCLE_WORKFLOW } from "@/industry/gym/workflows/gym-customer-lifecycle.workflow";

@Global()
@Module({
  providers: [WorkflowRegistryService],
  exports: [WorkflowRegistryService],
})
export class WorkflowsModule implements OnModuleInit {
  constructor(private readonly registry: WorkflowRegistryService) {}

  onModuleInit(): void {
    this.registry.register(MUSIC_CUSTOMER_LIFECYCLE_WORKFLOW);
    this.registry.register(GYM_CUSTOMER_LIFECYCLE_WORKFLOW);
  }
}
