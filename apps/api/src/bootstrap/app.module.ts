import { Module } from '@nestjs/common';
import { PrismaModule } from '../common/prisma/prisma.module';
import { KernelModule } from '../kernel/kernel.module';

@Module({
  imports: [
    PrismaModule,
    KernelModule,
  ],
})
export class AppModule {}