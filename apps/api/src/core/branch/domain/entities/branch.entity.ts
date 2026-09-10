import { AggregateRoot } from '@/common/ddd';
import { BranchCreatedEvent } from '../events';
import { BranchStatus, BranchType } from '../enums';

export interface CreateBranchProps {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  type: BranchType;
  description?: string;
}

export const PRIMARY_BRANCH_CODE = 'DEFAULT';

/**
 * Branch is the operational boundary within an Organization. Every
 * organization has exactly one PRIMARY branch (auto-created by
 * CreateDefaultBranchHandler reacting to OrganizationCreatedEvent) and
 * any number of STANDARD branches.
 */
export class
  Branch extends AggregateRoot<string> {
  private _name: string;
  private readonly _code: string;
  private readonly _type: BranchType;
  private _status: BranchStatus;
  private _description?: string;

  constructor(
    id: string,
    public readonly organizationId: string,
    name: string,
    code: string,
    type: BranchType,
    status: BranchStatus,
    description?: string,
  ) {
    super(id);
    this._name = name;
    this._code = code;
    this._type = type;
    this._status = status;
    this._description = description;
  }

  public static create(props: CreateBranchProps): Branch {
    const branch = new Branch(
      props.id,
      props.organizationId,
      props.name.trim(),
      props.code.trim().toUpperCase(),
      props.type,
      BranchStatus.ACTIVE,
      props.description?.trim(),
    );

    branch.addDomainEvent(
      new BranchCreatedEvent(branch.id, branch.organizationId, branch.name),
    );

    return branch;
  }

  /** Deterministic PRIMARY branch, created immediately after an Organization is created. */
  public static createPrimary(organizationId: string, id: string): Branch {
    return Branch.create({
      id,
      organizationId,
      name: 'Main Branch',
      code: PRIMARY_BRANCH_CODE,
      type: BranchType.PRIMARY,
      description: `Default branch for organization ${organizationId}`,
    });
  }

  public updateDetails(params: {
    name: string;
    description?: string;
  }): void {
    this._name = params.name.trim();
    this._description = params.description?.trim();
  }

  public rename(name: string): void {
    this._name = name.trim();
  }

  public archive(): void {
    if (this._type === BranchType.PRIMARY) {
      throw new Error('The PRIMARY branch cannot be archived.');
    }
    this._status = BranchStatus.ARCHIVED;
  }

  public activate(): void {
    this._status = BranchStatus.ACTIVE;
  }

  get name(): string {
    return this._name;
  }
  get code(): string {
    return this._code;
  }
  get type(): BranchType {
    return this._type;
  }
  get status(): BranchStatus {
    return this._status;
  }
  get description(): string | undefined {
    return this._description;
  }
}
