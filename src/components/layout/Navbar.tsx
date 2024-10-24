import { User } from "@supabase/supabase-js";
import LogoutButton from "../auth/LogoutButton";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async () => {
  // Replace javascript:void(0) paths with your paths
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const navigation = [
    { title: "Features", path: "#" },
    { title: "Integrations", path: "#" },
    { title: "Customers", path: "#" },
    { title: "Pricing", path: "#" },
  ];

  return (
    <nav className="bg-white border-b w-full md:static md:text-sm md:border-none">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:py-5 md:block">
          <a href="#">
            <img
              src="https://www.floatui.com/logo.svg"
              width={120}
              height={50}
              alt="Float UI logo"
            />
          </a>
        </div>
        <div className={`flex-1 pb-3 mt-8 md:block md:pb-0 md:mt-0 block`}>
          <ul className="justify-end items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
            {navigation.map((item, idx) => {
              return (
                <li key={idx} className="text-gray-700 hover:text-indigo-600">
                  <a href={item.path} className="block">
                    {item.title}
                  </a>
                </li>
              );
            })}
            <span className="hidden w-px h-6 bg-gray-300 md:block"></span>
            <div className="items-center space-x-4 px-4 max-w-screen-xl mx-auto md:flex md:px-8">
              {user ? (
                <>
                  <span>{user.email}</span>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link href="/signin">Sign in</Link>
                  <Link href="/signup">Sign up</Link>
                </>
              )}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};
