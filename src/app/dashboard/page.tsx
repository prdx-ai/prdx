import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import DashboardUI from "@/components/DashboardUI";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <SubscriptionCheck bypassForTesting={true}>
      <div className="flex flex-col h-screen bg-gray-950">
        <main className="flex-1 overflow-hidden">
          <div className="h-full">
            <DashboardUI />
          </div>
        </main>
      </div>
    </SubscriptionCheck>
  );
}
