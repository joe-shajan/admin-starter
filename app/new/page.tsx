"use client";

import { SectionForm } from "@/components/sectionForm";
import { Sections } from "@/components/sections";

export default function Section() {
  return (
    <div className="flex h-[91vh] p-2 gap-2">
      <Sections hide />
      <div className={`w-full md:w-4/5 border rounded p-6`}>
        <SectionForm isEditing={false} />
      </div>
    </div>
  );
}
