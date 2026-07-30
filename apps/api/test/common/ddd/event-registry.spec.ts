import { EventRegistry } from '@/common/ddd';

describe('EventRegistry', () => {
  it('should register handlers', () => {
    const registry = new EventRegistry();

    const handler = {
      handle: jest.fn(),
    };

    registry.register(
      'OrganizationCreatedEvent',
      handler,
    );

    expect(
      registry.getHandlers(
        'OrganizationCreatedEvent',
      ),
    ).toHaveLength(1);
  });
});