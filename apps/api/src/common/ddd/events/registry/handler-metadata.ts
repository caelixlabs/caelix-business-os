import { IEventHandler } from '../interfaces';

export interface HandlerMetadata {
  eventName: string;

  handler: IEventHandler;
}