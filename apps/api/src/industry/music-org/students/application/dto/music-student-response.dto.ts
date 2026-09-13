import { MusicStudent } from "../../domain/entities/music-student.entity";

export class MusicStudentResponseDto {
  id!: string;
  organizationId!: string;
  branchId?: string;
  studentNo!: string;
  firstName!: string;
  lastName!: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  instrument?: string;
  skillLevel!: string;
  status!: string;
  joinedAt!: Date;
  notes?: string;

  static fromDomain(student: MusicStudent): MusicStudentResponseDto {
    const dto = new MusicStudentResponseDto();
    dto.id = student.id;
    dto.organizationId = student.organizationId;
    dto.branchId = student.branchId;
    dto.studentNo = student.studentNo;
    dto.firstName = student.firstName;
    dto.lastName = student.lastName;
    dto.email = student.email;
    dto.phone = student.phone;
    dto.dateOfBirth = student.dateOfBirth;
    dto.guardianName = student.guardianName;
    dto.guardianPhone = student.guardianPhone;
    dto.guardianEmail = student.guardianEmail;
    dto.instrument = student.instrument;
    dto.skillLevel = student.skillLevel;
    dto.status = student.status;
    dto.joinedAt = student.joinedAt;
    dto.notes = student.notes;
    return dto;
  }

  static fromDomainList(students: MusicStudent[]): MusicStudentResponseDto[] {
    return students.map((student) => MusicStudentResponseDto.fromDomain(student));
  }
}
