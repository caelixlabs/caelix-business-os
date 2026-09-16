'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { CalendarDays, Dumbbell, Users } from 'lucide-react';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useGymClasses } from '@/features/gym/classes/api/use-gym-classes';
import type { GymClass } from '@/features/gym/classes/types';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data/data-table';
import { StatCard } from '@/components/data/stat-card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PermissionGate } from '@/core/access/components/permission-gate';
import { CreateGymClassForm } from './components/CreateGymClassForm';

export function GymClassesListView() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: classes, isLoading } = useGymClasses(organizationId);
  const [dialogOpen, setDialogOpen] = useState(false);

  const activeCount = classes?.filter((c) => c.status === 'ACTIVE').length ?? 0;
  const totalCapacity = classes?.reduce((sum, c) => sum + c.capacity, 0) ?? 0;

  const columns: ColumnDef<GymClass, unknown>[] = [
    { accessorKey: 'name', header: 'Class' },
    {
      id: 'schedule',
      header: 'Schedule',
      accessorFn: (row) => `${row.days.join(', ')} · ${row.startTime}–${row.endTime}`,
    },
    { accessorKey: 'capacity', header: 'Capacity' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => (
        <Badge tone={getValue() === 'ACTIVE' ? 'success' : 'neutral'}>{(getValue() as string).toLowerCase()}</Badge>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Classes"
        description="Recurring group classes and their weekly schedule."
        action={
          <PermissionGate permission="gym:class-manage">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>New class</Button>
              </DialogTrigger>
              <DialogContent title="Create a class" description="Set up a recurring weekly class.">
                {organizationId && <CreateGymClassForm organizationId={organizationId} onDone={() => setDialogOpen(false)} />}
              </DialogContent>
            </Dialog>
          </PermissionGate>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <StatCard title="Active classes" value={activeCount} description="running now" icon={Dumbbell} />
        <StatCard title="Total capacity" value={totalCapacity} description="seats across all classes" icon={Users} />
        <StatCard title="This week" value={classes?.length ?? 0} description="total classes" icon={CalendarDays} />
      </div>

      <DataTable
        columns={columns}
        data={classes ?? []}
        loading={isLoading}
        searchPlaceholder="Search classes..."
        emptyTitle="No classes yet"
        emptyDescription="Create your first class to build the weekly schedule."
      />
    </div>
  );
}
