'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useSubscribeMember, useMembershipPlans } from '@/features/memberships/api/use-memberships';
import { subscribeMemberSchema, type SubscribeMemberFormValues } from '@/features/memberships/schemas/membership.schema';
import { useGymMembers } from '@/features/gym/members/api/use-gym-members';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

export function SubscribeMemberForm({ organizationId, onDone }: { organizationId: string; onDone: () => void }) {
  const subscribe = useSubscribeMember(organizationId);
  const { data: members } = useGymMembers(organizationId);
  const { data: plans } = useMembershipPlans(organizationId);
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SubscribeMemberFormValues>({
    resolver: zodResolver(subscribeMemberSchema),
  });

  const contactId = watch('contactId');
  const planId = watch('planId');

  return (
    <form
      onSubmit={handleSubmit((values) => subscribe.mutate(values, { onSuccess: onDone }))}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">Member</span>
        <Select value={contactId ?? ''} onValueChange={(value) => setValue('contactId', value, { shouldValidate: true })}>
          <SelectTrigger>
            {members?.find((m) => m.contactId === contactId)
              ? `${members.find((m) => m.contactId === contactId)?.firstName} ${members.find((m) => m.contactId === contactId)?.lastName}`
              : 'Select a member'}
          </SelectTrigger>
          <SelectContent>
            {(members ?? []).map((member) => (
              <SelectItem key={member.id} value={member.contactId}>
                {member.firstName} {member.lastName} ({member.memberNo})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.contactId && <p className="text-xs text-danger">{errors.contactId.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">Plan</span>
        <Select value={planId ?? ''} onValueChange={(value) => setValue('planId', value, { shouldValidate: true })}>
          <SelectTrigger>{plans?.find((p) => p.id === planId)?.name ?? 'Select a plan'}</SelectTrigger>
          <SelectContent>
            {(plans ?? []).map((plan) => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.name} — {plan.durationDays} days
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.planId && <p className="text-xs text-danger">{errors.planId.message}</p>}
      </div>

      <Button type="submit" loading={subscribe.isPending}>
        Subscribe
      </Button>
    </form>
  );
}
