"use client";

import { SectionForm } from "@/components/newsectionForm";
import { Sections } from "@/components/sections";
import { useQuery } from "@tanstack/react-query";
import { getSection } from "@/services";
import { useParams } from "next/navigation";

export default function Section() {
  const { sectionId } = useParams();

  const {
    data: section,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["section"],
    queryFn: () => getSection(sectionId as string),
  });

  return (
    <div className="flex md:h-[91vh] p-2 gap-2">
      <Sections hide />
      {isLoading ? (
        <div>loading...</div>
      ) : error ? (
        <div>cound not found section</div>
      ) : (
        <div className={`w-full md:w-4/5 border rounded`}>
          <SectionForm selectedSection={section} isEditing={true} />
        </div>
      )}
    </div>
  );
}
