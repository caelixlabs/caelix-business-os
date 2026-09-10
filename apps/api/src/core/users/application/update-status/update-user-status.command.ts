import { UserStatus } from '../../domain/enum';

export class UpdateUserStatusCommand {
  constructor(
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly status: UserStatus,
  ) {}
}