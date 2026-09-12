import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent text-white shadow-sm hover:bg-accent-ink hover:shadow-md disabled:opacity-50',
  secondary:
    'border border-border bg-surface text-text shadow-sm hover:bg-canvas hover:border-text-secondary/30 disabled:opacity-50',
  ghost:
    'bg-transparent text-text-secondary hover:bg-canvas hover:text-text disabled:opacity-50',
  danger:
    'bg-danger text-white shadow-sm hover:opacity-90 disabled:opacity-50',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      loading,
      className = '',
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium
          transition-all duration-150 ease-out cursor-pointer
          focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {loading && (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
