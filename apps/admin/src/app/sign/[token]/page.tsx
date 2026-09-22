import { SigningView } from '@/sections/signatures/SigningView';

export default async function SignPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <SigningView token={token} />;
}
