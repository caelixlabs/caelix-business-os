'use client';

import { useState } from 'react';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useGymClasses } from '@/features/gym/classes/api/use-gym-classes';
import { useGymMembers } from '@/features/gym/members/api/use-gym-members';
import { useGymAttendanceByClass, useMarkGymAttendance } from '@/features/gym/attendance/api/use-gym-attendance';
import type { AttendanceStatus } from '@/features/gym/attendance/types';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';

const STATUS_TONE: Record<AttendanceStatus, 'success' | 'danger' | 'info' | 'neutral'> = {
  PRESENT: 'success',
  ABSENT: 'danger',
  LATE: 'info',
  EXCUSED: 'neutral',
};

const STATUS_OPTIONS: AttendanceStatus[] = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function GymAttendanceView() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: classes } = useGymClasses(organizationId);
  const { data: members, isLoading: membersLoading } = useGymMembers(organizationId);

  const [classId, setClassId] = useState<string>('');
  const [date, setDate] = useState<string>(todayIso());

  const { data: records, isLoading: attendanceLoading } = useGymAttendanceByClass(organizationId, classId, date);
  const markAttendance = useMarkGymAttendance(organizationId ?? '', classId, date);

  const statusFor = (contactId: string) => records?.find((r) => r.contactId === contactId)?.status;
  const activeMembers = (members ?? []).filter((m) => m.status === 'ACTIVE');

  return (
    <div>
      <PageHeader title="Attendance" description="Check members into today's class." />

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text">Class</span>
          <Select value={classId} onValueChange={setClassId}>
            <SelectTrigger>{classes?.find((c) => c.id === classId)?.name ?? 'Select a class'}</SelectTrigger>
            <SelectContent>
              {(classes ?? []).map((gymClass) => (
                <SelectItem key={gymClass.id} value={gymClass.id}>
                  {gymClass.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text">Date</span>
          <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
      </div>

      {!classId ? (
        <EmptyState title="Pick a class" description="Choose a class above to start checking members in." />
      ) : membersLoading ? (
        <Spinner />
      ) : activeMembers.length === 0 ? (
        <EmptyState title="No active members" description="Add gym members before taking attendance." />
      ) : (
        <div className="rounded-2xl border border-border bg-surface">
          {activeMembers.map((member, index) => {
            const current = statusFor(member.contactId);
            return (
              <div
                key={member.id}
                className={`flex items-center justify-between gap-4 px-4 py-3 ${
                  index !== activeMembers.length - 1 ? 'border-b border-border/70' : ''
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-text">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-xs text-text-secondary">{member.memberNo}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  {current && !attendanceLoading && <Badge tone={STATUS_TONE[current]}>{current.toLowerCase()}</Badge>}
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={markAttendance.isPending}
                      onClick={() =>
                        markAttendance.mutate({ memberId: member.id, classId, date, status })
                      }
                      className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
                        current === status
                          ? 'border-accent bg-accent text-white'
                          : 'border-border text-text-secondary hover:border-accent/40'
                      }`}
                    >
                      {status.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
