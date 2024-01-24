"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui";

const LogoutButton = () => {
  return <Button onClick={() => signOut()}>Log out</Button>;
};

export { LogoutButton };
