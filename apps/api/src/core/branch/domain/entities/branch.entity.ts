import { AggregateRoot } from '@/common/ddd';
import { BranchCreatedEvent } from '../events';
import { BranchStatus } from '../enums';

export interface CreateBranchProps {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  description?: string;
}

export class Branch
  extends AggregateRoot<string>
{
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly name: string,
    public readonly code: string,
    public readonly status: BranchStatus,
    public readonly description?: string,
  ) {
    super(id);
  }

  public static create(
    props: CreateBranchProps,
  ): Branch {

    const branch = new Branch(
      props.id,
      props.organizationId,
      props.name,
      props.code,
      BranchStatus.ACTIVE,
      props.description,
    );

    branch.addDomainEvent(
      new BranchCreatedEvent(
        branch.id,
        branch.organizationId,
        branch.name,
      ),
    );

    return branch;
  }
}