import { Inject, Injectable, Logger } from '@nestjs/common';

import { EventHandler, IEventHandler } from '@/common/ddd';

import { UserRegisteredEvent } from '@/core/users/domain/events';
import { RBAC_REPOSITORY } from '../../domain/repositories';
import type { RbacRepository } from '../../domain/repositories';
import {
  DEFAULT_FIRST_USER_ROLE,
  DEFAULT_INVITED_USER_ROLE,
} from '../../domain/enums';

/**
 * Reacts to UserRegisteredEvent: whoever becomes this organization's
 * first OWNER gets that role; everyone after gets the baseline
 * EMPLOYEE role. Role escalation beyond that (promoting to
 * ADMIN/MANAGER, custom grants) is a deliberate follow-up action by an
 * existing OWNER/ADMIN, not something registration decides.
 *
 * Deliberately checks "does this org already have an OWNER" rather
 * than "how many users does this org have" — the latter raced itself
 * when the same event got handled more than once (see EventRegistry's
 * dedup fix) and is also just the wrong question: what actually
 * matters is whether an OWNER exists, not how many User rows exist.
 */
@Injectable()
@EventHandler(UserRegisteredEvent)
export class AssignDefaultRoleHandler
  implements IEventHandler<UserRegisteredEvent>
{
  private readonly logger = new Logger(AssignDefaultRoleHandler.name);

  constructor(
    @Inject(RBAC_REPOSITORY)
    private readonly rbacRepository: RbacRepository,
  ) {}

  async handle(event: UserRegisteredEvent): Promise<void> {
    const hasOwner = await this.rbacRepository.hasOwner(event.organizationId);
    const level = hasOwner ? DEFAULT_INVITED_USER_ROLE : DEFAULT_FIRST_USER_ROLE;

    await this.rbacRepository.assignSystemRole({
      userId: event.userId,
      organizationId: event.organizationId,
      level,
    });

    this.logger.log(`Assigned role ${level} to user ${event.userId}`);
  }
}