import 'reflect-metadata';

import {
  EVENT_HANDLER_METADATA,
  EventHandler,
  IEventHandler,
  DomainEvent,
} from '../../../src/common/ddd';

class TestEvent implements DomainEvent {
  readonly occurredOn = new Date();

  constructor(
    public readonly id: string,
  ) {}
}

@EventHandler(TestEvent)
class TestEventHandler
  implements IEventHandler<TestEvent>
{
  async handle(
    event: TestEvent,
  ): Promise<void> {
    console.log(event.id);
  }
}

describe('EventHandler Decorator', () => {
  it('should attach event metadata to the handler', () => {
    const metadata = Reflect.getMetadata(
      EVENT_HANDLER_METADATA,
      TestEventHandler,
    );

expect(metadata).toEqual({
  event: TestEvent,
});

expect(metadata.event).toBe(TestEvent);

expect(metadata.event.name).toBe('TestEvent');
  });
});