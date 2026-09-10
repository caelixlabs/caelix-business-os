import 'reflect-metadata';

import { EVENT_HANDLER_METADATA } from '../constants';

export function EventHandler(event: Function): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(EVENT_HANDLER_METADATA, { event }, target);
  };
}
