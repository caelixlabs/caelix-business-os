import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { customUUID } from "@/kernel/utility/uuid";
import { MusicCourse } from "../domain/entities/music-course.entity";
import type { MusicCourseRepository } from "../domain/repositories/music-course.repository";
import { MusicCourseStatus } from "../domain/enums/music-course.enum";
import { MusicSkillLevel } from "../domain/enums/music-skill.enum";
import { MUSIC_COURSE_REPOSITORY } from "../domain/repositories/music-course.token";

@Injectable()
export class MusicCourseService {
  constructor(
    @Inject(MUSIC_COURSE_REPOSITORY)
    private readonly repository: MusicCourseRepository,
  ) {}

  async create(
    organizationId: string,
    input: {
      code: string;
      name: string;
      description?: string;
      instrument?: string;
      skillLevel?: MusicSkillLevel;
      durationWeeks?: number;
      classDurationMinutes?: number;
    }
  ) {
    const existing = await this.repository.findByOrganization(organizationId);

    if (existing.some((course) => course.code === input.code)) {
      throw new ConflictException(
        `Course code '${input.code}' already exists.`
      );
    }

    return this.repository.create(
      MusicCourse.create({
        id: customUUID.generate(),
        organizationId,
        code: input.code,
        name: input.name,
        description: input.description,
        instrument: input.instrument,
        skillLevel: input.skillLevel ?? MusicSkillLevel.BEGINNER,
        durationWeeks: input.durationWeeks,
        classDurationMinutes: input.classDurationMinutes ?? 60,
        status: MusicCourseStatus.ACTIVE,
      })
    );
  }

  list(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }
}
