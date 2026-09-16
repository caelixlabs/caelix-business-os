import { Module } from "@nestjs/common";

import { MembershipPlanController } from "./plans/membership-plan.controller";
import { MembershipPlanService } from "./plans/membership-plan.service";
import { MembershipSubscriptionController } from "./subscriptions/membership-subscription.controller";
import { MembershipSubscriptionService } from "./subscriptions/membership-subscription.service";

@Module({
  controllers: [MembershipPlanController, MembershipSubscriptionController],
  providers: [MembershipPlanService, MembershipSubscriptionService],
})
export class MembershipsModule {}
