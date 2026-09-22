'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Clock, ShieldCheck, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import { ApiError } from '@/api/client';
import { publicSignaturesApi } from '@/features/signatures/api/signatures.api';
import type { PublicSignatureView } from '@/features/signatures/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

const CLOSED_MESSAGE: Record<string, string> = {
  DECLINED: 'This request was declined.',
  EXPIRED: 'This signing link has expired. Ask the sender for a new one.',
  CANCELLED: 'The sender cancelled this request.',
};

const longDate = (value: string) => new Date(value).toLocaleDateString(undefined, { dateStyle: 'long' });

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-start justify-center bg-canvas px-4 py-10 sm:py-16">
      <div className="w-full max-w-2xl">{children}</div>
    </main>
  );
}

function Notice({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <Shell>
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-10 text-center">
        {icon}
        <h1 className="text-lg font-semibold text-text">{title}</h1>
        <p className="max-w-sm text-sm text-text-secondary">{text}</p>
      </div>
    </Shell>
  );
}

export function SigningView({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const key = ['public-signature', token];
  const { data, isLoading, error } = useQuery({ queryKey: key, queryFn: () => publicSignaturesApi.view(token), retry: false });
  const [typedName, setTypedName] = useState('');
  const [agreed, setAgreed] = useState(false);

  const onSuccess = (result: PublicSignatureView) => queryClient.setQueryData(key, result);
  const onError = (err: unknown) => toast.error(err instanceof ApiError ? err.message : 'Something went wrong.');

  const sign = useMutation({ mutationFn: () => publicSignaturesApi.sign(token, { typedName, agreed }), onSuccess, onError });
  const decline = useMutation({ mutationFn: () => publicSignaturesApi.decline(token), onSuccess, onError });

  if (isLoading) {
    return (
      <Shell>
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      </Shell>
    );
  }

  if (error || !data) {
    return (
      <Notice
        icon={<XCircle className="h-8 w-8 text-danger" />}
        title="This link isn't valid"
        text="Check that you opened the full link from your email, or ask the sender to resend it."
      />
    );
  }

  if (data.status === 'SIGNED') {
    return (
      <Notice
        icon={<CheckCircle2 className="h-8 w-8 text-success" />}
        title="Signed — thank you"
        text={`${data.signedName} signed “${data.title}” on ${longDate(data.signedAt ?? '')}. A confirmation has been emailed to you. Reference: ${data.bodyHash.slice(0, 16)}…`}
      />
    );
  }

  if (data.status !== 'PENDING') {
    return <Notice icon={<Clock className="h-8 w-8 text-text-secondary" />} title="Not open for signing" text={CLOSED_MESSAGE[data.status] ?? ''} />;
  }

  const canSign = agreed && typedName.trim().length >= 2;

  return (
    <Shell>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">{data.organizationName}</p>
      <h1 className="mb-1 text-2xl font-semibold text-text">{data.title}</h1>
      <p className="mb-6 text-sm text-text-secondary">
        For {data.signerName} · please sign by {longDate(data.expiresAt)}
      </p>

      <div className="mb-6 max-h-96 overflow-y-auto whitespace-pre-wrap rounded-2xl border border-border bg-surface p-5 text-sm leading-relaxed text-text">
        {data.body}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <label htmlFor="typedName" className="mb-1.5 block text-sm font-medium text-text">
          Type your full name to sign
        </label>
        <Input id="typedName" value={typedName} onChange={(event) => setTypedName(event.target.value)} autoComplete="name" />

        <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-sm text-text-secondary">
          <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--accent)]" />
          <span>I have read this document and agree to sign it electronically by typing my name.</span>
        </label>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button disabled={!canSign} loading={sign.isPending} onClick={() => sign.mutate()}>
            Sign document
          </Button>
          <Button variant="ghost" loading={decline.isPending} onClick={() => decline.mutate()}>
            Decline
          </Button>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-text-secondary">
        <ShieldCheck className="h-3.5 w-3.5" />
        Your name, the time and your device details are recorded with this signature.
      </p>
    </Shell>
  );
}
