'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useMusicCourses } from '@/features/music/courses/api/use-courses';
import type { MusicCourse } from '@/features/music/courses/types';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data/data-table';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PermissionGate } from '@/core/access/components/permission-gate';
import { CreateCourseForm } from './components/CreateCourseForm';

const columns: ColumnDef<MusicCourse, unknown>[] = [
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ getValue }) => <span className="font-mono text-xs">{getValue() as string}</span>,
  },
  { accessorKey: 'name', header: 'Course' },
  {
    accessorKey: 'instrument',
    header: 'Instrument',
    cell: ({ getValue }) => (getValue() as string) || '—',
  },
  {
    accessorKey: 'skillLevel',
    header: 'Level',
    cell: ({ getValue }) => <Badge tone="info">{(getValue() as string).toLowerCase()}</Badge>,
  },
  {
    accessorKey: 'classDurationMinutes',
    header: 'Class length',
    cell: ({ getValue }) => `${getValue() as number} min`,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return <Badge tone={value === 'ACTIVE' ? 'success' : 'neutral'}>{value.toLowerCase()}</Badge>;
    },
  },
];

export function CoursesListView() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: courses, isLoading } = useMusicCourses(organizationId);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Courses"
        description="Course catalogue offered by your academy."
        action={
          <PermissionGate permission="music:course-manage">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>New course</Button>
              </DialogTrigger>
              <DialogContent title="Create a course" description="Add a new course to your catalogue.">
                {organizationId && (
                  <CreateCourseForm organizationId={organizationId} onDone={() => setDialogOpen(false)} />
                )}
              </DialogContent>
            </Dialog>
          </PermissionGate>
        }
      />

      <DataTable
        columns={columns}
        data={courses ?? []}
        loading={isLoading}
        searchPlaceholder="Search courses..."
        emptyTitle="No courses yet"
        emptyDescription="Create your first course to start scheduling batches."
      />
    </div>
  );
}
