"use client";

import { SectionForm } from "@/components/sectionForm";
import { useState } from "react";
import { Sections as SctionTYpe } from "@/types";
import { Sections } from "@/components/sections";

export default function Home() {
  const [selectedSection, setSelectedSection] = useState<SctionTYpe | null>(
    null
  );

  return (
    <div className="flex h-[91vh] p-2 gap-2">
      <Sections />

      <SectionForm
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
      />
    </div>
  );
}
