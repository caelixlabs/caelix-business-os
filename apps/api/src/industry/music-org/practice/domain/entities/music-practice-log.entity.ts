export interface MusicPracticeLogProps {
  id: string;
  organizationId: string;
  studentId: string;
  date: Date;
  minutes: number;
  instrument?: string;
  piece?: string;
  notes?: string;
  teacherFeedback?: string;
  rating?: number;
}

export class MusicPracticeLog {
  private constructor(private readonly props: MusicPracticeLogProps) {}

  static create(props: MusicPracticeLogProps): MusicPracticeLog {
    if (props.minutes < 0) {
      throw new Error("Practice minutes cannot be negative.");
    }

    if (props.rating !== undefined && (props.rating < 1 || props.rating > 5)) {
      throw new Error("Practice rating must be between 1 and 5.");
    }

    return new MusicPracticeLog(props);
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

  get date(): Date {
    return this.props.date;
  }

  get minutes(): number {
    return this.props.minutes;
  }

  get instrument(): string | undefined {
    return this.props.instrument;
  }

  get piece(): string | undefined {
    return this.props.piece;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  get teacherFeedback(): string | undefined {
    return this.props.teacherFeedback;
  }

  get rating(): number | undefined {
    return this.props.rating;
  }
}
