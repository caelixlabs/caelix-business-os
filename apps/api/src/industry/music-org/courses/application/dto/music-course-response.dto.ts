import { MusicCourse } from "../../domain/entities/music-course.entity";

export class MusicCourseResponseDto {
  id!: string;
  organizationId!: string;
  code!: string;
  name!: string;
  description?: string;
  instrument?: string;
  skillLevel!: string;
  durationWeeks?: number;
  classDurationMinutes!: number;
  status!: string;

  static fromDomain(course: MusicCourse): MusicCourseResponseDto {
    const dto = new MusicCourseResponseDto();
    dto.id = course.id;
    dto.organizationId = course.organizationId;
    dto.code = course.code;
    dto.name = course.name;
    dto.description = course.description;
    dto.instrument = course.instrument;
    dto.skillLevel = course.skillLevel;
    dto.durationWeeks = course.durationWeeks;
    dto.classDurationMinutes = course.classDurationMinutes;
    dto.status = course.status;
    return dto;
  }

  static fromDomainList(courses: MusicCourse[]): MusicCourseResponseDto[] {
    return courses.map((course) => MusicCourseResponseDto.fromDomain(course));
  }
}
