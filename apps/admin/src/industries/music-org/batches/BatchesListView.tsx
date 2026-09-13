'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useMusicBatches } from '@/features/music/batches/api/use-batches';
import { useMusicCourses } from '@/features/music/courses/api/use-courses';
import type { MusicBatch } from '@/features/music/batches/types';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data/data-table';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PermissionGate } from '@/core/access/components/permission-gate';
import { CreateBatchForm } from './components/CreateBatchForm';

const STATUS_TONE: Record<string, 'success' | 'neutral' | 'danger' | 'info'> = {
  PLANNED: 'info',
  ACTIVE: 'success',
  COMPLETED: 'neutral',
  CANCELLED: 'danger',
};

export function BatchesListView() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: batches, isLoading } = useMusicBatches(organizationId);
  const { data: courses } = useMusicCourses(organizationId);
  const [dialogOpen, setDialogOpen] = useState(false);

  const courseName = (courseId: string) => courses?.find((course) => course.id === courseId)?.name ?? courseId;

  const columns: ColumnDef<MusicBatch, unknown>[] = [
    {
      accessorKey: 'name',
      header: 'Batch',
      cell: ({ row }) => (
        <Link href={`/dashboard/music/batches/${row.original.id}`} className="font-medium text-text hover:text-accent">
          {row.original.name}
        </Link>
      ),
    },
    {
      id: 'course',
      header: 'Course',
      accessorFn: (row) => courseName(row.courseId),
    },
    {
      id: 'schedule',
      header: 'Schedule',
      cell: ({ row }) => (
        <span className="text-xs text-text-secondary">
          {row.original.days.join(', ')} · {row.original.startTime}–{row.original.endTime}
        </span>
      ),
    },
    { accessorKey: 'capacity', header: 'Capacity' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return <Badge tone={STATUS_TONE[value] ?? 'neutral'}>{value.toLowerCase()}</Badge>;
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Batches"
        description="Scheduled class groups running against your courses."
        action={
          <PermissionGate permission="music:batch-manage">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>New batch</Button>
              </DialogTrigger>
              <DialogContent title="Create a batch" description="Schedule a new class batch for a course.">
                {organizationId && (
                  <CreateBatchForm organizationId={organizationId} onDone={() => setDialogOpen(false)} />
                )}
              </DialogContent>
            </Dialog>
          </PermissionGate>
        }
      />

      <DataTable
        columns={columns}
        data={batches ?? []}
        loading={isLoading}
        searchPlaceholder="Search batches..."
        emptyTitle="No batches yet"
        emptyDescription="Create a batch to start scheduling classes."
      />
    </div>
  );
}
