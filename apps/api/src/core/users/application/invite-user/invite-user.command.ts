import { InviteUserDto } from "./invite-user.dto";


export class InviteUserCommand {
  constructor(
    public readonly organizationId: string,
    public readonly dto: InviteUserDto,
  ) {}
}
