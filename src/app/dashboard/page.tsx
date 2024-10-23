import LogoutButton from "@/components/auth/LogoutButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // console.log("dashboard page props", user);

  return (
    <div>
      Dashboard page
      {user?.email}
      <LogoutButton />
    </div>
  );
}
