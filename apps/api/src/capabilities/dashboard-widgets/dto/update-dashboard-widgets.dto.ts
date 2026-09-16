import { IsObject } from "class-validator";

export class UpdateDashboardWidgetsDto {
  @IsObject()
  widgets!: Record<string, boolean>;
}
