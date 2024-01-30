"use client";

import { SectionForm } from "@/components/sectionForm";
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
    <div className="flex h-[91vh] p-2 gap-2">
      <Sections />
      {isLoading ? (
        <div>loading...</div>
      ) : error ? (
        <div>cound not found section</div>
      ) : (
        <SectionForm selectedSection={section} />
      )}
    </div>
  );
}
