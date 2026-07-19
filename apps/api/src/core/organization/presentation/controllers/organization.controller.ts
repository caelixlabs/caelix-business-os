import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateOrganizationHandler, GetOrganizationHandler, GetOrganizationsHandler } from "../../application/create-organization/create-organization.handler";
import { CreateOrganizationDto } from "../../application/create-organization/create-organization.dto";
import { CreateOrganizationCommand } from "../../application/create-organization/create-organization.command";
import { GetOrganizationQuery } from "../../application/get-organization/get-organization.query";
import { UpdateOrganizationDto } from "../../application/update-organization/update-organization.dto";
import { UpdateOrganizationCommand } from "../../application/update-organization/update-organization.command";
import { UpdateOrganizationHandler } from "../../application/update-organization/update-organization.handler";
import { ListOrganizationsHandler } from "../../application/list-organizations/list-organizations.handler";
import { ListOrganizationsQuery } from "../../application/list-organizations/list-organizations.query";
import { DeleteOrganizationCommand } from "../../application/delete-organization/delete-organizations.command";
import { DeleteOrganizationHandler } from "../../application/delete-organization/delete-organizations.handler";

@Controller('organizations')
export class OrganizationController {
  constructor(
  private readonly createOrganizationHandler: CreateOrganizationHandler,
  private readonly getOrganizationHandler: GetOrganizationHandler,
  private readonly getOrganizationsHandler: GetOrganizationsHandler,
  private readonly updateOrganizationHandler: UpdateOrganizationHandler,
  private readonly listOrganizationsHandler: ListOrganizationsHandler,
  private readonly deleteOrganizationHandler: DeleteOrganizationHandler,
) {}

  @Post()
  create(
    @Body() dto: CreateOrganizationDto
  ) {
    return this.createOrganizationHandler.execute(
      new CreateOrganizationCommand(dto),
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string
  ) {
    return this.getOrganizationHandler.execute(
      new GetOrganizationQuery(id),
    );
  }

  @Get()
  findAll() {
    return this.getOrganizationsHandler.execute();
  }
  
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationDto,
  ) {
    return this.updateOrganizationHandler.execute(
      new UpdateOrganizationCommand(id, dto),
    );
  }
  @Get()
  list() {
    return this.listOrganizationsHandler.execute(
      new ListOrganizationsQuery(),
    );
  }
  @Delete(':id')
  delete(
    @Param('id') id: string,
  ) {
    return this.deleteOrganizationHandler.execute(
      new DeleteOrganizationCommand(id),
    );
  }
}