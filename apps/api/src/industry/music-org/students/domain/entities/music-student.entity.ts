import { MusicSkillLevel } from "@/industry/music-org/courses/domain/enums/music-skill.enum";
import { MusicStudentStatus } from "../enums/music-student.enum";

export interface MusicStudentProps {
  id: string;
  organizationId: string;
  branchId?: string;
  studentNo: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  instrument?: string;
  skillLevel: MusicSkillLevel;
  status: MusicStudentStatus;
  joinedAt: Date;
  notes?: string;
}

export class MusicStudent {
  private constructor(
    private readonly props: MusicStudentProps,
  ) {}

  static create(
    props: MusicStudentProps,
  ): MusicStudent {
    return new MusicStudent({
      ...props,
      firstName: props.firstName.trim(),
      lastName: props.lastName.trim(),
      studentNo: props.studentNo.trim(),
    });
  }

  get id() { return this.props.id; }
  get organizationId() { return this.props.organizationId; }
  get branchId() { return this.props.branchId; }
  get studentNo() { return this.props.studentNo; }
  get firstName() { return this.props.firstName; }
  get lastName() { return this.props.lastName; }
  get email() { return this.props.email; }
  get phone() { return this.props.phone; }
  get dateOfBirth() { return this.props.dateOfBirth; }
  get guardianName() { return this.props.guardianName; }
  get guardianPhone() { return this.props.guardianPhone; }
  get guardianEmail() { return this.props.guardianEmail; }
  get instrument() { return this.props.instrument; }
  get skillLevel() { return this.props.skillLevel; }
  get status() { return this.props.status; }
  get joinedAt() { return this.props.joinedAt; }
  get notes() { return this.props.notes; }
}