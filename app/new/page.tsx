"use client";

import { SectionForm } from "@/components/sectionForm";
import { Sections } from "@/components/sections";

export default function Section() {
  return (
    <div className="flex h-[91vh] p-2 gap-2">
      <Sections hide />
      <SectionForm hide={false} isEditing={false} />
    </div>
  );
}
