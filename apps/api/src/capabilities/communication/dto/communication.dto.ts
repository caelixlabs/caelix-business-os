import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { MessageChannel } from "@caelix-business-os/database";

export class SendMessageDto {
  @IsEnum(MessageChannel)
  channel!: MessageChannel;

  @IsOptional()
  @IsString()
  contactId?: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsString()
  @IsNotEmpty()
  body!: string;
}

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(MessageChannel)
  channel!: MessageChannel;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsString()
  @IsNotEmpty()
  body!: string;
}

export class UpdateTemplateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  body?: string;
}
