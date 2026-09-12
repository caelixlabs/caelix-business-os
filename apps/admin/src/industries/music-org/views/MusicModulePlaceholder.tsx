import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';

export function MusicModulePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <Card className="p-6">
        <p className="text-sm font-medium text-text">Module foundation</p>
        <p className="mt-1 text-sm text-text-secondary">This industry view is isolated here so its tables, forms, filters, queries and dialogs can be added without expanding the route file.</p>
      </Card>
    </div>
  );
}
