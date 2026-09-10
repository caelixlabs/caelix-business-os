import { MusicCourseStatus } from "../enums/music-course.enum";
import { MusicSkillLevel } from "../enums/music-skill.enum";

export interface MusicCourseProps {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  description?: string;
  instrument?: string;
  skillLevel: MusicSkillLevel;
  durationWeeks?: number;
  classDurationMinutes: number;
  status: MusicCourseStatus;
}

export class MusicCourse {
  private constructor(
    private readonly props: MusicCourseProps,
  ) {}

  static create(
    props: MusicCourseProps,
  ) {
    return new MusicCourse({
      ...props,
      code: props.code.trim(),
      name: props.name.trim(),
    });
  }

  get id() { return this.props.id; }
  get organizationId() { return this.props.organizationId; }
  get code() { return this.props.code; }
  get name() { return this.props.name; }
  get description() { return this.props.description; }
  get instrument() { return this.props.instrument; }
  get skillLevel() { return this.props.skillLevel; }
  get durationWeeks() { return this.props.durationWeeks; }
  get classDurationMinutes() { return this.props.classDurationMinutes; }
  get status() { return this.props.status; }
}