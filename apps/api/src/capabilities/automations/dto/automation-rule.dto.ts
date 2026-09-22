import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsIn, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested, IsArray } from "class-validator";
import { AutomationActionType } from "@caelix-business-os/database";

import { AUTOMATION_TRIGGER_KEYS } from "../automation-triggers";

export class AutomationConditionDto {
  @IsString()
  @IsNotEmpty()
  field!: string;

  @IsString()
  equals!: string;
}

export class CreateAutomationRuleDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsIn(AUTOMATION_TRIGGER_KEYS)
  trigger!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AutomationConditionDto)
  conditions?: AutomationConditionDto[];

  @IsEnum(AutomationActionType)
  actionType!: AutomationActionType;

  @IsObject()
  actionConfig!: Record<string, string>;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class UpdateAutomationRuleDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AutomationConditionDto)
  conditions?: AutomationConditionDto[];

  @IsOptional()
  @IsObject()
  actionConfig?: Record<string, string>;
}
