import { AggregateRoot } from '@/common/ddd';
import { UserStatus } from '../enum';
import { UserRegisteredEvent } from '../events';

export interface CreateUserProps {
  id: string;
  organizationId: string;
  branchId?: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
}

/**
 * A User always belongs to exactly one Organization (the tenant
 * boundary) and optionally to one Branch. Registration raises
 * UserRegisteredEvent — consumed by RBAC's default-role assignment
 * handler (see core/rbac/application/event-handlers) so every new user
 * gets a baseline role without the Authentication module needing to
 * know anything about RBAC internals.
 */
export class User extends AggregateRoot<string> {
  private _branchId?: string;
  private _passwordHash: string;
  private _firstName: string;
  private _lastName: string;
  private _status: UserStatus;
  private _lastLoginAt?: Date;

  constructor(
    id: string,
    public readonly organizationId: string,
    branchId: string | undefined,
    private readonly _email: string,
    passwordHash: string,
    firstName: string,
    lastName: string,
    status: UserStatus,
    lastLoginAt?: Date,
  ) {
    super(id);
    this._branchId = branchId;
    this._passwordHash = passwordHash;
    this._firstName = firstName;
    this._lastName = lastName;
    this._status = status;
    this._lastLoginAt = lastLoginAt;
  }

  public static register(props: CreateUserProps): User {
    const user = new User(
      props.id,
      props.organizationId,
      props.branchId,
      props.email.trim().toLowerCase(),
      props.passwordHash,
      props.firstName.trim(),
      props.lastName.trim(),
      UserStatus.ACTIVE,
    );

    user.addDomainEvent(
      new UserRegisteredEvent(user.id, user.organizationId, user.email),
    );

    return user;
  }

  public recordLogin(): void {
    this._lastLoginAt = new Date();
  }

  public changePasswordHash(newHash: string): void {
    this._passwordHash = newHash;
  }

  public suspend(): void {
    this._status = UserStatus.SUSPENDED;
  }

  public reactivate(): void {
    this._status = UserStatus.ACTIVE;
  }

  public assignBranch(branchId?: string): void {
    this._branchId = branchId;
  }

  get email(): string {
    return this._email;
  }
  get branchId(): string | undefined {
    return this._branchId;
  }
  get passwordHash(): string {
    return this._passwordHash;
  }
  get firstName(): string {
    return this._firstName;
  }
  get lastName(): string {
    return this._lastName;
  }
  get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }
  get status(): UserStatus {
    return this._status;
  }
  get lastLoginAt(): Date | undefined {
    return this._lastLoginAt;
  }
}
