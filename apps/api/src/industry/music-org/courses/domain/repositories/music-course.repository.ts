import { MusicCourse } from '../entities/music-course.entity';

export interface MusicCourseRepository {
  create(course: MusicCourse): Promise<MusicCourse>;
  findByOrganization(organizationId: string): Promise<MusicCourse[]>;
  findById(id: string, organizationId: string): Promise<MusicCourse | null>;
  update(course: MusicCourse): Promise<MusicCourse>;
}