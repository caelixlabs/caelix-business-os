import { IsString } from "class-validator";

export class AssignEnquiryDto {
  @IsString()
  userId!: string;
}
