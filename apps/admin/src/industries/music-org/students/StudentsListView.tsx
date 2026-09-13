'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useMusicStudents } from '@/features/music/students/api/use-students';
import type { MusicStudent } from '@/features/music/students/types';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data/data-table';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PermissionGate } from '@/core/access/components/permission-gate';
import { CreateStudentForm } from './components/CreateStudentForm';

const SKILL_TONE: Record<string, 'accent' | 'success' | 'info' | 'neutral'> = {
  BEGINNER: 'neutral',
  INTERMEDIATE: 'info',
  ADVANCED: 'accent',
  PROFESSIONAL: 'success',
};

const STATUS_TONE: Record<string, 'success' | 'neutral' | 'danger' | 'info'> = {
  ACTIVE: 'success',
  INACTIVE: 'neutral',
  GRADUATED: 'info',
  ON_HOLD: 'danger',
};

const columns: ColumnDef<MusicStudent, unknown>[] = [
  {
    id: 'name',
    header: 'Student',
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    cell: ({ row }) => (
      <Link href={`/dashboard/music/students/${row.original.id}`} className="font-medium text-text hover:text-accent">
        {row.original.firstName} {row.original.lastName}
        <span className="ml-2 font-mono text-xs text-text-secondary">{row.original.studentNo}</span>
      </Link>
    ),
  },
  {
    accessorKey: 'instrument',
    header: 'Instrument',
    cell: ({ getValue }) => (getValue() as string) || '—',
  },
  {
    accessorKey: 'skillLevel',
    header: 'Skill level',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return <Badge tone={SKILL_TONE[value] ?? 'neutral'}>{value.toLowerCase()}</Badge>;
    },
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
    accessorKey: 'phone',
    header: 'Contact',
    cell: ({ row }) => row.original.phone || row.original.email || '—',
  },
];

export function StudentsListView() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: students, isLoading } = useMusicStudents(organizationId);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Students"
        description="Manage music students, profiles and enrolments."
        action={
          <PermissionGate permission="music:student-create">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add student</Button>
              </DialogTrigger>
              <DialogContent title="Add a student" description="Create a new music student profile.">
                {organizationId && (
                  <CreateStudentForm organizationId={organizationId} onDone={() => setDialogOpen(false)} />
                )}
              </DialogContent>
            </Dialog>
          </PermissionGate>
        }
      />

      <DataTable
        columns={columns}
        data={students ?? []}
        loading={isLoading}
        searchPlaceholder="Search students..."
        emptyTitle="No students yet"
        emptyDescription="Add your first student to get started."
      />
    </div>
  );
}
