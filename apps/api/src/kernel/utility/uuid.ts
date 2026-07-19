import { v7 as uuidv7 } from 'uuid';

export class customUUID {
  static generate(): string {
    return uuidv7().replace(/-/g, '');
  }
}