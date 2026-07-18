import { Body, Controller, Post } from "@nestjs/common";
import { CreateOrganizationHandler } from "../../application/ handlers/create-organization.handler";
import { CreateOrganizationDto } from "../../application/dto/create-organization.dto";
import { CreateOrganizationCommand } from "../../application/commands/create-organization.command";

@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly handler: CreateOrganizationHandler,
  ) {}

  @Post()
  create(
    @Body() dto: CreateOrganizationDto,
  ) {
    return this.handler.execute(
      new CreateOrganizationCommand(dto),
    );
  }
}