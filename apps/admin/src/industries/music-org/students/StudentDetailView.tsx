'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useMusicStudent, useUpdateMusicStudent } from '@/features/music/students/api/use-students';
import {
  editStudentSchema,
  musicSkillLevelValues,
  musicStudentStatusValues,
  type EditStudentFormValues,
} from '@/features/music/students/schemas/student.schema';
import { useMusicEnrollments } from '@/features/music/enrollments/api/use-enrollments';
import { useMusicBatches } from '@/features/music/batches/api/use-batches';
import { useMusicAttendanceByStudent } from '@/features/music/attendance/api/use-attendance';
import { useMusicPracticeLogs, useCreateMusicPracticeLog } from '@/features/music/practice/api/use-practice';
import {
  createPracticeLogSchema,
  type CreatePracticeLogFormValues,
} from '@/features/music/practice/schemas/practice.schema';

import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { Field, Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PermissionGate } from '@/core/access/components/permission-gate';

const STATUS_TONE: Record<string, 'success' | 'neutral' | 'danger' | 'info'> = {
  ACTIVE: 'success',
  INACTIVE: 'neutral',
  GRADUATED: 'info',
  ON_HOLD: 'danger',
  PAUSED: 'danger',
  COMPLETED: 'info',
  CANCELLED: 'neutral',
  PRESENT: 'success',
  ABSENT: 'danger',
  LATE: 'info',
  EXCUSED: 'neutral',
};

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className="text-text-secondary">{label}</span>
      <span className="font-medium text-text">{value || '—'}</span>
    </div>
  );
}

export function StudentDetailView({ studentId }: { studentId: string }) {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;

  const { data: student, isLoading } = useMusicStudent(organizationId, studentId);
  const { data: enrollments } = useMusicEnrollments(organizationId, { studentId });
  const { data: batches } = useMusicBatches(organizationId);
  const { data: attendance } = useMusicAttendanceByStudent(organizationId, studentId);
  const { data: practiceLogs } = useMusicPracticeLogs(organizationId, studentId);

  const [editOpen, setEditOpen] = useState(false);

  if (isLoading || !student) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const batchName = (batchId: string) => batches?.find((batch) => batch.id === batchId)?.name ?? batchId;

  return (
    <div>
      <PageHeader
        title={`${student.firstName} ${student.lastName}`}
        description={`Student No. ${student.studentNo}`}
        action={
          <div className="flex items-center gap-3">
            <Badge tone={STATUS_TONE[student.status] ?? 'neutral'}>{student.status.toLowerCase()}</Badge>
            <PermissionGate permission="music:student-update">
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary">Edit</Button>
                </DialogTrigger>
                <DialogContent title="Edit student" description="Update this student's profile.">
                  {organizationId && (
                    <EditStudentForm
                      organizationId={organizationId}
                      studentId={studentId}
                      defaultValues={student}
                      onDone={() => setEditOpen(false)}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </PermissionGate>
          </div>
        }
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="practice">Practice log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">Profile</p>
              <InfoRow label="Instrument" value={student.instrument} />
              <InfoRow label="Skill level" value={student.skillLevel} />
              <InfoRow label="Email" value={student.email} />
              <InfoRow label="Phone" value={student.phone} />
              <InfoRow label="Joined" value={new Date(student.joinedAt).toLocaleDateString()} />
            </Card>
            <Card className="p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">Guardian</p>
              <InfoRow label="Name" value={student.guardianName} />
              <InfoRow label="Phone" value={student.guardianPhone} />
              <InfoRow label="Email" value={student.guardianEmail} />
              {student.notes && (
                <div className="mt-3 border-t border-border pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Notes</p>
                  <p className="mt-1 text-sm text-text">{student.notes}</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="enrollments">
          {!enrollments || enrollments.length === 0 ? (
            <EmptyState title="No enrollments" description="This student isn't enrolled in any batch yet." />
          ) : (
            <div className="space-y-2">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-text">{batchName(enrollment.batchId)}</p>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()} · Fee ₹{enrollment.feeAmount}
                      {enrollment.discountAmount > 0 && ` (−₹${enrollment.discountAmount} discount)`}
                    </p>
                  </div>
                  <Badge tone={STATUS_TONE[enrollment.status] ?? 'neutral'}>{enrollment.status.toLowerCase()}</Badge>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="attendance">
          {!attendance || attendance.length === 0 ? (
            <EmptyState title="No attendance recorded" description="Attendance will appear here once marked in a batch register." />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-canvas/70">
                  <tr>
                    <th className="px-4 py-2.5 text-xs font-semibold text-text-secondary">Date</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-text-secondary">Batch</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-text-secondary">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {attendance.map((record) => (
                    <tr key={record.id}>
                      <td className="px-4 py-2.5">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2.5">{batchName(record.batchId)}</td>
                      <td className="px-4 py-2.5">
                        <Badge tone={STATUS_TONE[record.status] ?? 'neutral'}>{record.status.toLowerCase()}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="practice">
          <PracticeLogPanel organizationId={organizationId} studentId={studentId} logs={practiceLogs ?? []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EditStudentForm({
  organizationId,
  studentId,
  defaultValues,
  onDone,
}: {
  organizationId: string;
  studentId: string;
  defaultValues: EditStudentFormValues & { email?: string };
  onDone: () => void;
}) {
  const updateStudent = useUpdateMusicStudent(organizationId);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditStudentFormValues>({
    resolver: zodResolver(editStudentSchema),
    defaultValues,
  });

  const skillLevel = watch('skillLevel');
  const status = watch('status');

  return (
    <form
      onSubmit={handleSubmit((values) =>
        updateStudent.mutate(
          {
            id: studentId,
            input: { ...values, email: values.email || undefined, guardianEmail: values.guardianEmail || undefined },
          },
          { onSuccess: onDone },
        ),
      )}
      className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" htmlFor="firstName" error={errors.firstName?.message}>
          <Input id="firstName" {...register('firstName')} />
        </Field>
        <Field label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
          <Input id="lastName" {...register('lastName')} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Skill level" htmlFor="skillLevel">
          <Select value={skillLevel ?? ''} onValueChange={(value) => setValue('skillLevel', value as EditStudentFormValues['skillLevel'])}>
            <SelectTrigger id="skillLevel">{skillLevel?.toLowerCase() ?? 'Select'}</SelectTrigger>
            <SelectContent>
              {musicSkillLevelValues.map((level) => (
                <SelectItem key={level} value={level}>
                  {level.charAt(0) + level.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Status" htmlFor="status">
          <Select value={status ?? ''} onValueChange={(value) => setValue('status', value as EditStudentFormValues['status'])}>
            <SelectTrigger id="status">{status?.toLowerCase() ?? 'Select'}</SelectTrigger>
            <SelectContent>
              {musicStudentStatusValues.map((value) => (
                <SelectItem key={value} value={value}>
                  {value.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" {...register('email')} />
        </Field>
        <Field label="Phone" htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" {...register('phone')} />
        </Field>
      </div>

      <Field label="Notes" htmlFor="notes" error={errors.notes?.message}>
        <Input id="notes" {...register('notes')} />
      </Field>

      <Button type="submit" loading={updateStudent.isPending}>
        Save changes
      </Button>
    </form>
  );
}

function PracticeLogPanel({
  organizationId,
  studentId,
  logs,
}: {
  organizationId: string | undefined;
  studentId: string;
  logs: { id: string; date: string; minutes: number; piece?: string; rating?: number; teacherFeedback?: string }[];
}) {
  const createLog = useCreateMusicPracticeLog(organizationId ?? '', studentId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePracticeLogFormValues>({ resolver: zodResolver(createPracticeLogSchema) });

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <form
          onSubmit={handleSubmit((values) =>
            createLog.mutate(values, { onSuccess: () => reset() }),
          )}
          className="grid gap-3 sm:grid-cols-4"
        >
          <Field label="Minutes" htmlFor="minutes" error={errors.minutes?.message}>
            <Input id="minutes" type="number" min={1} {...register('minutes')} />
          </Field>
          <Field label="Piece" htmlFor="piece">
            <Input id="piece" {...register('piece')} />
          </Field>
          <Field label="Rating (1-5)" htmlFor="rating" error={errors.rating?.message}>
            <Input id="rating" type="number" min={1} max={5} {...register('rating')} />
          </Field>
          <div className="flex items-end">
            <Button type="submit" loading={createLog.isPending} className="w-full">
              Log practice
            </Button>
          </div>
        </form>
      </Card>

      {logs.length === 0 ? (
        <EmptyState title="No practice logged" description="Practice sessions logged by teachers will appear here." />
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <Card key={log.id} className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-text">
                  {new Date(log.date).toLocaleDateString()} · {log.minutes} min{log.piece ? ` · ${log.piece}` : ''}
                </p>
                {log.rating && <Badge tone="accent">{log.rating}/5</Badge>}
              </div>
              {log.teacherFeedback && <p className="mt-1 text-xs text-text-secondary">{log.teacherFeedback}</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
