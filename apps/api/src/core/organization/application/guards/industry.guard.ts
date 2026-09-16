import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PrismaService } from '@/common/prisma';

import { IndustryType } from '../../domain/enums/industry-type.enum';
import { INDUSTRY_KEY } from '../decorators/require-industry.decorator';

interface RequestWithAuthenticatedUser {
  user?: { organizationId: string };
}

/**
 * An org outside a route's @RequireIndustry() list gets a 404, matching
 * an unrecognized path — never a 403, which would confirm the route
 * exists for some other industry. Keeps industry modules invisible to
 * organizations that never activated them.
 */
@Injectable()
export class IndustryGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<IndustryType[]>(
      INDUSTRY_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required || required.length === 0) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<RequestWithAuthenticatedUser>();

    const organization = request.user?.organizationId
      ? await this.prisma.client.organization.findUnique({
          where: { id: request.user.organizationId },
          select: { industry: true },
        })
      : null;

    if (!organization || !required.includes(organization.industry as IndustryType)) {
      throw new NotFoundException();
    }

    return true;
  }
}
