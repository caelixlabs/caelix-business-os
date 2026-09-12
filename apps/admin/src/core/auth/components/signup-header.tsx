import Image from 'next/image';

export function SignupHeader({ step }: { step: 1 | 2 }) {
  return (
    <div className="mb-8 flex flex-col items-center gap-3">
      <Image src="/brand/caelix-business-os-lockup.png" alt="Caelix Business OS" width={110} height={110} priority />
      <h1 className="text-lg font-semibold text-text">{step === 1 ? 'Create your organization' : 'Create your owner account'}</h1>
      <p className="text-xs text-text-secondary">Step {step} of 2</p>
    </div>
  );
}
