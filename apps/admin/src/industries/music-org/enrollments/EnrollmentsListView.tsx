'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useMusicEnrollments, useUpdateMusicEnrollmentStatus } from '@/features/music/enrollments/api/use-enrollments';
import type { MusicEnrollment } from '@/features/music/enrollments/types';
import { useMusicStudents } from '@/features/music/students/api/use-students';
import { useMusicBatches } from '@/features/music/batches/api/use-batches';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data/data-table';
import { StatCard } from '@/components/data/stat-card';
import { PermissionGate } from '@/core/access/components/permission-gate';
import { CreditCard, PauseCircle, XCircle } from 'lucide-react';

const STATUS_TONE: Record<string, 'success' | 'neutral' | 'danger' | 'info'> = {
  ACTIVE: 'success',
  PAUSED: 'danger',
  COMPLETED: 'info',
  CANCELLED: 'neutral',
};

export function EnrollmentsListView() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: enrollments, isLoading } = useMusicEnrollments(organizationId);
  const { data: students } = useMusicStudents(organizationId);
  const { data: batches } = useMusicBatches(organizationId);
  const updateStatus = useUpdateMusicEnrollmentStatus(organizationId ?? '');

  const studentName = (id: string) => {
    const student = students?.find((s) => s.id === id);
    return student ? `${student.firstName} ${student.lastName}` : id;
  };
  const batchName = (id: string) => batches?.find((b) => b.id === id)?.name ?? id;

  const active = enrollments?.filter((e) => e.status === 'ACTIVE').length ?? 0;
  const paused = enrollments?.filter((e) => e.status === 'PAUSED').length ?? 0;
  const cancelled = enrollments?.filter((e) => e.status === 'CANCELLED').length ?? 0;

  const columns: ColumnDef<MusicEnrollment, unknown>[] = [
    { id: 'student', header: 'Student', accessorFn: (row) => studentName(row.studentId) },
    { id: 'batch', header: 'Batch', accessorFn: (row) => batchName(row.batchId) },
    {
      id: 'fee',
      header: 'Fee',
      cell: ({ row }) => (
        <span>
          ₹{row.original.feeAmount}
          {row.original.discountAmount > 0 && <span className="text-text-secondary"> (−₹{row.original.discountAmount})</span>}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return <Badge tone={STATUS_TONE[value] ?? 'neutral'}>{value.toLowerCase()}</Badge>;
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const enrollment = row.original;
        return (
          <PermissionGate permission="music:enrollment-manage">
            <div className="flex justify-end gap-1.5">
              {enrollment.status === 'ACTIVE' && (
                <Button
                  variant="ghost"
                  className="!px-2 !py-1 text-xs"
                  disabled={updateStatus.isPending}
                  onClick={() => updateStatus.mutate({ id: enrollment.id, status: 'PAUSED' })}
                >
                  Pause
                </Button>
              )}
              {enrollment.status === 'PAUSED' && (
                <Button
                  variant="ghost"
                  className="!px-2 !py-1 text-xs"
                  disabled={updateStatus.isPending}
                  onClick={() => updateStatus.mutate({ id: enrollment.id, status: 'ACTIVE' })}
                >
                  Resume
                </Button>
              )}
              {(enrollment.status === 'ACTIVE' || enrollment.status === 'PAUSED') && (
                <Button
                  variant="ghost"
                  className="!px-2 !py-1 text-xs text-danger"
                  disabled={updateStatus.isPending}
                  onClick={() => updateStatus.mutate({ id: enrollment.id, status: 'CANCELLED' })}
                >
                  Cancel
                </Button>
              )}
            </div>
          </PermissionGate>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader title="Subscriptions" description="Student enrollments, fees and billing status across batches." />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <StatCard title="Active" value={active} description="active enrollments" icon={CreditCard} />
        <StatCard title="Paused" value={paused} description="need follow-up" icon={PauseCircle} />
        <StatCard title="Cancelled" value={cancelled} description="all time" icon={XCircle} />
      </div>

      <DataTable
        columns={columns}
        data={enrollments ?? []}
        loading={isLoading}
        searchPlaceholder="Search enrollments..."
        emptyTitle="No enrollments yet"
        emptyDescription="Enroll students into a batch to see their subscriptions here."
      />
    </div>
  );
}
