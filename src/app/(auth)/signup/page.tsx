import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getSession } from "@/lib/dal";

export default async function SignupPage() {
  const session = await getSession();
  if (session?.user) redirect("/plan");
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <AuthForm mode="signup" />
    </main>
  );
}
