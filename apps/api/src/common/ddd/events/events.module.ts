import { Global, Module } from '@nestjs/common';
import {
  DiscoveryModule,
} from '@nestjs/core';
import { EventBus } from './bus';
import { EventDiscoveryService } from './discovery';
import { EventRegistry } from './registry';

@Global()
@Module({
  imports: [
    DiscoveryModule,
  ],

  providers: [
    EventRegistry,
    EventBus,
    EventDiscoveryService,
  ],

  exports: [
    EventRegistry,
    EventBus,
  ],
})
export class EventsModule {}