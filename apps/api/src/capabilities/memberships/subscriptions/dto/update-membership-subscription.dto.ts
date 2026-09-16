import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { MembershipSubscriptionStatus } from "@caelix-business-os/database";

export class UpdateMembershipSubscriptionDto {
  @IsOptional()
  @IsEnum(MembershipSubscriptionStatus)
  status?: MembershipSubscriptionStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  sessionsRemaining?: number;

  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;
}
