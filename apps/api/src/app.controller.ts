import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './common/prisma';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('/health')
  async health(){
    await this.prisma.client.$queryRaw`SELECT 1`;
    return {
      status: 'ok',
      database: 'connected',
    };
  }
}
