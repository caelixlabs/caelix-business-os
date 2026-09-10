import { MusicEnrollmentStatus } from "../enums/music-enrollment.enum";


export class MusicEnrollment {
  private constructor(
    private readonly props: {
      id: string;
      organizationId: string;
      studentId: string;
      batchId: string;
      enrolledAt: Date;
      feeAmount: number;
      discountAmount: number;
      status: MusicEnrollmentStatus;
      notes?: string;
    },
  ) {}

  static create(props: MusicEnrollment['props']) {
    if (
      props.feeAmount < 0 ||
      props.discountAmount < 0
    ) {
      throw new Error(
        'Fee and discount cannot be negative.',
      );
    }

    return new MusicEnrollment(props);
  }

  get id() { return this.props.id; }
  get organizationId() { return this.props.organizationId; }
  get studentId() { return this.props.studentId; }
  get batchId() { return this.props.batchId; }
  get enrolledAt() { return this.props.enrolledAt; }
  get feeAmount() { return this.props.feeAmount; }
  get discountAmount() { return this.props.discountAmount; }
  get status() { return this.props.status; }
  get notes() { return this.props.notes; }
}