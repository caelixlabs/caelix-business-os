export const EVENT_HANDLER_METADATA = Symbol('EVENT_HANDLER_METADATA');

export interface EventHandlerMetadata {
  event: Function;
}
export const EVENT_DISPATCHER = Symbol('EVENT_DISPATCHER');
