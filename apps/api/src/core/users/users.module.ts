import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './domain/repositories';
import { UserPrismaRepository } from './infrastructure/prisma/user.prisma.repository';
import { UserController } from './presentation/controllers/user.controller';
import { GetUserHandler } from './application/get-user/get-user.handler';
import { ListUsersHandler } from './application/list-user';
import { AuditModule } from '../audit/audit.module';
import { UserAuditLogHandler } from './application/event-handlers/audit-log.handler';
import { SendWelcomeEmailHandler } from './application/event-handlers/send-welcome-email.handler';
import { PasswordHasherService } from '@/common/security';
import { AssignDefaultRoleHandler } from '../rbac/application/event-handlers/assign-default-role.handler';
import { InviteUserHandler } from './application/invite-user/invite-user.handler';
import { AssignRoleHandler } from './application/assign-role/assign-role.handler';
import { NotificationModule } from '../notification/notification.module';
import { UpdateUserStatusHandler } from './application/update-status/update-user-status.handler';
import { AssignBranchHandler } from './application/assign-branch/assign-branch.handler';
import { BranchModule } from '../branch';

@Module({
  imports: [AuditModule, NotificationModule, BranchModule],
  controllers: [UserController],
  providers: [
    GetUserHandler,
    ListUsersHandler,
    InviteUserHandler,
    AssignDefaultRoleHandler,
    UserAuditLogHandler,
    SendWelcomeEmailHandler,
    PasswordHasherService,
    UserPrismaRepository,
    AssignRoleHandler,
    AssignDefaultRoleHandler,
    UpdateUserStatusHandler,
    AssignBranchHandler,
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
