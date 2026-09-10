import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-ink disabled:opacity-50',
  secondary: 'bg-surface text-text border border-border hover:bg-canvas disabled:opacity-50',
  ghost: 'bg-transparent text-text-secondary hover:bg-canvas disabled:opacity-50',
  danger: 'bg-danger text-white hover:opacity-90 disabled:opacity-50',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', loading, className = '', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium
          transition-colors duration-150 ease-out cursor-pointer disabled:cursor-not-allowed
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
