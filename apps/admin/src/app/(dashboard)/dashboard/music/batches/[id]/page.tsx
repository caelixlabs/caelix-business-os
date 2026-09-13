import { BatchDetailView } from '@/industries/music-org/batches/BatchDetailView';

export default async function MusicBatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BatchDetailView batchId={id} />;
}
