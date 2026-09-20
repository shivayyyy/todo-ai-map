import { redirect } from "next/navigation";
import { requireUser, getProfile } from "@/lib/dal";
import { OnboardingForm } from "@/components/onboarding-form";

export default async function OnboardingPage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  if (profile?.onboarded) redirect("/plan");
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <OnboardingForm />
    </main>
  );
}
