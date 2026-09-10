import { randomUUID } from 'crypto';

export class customUUID {
  static generate(): string {
    return randomUUID().replace(/-/g, '');
  }
}
