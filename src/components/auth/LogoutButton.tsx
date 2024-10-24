"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ButtonLoading from "../loading/ButtonLoading";
import { signout } from "@/app/actions/auth/signout";

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signout();
    } catch (e) {
      console.error("Something went wrong");
      setIsLoading(false);
    }
  };
  return (
    <ButtonLoading
      onClick={handleSignOut}
      isLoading={isLoading}
      buttonText="Sign out"
      loadingButtonText="Signing out..."
    />
  );
}
