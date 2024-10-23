"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.refresh();
      router.push("/");
    } catch {
      console.log("Something went wrong with logout");
    }
  };
  return <Button onClick={handleLogout}>Logout</Button>;
}
