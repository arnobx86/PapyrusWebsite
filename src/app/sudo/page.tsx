import { redirect } from 'next/navigation';

export default function SudoPage() {
  redirect('/sudo/login');
}
