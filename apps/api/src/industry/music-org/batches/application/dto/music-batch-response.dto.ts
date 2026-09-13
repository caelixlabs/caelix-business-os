import { MusicBatch } from "../../domain/entities/music-batch.entity";

export class MusicBatchResponseDto {
  id!: string;
  organizationId!: string;
  branchId!: string;
  courseId!: string;
  teacherUserId?: string;
  name!: string;
  capacity!: number;
  startDate!: Date;
  endDate?: Date;
  days!: string[];
  startTime!: string;
  endTime!: string;
  status!: string;

  static fromDomain(batch: MusicBatch): MusicBatchResponseDto {
    const dto = new MusicBatchResponseDto();
    dto.id = batch.id;
    dto.organizationId = batch.organizationId;
    dto.branchId = batch.branchId;
    dto.courseId = batch.courseId;
    dto.teacherUserId = batch.teacherUserId;
    dto.name = batch.name;
    dto.capacity = batch.capacity;
    dto.startDate = batch.startDate;
    dto.endDate = batch.endDate;
    dto.days = batch.days;
    dto.startTime = batch.startTime;
    dto.endTime = batch.endTime;
    dto.status = batch.status;
    return dto;
  }

  static fromDomainList(batches: MusicBatch[]): MusicBatchResponseDto[] {
    return batches.map((batch) => MusicBatchResponseDto.fromDomain(batch));
  }
}
