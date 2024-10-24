"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ButtonLoading from "../loading/ButtonLoading";

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await supabase.auth.signOut();
      if (response.error) {
        setIsLoading(false);
      }
      router.refresh();
      router.push("/");
    } catch {
      setIsLoading(false);
      console.log("Something went wrong with logout");
    }
  };

  return (
    <ButtonLoading
      onClick={handleLogout}
      isLoading={isLoading}
      loadingButtonText="Signing out..."
      buttonText="Sign out"
    />
  );
}
