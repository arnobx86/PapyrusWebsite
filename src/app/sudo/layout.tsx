import { cookies } from 'next/headers';

export default async function SudoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
