"use client";

import { Sections } from "@/components/sections";

export default function Home() {
  return (
    <div className="flex h-[91vh] p-2 gap-2">
      <Sections hide={false} />
      <div className="border p-6 w-4/5 rounded justify-center md:flex items-center hidden">
        <h4 className="text-2xl font-medium">Select a section to edit</h4>
      </div>
    </div>
  );
}
