import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';

export default function EnquiriesSection() {
  return (
    <div>
      <PageHeader title="Enquiries" description="Manage incoming business and student enquiries." />
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-text">Enquiry workspace</h2>
        <p className="mt-1 text-sm text-text-secondary">The shared enquiry workflow is ready to be wired to the existing API domain.</p>
      </Card>
    </div>
  );
}
