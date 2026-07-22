import { AggregateRoot } from '@/common/ddd';

export class Organization extends AggregateRoot<string> {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly description?: string,
  ) {
    super(id);
  }
}