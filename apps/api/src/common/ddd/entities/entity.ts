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

  /**
   * Ensures NestJS serializes the entity using its public getter names
   * (id, name, slug…) rather than the private backing fields
   * (_name, _slug…). Without this, JSON.stringify picks up every
   * enumerable own property on the object, including the underscore-
   * prefixed backing fields that TypeScript's `private` keyword does
   * not actually hide at runtime.
   *
   * This is NOT a substitute for proper response DTOs — controllers
   * should still map domain entities to DTOs before returning them.
   * This is a defensive fallback for any place that accidentally
   * returns a domain entity directly.
   */
  toJSON(): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    // Walk the prototype chain collecting getter descriptors so we
    // get inherited getters too (e.g. `id` lives on Entity, `name`
    // lives on Organization, etc.)
    let proto = Object.getPrototypeOf(this) as object | null;
    while (proto && proto !== Object.prototype) {
      for (const key of Object.getOwnPropertyNames(proto)) {
        if (key === 'constructor') continue;
        const descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (descriptor?.get) {
          // Only include public-looking getter names (no underscore prefix)
          if (!key.startsWith('_')) {
            result[key] = (this as Record<string, unknown>)[key];
          }
        }
      }
      proto = Object.getPrototypeOf(proto) as object | null;
    }

    return result;
  }
}