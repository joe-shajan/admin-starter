"use client";

import { SectionForm } from "@/components/newsectionForm";
import { Sections } from "@/components/sections";
import { isSuperAdmin } from "@/lib/utils";
import { useSession } from "next-auth/react";

export default function Section() {
  const { data: session } = useSession();

  return (
    <div className="flex h-[91vh] p-2 gap-2">
      <Sections hide />
      <div className={`w-full md:w-4/5 border rounded p-6`}>
        {isSuperAdmin(session) ? (
          <SectionForm isEditing={false} />
        ) : (
          // <SectionForm isEditing={false} />
          <div>You are not allowed to add new section</div>
        )}
      </div>
    </div>
  );
}
