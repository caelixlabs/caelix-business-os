import { MusicEnrollment } from "../../domain/entities/music-enrollment.entity";

export class MusicEnrollmentResponseDto {
  id!: string;
  organizationId!: string;
  studentId!: string;
  batchId!: string;
  enrolledAt!: Date;
  feeAmount!: number;
  discountAmount!: number;
  status!: string;
  notes?: string;

  static fromDomain(enrollment: MusicEnrollment): MusicEnrollmentResponseDto {
    const dto = new MusicEnrollmentResponseDto();
    dto.id = enrollment.id;
    dto.organizationId = enrollment.organizationId;
    dto.studentId = enrollment.studentId;
    dto.batchId = enrollment.batchId;
    dto.enrolledAt = enrollment.enrolledAt;
    dto.feeAmount = enrollment.feeAmount;
    dto.discountAmount = enrollment.discountAmount;
    dto.status = enrollment.status;
    dto.notes = enrollment.notes;
    return dto;
  }

  static fromDomainList(enrollments: MusicEnrollment[]): MusicEnrollmentResponseDto[] {
    return enrollments.map((enrollment) => MusicEnrollmentResponseDto.fromDomain(enrollment));
  }
}
