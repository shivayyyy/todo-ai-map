import { redirect } from "next/navigation";
import { requireUser, getProfile } from "@/lib/dal";
import { getActivityTracker, getOverallProgress } from "@/lib/queries";
import { AppNav } from "@/components/app-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  if (!profile?.onboarded) redirect("/onboarding");

  const [overall, activity] = await Promise.all([
    getOverallProgress(user.id),
    getActivityTracker(user.id),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <AppNav
        name={user.name}
        email={user.email}
        overall={overall}
        activity={activity}
      />
      <div className="flex-1">{children}</div>
    </div>
  );
}
