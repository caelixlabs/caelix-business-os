export abstract class Entity<TId = string> {
  protected constructor(public readonly id: TId) {}

  public equals(object?: Entity<TId>): boolean {
    if (!object) {
      return false;
    }

    if (this === object) {
      return true;
    }

    return this.id === object.id;
  }
}