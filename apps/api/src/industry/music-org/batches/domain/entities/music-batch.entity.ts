import { MusicBatchStatus } from "../enums/music-batch-status.enum";


export class MusicBatch {
  private constructor(
    private readonly props: {
      id: string;
      organizationId: string;
      branchId: string;
      courseId: string;
      teacherUserId?: string;
      name: string;
      capacity: number;
      startDate: Date;
      endDate?: Date;
      days: string[];
      startTime: string;
      endTime: string;
      status: MusicBatchStatus;
    },
  ) {}

  static create(props: MusicBatch['props']) {
    if (props.capacity <= 0) {
      throw new Error(
        'Batch capacity must be greater than zero.',
      );
    }

    if (props.startTime >= props.endTime) {
      throw new Error(
        'Batch start time must be before end time.',
      );
    }

    return new MusicBatch(props);
  }

  get id() { return this.props.id; }
  get organizationId() { return this.props.organizationId; }
  get branchId() { return this.props.branchId; }
  get courseId() { return this.props.courseId; }
  get teacherUserId() { return this.props.teacherUserId; }
  get name() { return this.props.name; }
  get capacity() { return this.props.capacity; }
  get startDate() { return this.props.startDate; }
  get endDate() { return this.props.endDate; }
  get days() { return this.props.days; }
  get startTime() { return this.props.startTime; }
  get endTime() { return this.props.endTime; }
  get status() { return this.props.status; }
}