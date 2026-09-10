import { MusicAttendanceStatus } from '../enums/music-attendance.enum';

export interface MusicAttendanceProps {
  id: string;
  organizationId: string;
  studentId: string;
  batchId: string;
  date: Date;
  status: MusicAttendanceStatus;
  notes?: string;
}

export class MusicAttendance {
  private constructor(
    private readonly props: MusicAttendanceProps,
  ) {}

  static create(
    props: MusicAttendanceProps,
  ): MusicAttendance {
    return new MusicAttendance(props);
  }

  get id(): string {
    return this.props.id;
  }

  get organizationId(): string {
    return this.props.organizationId;
  }

  get studentId(): string {
    return this.props.studentId;
  }

  get batchId(): string {
    return this.props.batchId;
  }

  get date(): Date {
    return this.props.date;
  }

  get status(): MusicAttendanceStatus {
    return this.props.status;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }
}