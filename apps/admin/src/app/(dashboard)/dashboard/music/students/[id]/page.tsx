import { StudentDetailView } from '@/industries/music-org/students/StudentDetailView';

export default async function MusicStudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StudentDetailView studentId={id} />;
}
