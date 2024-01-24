"use client";
import React from "react";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "./ui";

const Header = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isSignupOrLogin =
    pathname === "/auth/login" || pathname === "/auth/signup";

  return (
    <div className="h-16 bg-slate-100 w-full flex justify-around items-center">
      <div>
        <Link href="/">
          <h1 className="text-lg font-semibold">Gallery</h1>
        </Link>
      </div>
      {isSignupOrLogin ? (
        <div></div>
      ) : session ? (
        <Button onClick={() => signOut()}>Log out</Button>
      ) : (
        <Link href="/auth/login">
          <Button>Login</Button>
        </Link>
      )}
    </div>
  );
};

export default Header;
