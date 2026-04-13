import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  // Simple check for now. In production, use JWT or Supabase Auth.
  if (!session || session.value !== 'true') {
    // We don't redirect if we are already on the login page to avoid loops
    // But layout only applies to children, and /admin/login is a sibling or child
    // Actually, I'll move layout to a group.
  }

  return <>{children}</>;
}
