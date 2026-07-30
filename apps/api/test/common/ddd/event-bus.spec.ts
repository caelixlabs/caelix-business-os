import {
  DomainEvent,
  EventBus,
  EventRegistry,
} from '@/common/ddd';

class TestEvent implements DomainEvent {
  occurredOn = new Date();
}

describe('EventBus', () => {
  it('should publish event', async () => {
    const registry = new EventRegistry();

    const handler = {
      handle: jest.fn(),
    };

    registry.register(
      TestEvent.name,
      handler,
    );

    const bus = new EventBus(registry);

    await bus.publish(
      new TestEvent(),
    );

    expect(handler.handle)
      .toHaveBeenCalledTimes(1);
  });

  it('should publish multiple events', async () => {
    const registry = new EventRegistry();

    const handler = {
      handle: jest.fn(),
    };

    registry.register(
      TestEvent.name,
      handler,
    );

    const bus = new EventBus(registry);

    await bus.publishAll([
      new TestEvent(),
      new TestEvent(),
    ]);

    expect(handler.handle)
      .toHaveBeenCalledTimes(2);
  });
});