import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text
        placeholder:text-text-secondary outline-none transition-colors
        focus:border-accent disabled:opacity-50 disabled:bg-canvas ${className}`}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-text">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-text-secondary">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
