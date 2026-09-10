import { ReactNode } from 'react';

type Tone = 'accent' | 'success' | 'danger' | 'info' | 'neutral';

const toneClasses: Record<Tone, string> = {
  accent: 'bg-accent-soft text-accent-ink',
  success: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  neutral: 'bg-canvas text-text-secondary',
};

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}

/**
 * Maps the entity-status vocabulary shared across Branch/User (ACTIVE,
 * ARCHIVED, SUSPENDED, INVITED, INACTIVE, PRIMARY) to a single
 * consistent tone system — the same "what state is this thing in"
 * question, answered the same visual way, everywhere in the console.
 */
const STATUS_TONE: Record<string, Tone> = {
  ACTIVE: 'accent',
  PRIMARY: 'accent',
  STANDARD: 'neutral',
  ARCHIVED: 'neutral',
  SUSPENDED: 'danger',
  INVITED: 'info',
  INACTIVE: 'neutral',
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={STATUS_TONE[status] ?? 'neutral'}>{status.toLowerCase()}</Badge>;
}

/** The left-border "status rail" — the console's one recurring signature motif. */
const RAIL_COLOR: Record<string, string> = {
  ACTIVE: 'var(--accent)',
  PRIMARY: 'var(--accent)',
  STANDARD: 'var(--border)',
  ARCHIVED: 'var(--border)',
  SUSPENDED: 'var(--danger)',
  INVITED: 'var(--info)',
  INACTIVE: 'var(--border)',
};

export function StatusRail({ status, children }: { status: string; children: ReactNode }) {
  return (
    <div
      className="border-l-[3px] pl-3.5"
      style={{ borderColor: RAIL_COLOR[status] ?? 'var(--border)' }}
    >
      {children}
    </div>
  );
}
