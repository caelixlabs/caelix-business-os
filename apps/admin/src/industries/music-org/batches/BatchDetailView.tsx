'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useMusicBatch } from '@/features/music/batches/api/use-batches';
import { useMusicCourses } from '@/features/music/courses/api/use-courses';
import { useMusicStudents } from '@/features/music/students/api/use-students';
import { useUsers } from '@/features/users/api/use-users';
import { useMusicEnrollments, useCreateMusicEnrollment } from '@/features/music/enrollments/api/use-enrollments';
import { createEnrollmentSchema, type CreateEnrollmentFormValues } from '@/features/music/enrollments/schemas/enrollment.schema';
import { useMusicAttendanceByBatch, useMarkMusicAttendance } from '@/features/music/attendance/api/use-attendance';
import type { MusicAttendanceStatus } from '@/features/music/attendance/types';

import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PermissionGate } from '@/core/access/components/permission-gate';

const STATUS_TONE: Record<string, 'success' | 'neutral' | 'danger' | 'info'> = {
  PLANNED: 'info',
  ACTIVE: 'success',
  COMPLETED: 'neutral',
  CANCELLED: 'danger',
};

const ATTENDANCE_OPTIONS: MusicAttendanceStatus[] = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function BatchDetailView({ batchId }: { batchId: string }) {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;

  const { data: batch, isLoading } = useMusicBatch(organizationId, batchId);
  const { data: courses } = useMusicCourses(organizationId);
  const { data: users } = useUsers(organizationId);
  const { data: enrollments } = useMusicEnrollments(organizationId, { batchId });
  const { data: students } = useMusicStudents(organizationId);

  const [enrollOpen, setEnrollOpen] = useState(false);
  const [date, setDate] = useState(todayISO());

  if (isLoading || !batch) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const course = courses?.find((c) => c.id === batch.courseId);
  const teacher = users?.find((u) => u.id === batch.teacherUserId);
  const studentName = (id: string) => {
    const student = students?.find((s) => s.id === id);
    return student ? `${student.firstName} ${student.lastName}` : id;
  };

  return (
    <div>
      <PageHeader
        title={batch.name}
        description={course ? `${course.name} · ${batch.days.join(', ')} · ${batch.startTime}–${batch.endTime}` : undefined}
        action={<Badge tone={STATUS_TONE[batch.status] ?? 'neutral'}>{batch.status.toLowerCase()}</Badge>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs font-medium text-text-secondary">Teacher</p>
          <p className="mt-1 text-sm font-semibold text-text">{teacher?.fullName ?? 'Unassigned'}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-text-secondary">Enrolled</p>
          <p className="mt-1 text-sm font-semibold text-text">
            {enrollments?.filter((e) => e.status === 'ACTIVE').length ?? 0} / {batch.capacity}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-text-secondary">Starts</p>
          <p className="mt-1 text-sm font-semibold text-text">{new Date(batch.startDate).toLocaleDateString()}</p>
        </Card>
      </div>

      <Tabs defaultValue="roster">
        <TabsList>
          <TabsTrigger value="roster">Roster</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="roster">
          <div className="mb-4 flex justify-end">
            <PermissionGate permission="music:enrollment-manage">
              <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
                <DialogTrigger asChild>
                  <Button>Enroll student</Button>
                </DialogTrigger>
                <DialogContent title="Enroll a student" description="Add a student to this batch.">
                  {organizationId && (
                    <EnrollStudentForm
                      organizationId={organizationId}
                      batchId={batchId}
                      onDone={() => setEnrollOpen(false)}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </PermissionGate>
          </div>

          {!enrollments || enrollments.length === 0 ? (
            <EmptyState title="No students enrolled" description="Enroll a student to add them to this batch." />
          ) : (
            <div className="space-y-2">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.id} className="flex items-center justify-between p-4">
                  <div>
                    <Link
                      href={`/dashboard/music/students/${enrollment.studentId}`}
                      className="text-sm font-medium text-text hover:text-accent"
                    >
                      {studentName(enrollment.studentId)}
                    </Link>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      Fee ₹{enrollment.feeAmount}
                      {enrollment.discountAmount > 0 && ` (−₹${enrollment.discountAmount})`}
                    </p>
                  </div>
                  <Badge tone={STATUS_TONE[enrollment.status] ?? 'neutral'}>{enrollment.status.toLowerCase()}</Badge>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="attendance">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-text-secondary">Mark attendance for a class session.</p>
            <DatePicker value={date} onChange={setDate} />
          </div>

          {!enrollments || enrollments.filter((e) => e.status === 'ACTIVE').length === 0 ? (
            <EmptyState title="No active students" description="Enroll students before marking attendance." />
          ) : (
            <AttendanceRegister
              organizationId={organizationId}
              batchId={batchId}
              date={date}
              studentIds={enrollments.filter((e) => e.status === 'ACTIVE').map((e) => e.studentId)}
              studentName={studentName}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EnrollStudentForm({
  organizationId,
  batchId,
  onDone,
}: {
  organizationId: string;
  batchId: string;
  onDone: () => void;
}) {
  const { data: students } = useMusicStudents(organizationId);
  const createEnrollment = useCreateMusicEnrollment(organizationId);
  const {
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors },
  } = useForm<CreateEnrollmentFormValues>({
    resolver: zodResolver(createEnrollmentSchema),
    defaultValues: { batchId },
  });

  const studentId = watch('studentId');

  return (
    <form
      onSubmit={handleSubmit((values) => createEnrollment.mutate(values, { onSuccess: onDone }))}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">Student</span>
        <Select value={studentId ?? ''} onValueChange={(value) => setValue('studentId', value, { shouldValidate: true })}>
          <SelectTrigger>
            {(() => {
              const selected = students?.find((s) => s.id === studentId);
              return selected ? `${selected.firstName} ${selected.lastName}` : 'Select a student';
            })()}
          </SelectTrigger>
          <SelectContent>
            {(students ?? []).map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.firstName} {student.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.studentId && <p className="text-xs text-danger">{errors.studentId.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="feeAmount" className="text-sm font-medium text-text">Fee amount</label>
          <input
            id="feeAmount"
            type="number"
            min={0}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-accent"
            {...register('feeAmount')}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="discountAmount" className="text-sm font-medium text-text">Discount</label>
          <input
            id="discountAmount"
            type="number"
            min={0}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-accent"
            {...register('discountAmount')}
          />
        </div>
      </div>

      <Button type="submit" loading={createEnrollment.isPending}>
        Enroll student
      </Button>
    </form>
  );
}

function AttendanceRegister({
  organizationId,
  batchId,
  date,
  studentIds,
  studentName,
}: {
  organizationId: string | undefined;
  batchId: string;
  date: string;
  studentIds: string[];
  studentName: (id: string) => string;
}) {
  const { data: records } = useMusicAttendanceByBatch(organizationId, batchId, date);
  const markAttendance = useMarkMusicAttendance(organizationId ?? '', batchId, date);

  const statusFor = (studentId: string) => records?.find((r) => r.studentId === studentId)?.status;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-canvas/70">
          <tr>
            <th className="px-4 py-2.5 text-xs font-semibold text-text-secondary">Student</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-text-secondary">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/70">
          {studentIds.map((studentId) => (
            <tr key={studentId}>
              <td className="px-4 py-2.5 font-medium text-text">{studentName(studentId)}</td>
              <td className="px-4 py-2.5">
                <div className="flex gap-1.5">
                  {ATTENDANCE_OPTIONS.map((status) => {
                    const active = statusFor(studentId) === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        disabled={markAttendance.isPending}
                        onClick={() => markAttendance.mutate({ studentId, batchId, date, status })}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
                          active
                            ? 'border-accent bg-accent-soft text-accent-ink'
                            : 'border-border text-text-secondary hover:border-accent/40'
                        }`}
                      >
                        {status.toLowerCase()}
                      </button>
                    );
                  })}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
