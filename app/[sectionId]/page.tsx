"use client";

import { SectionForm } from "@/components/newsectionForm";
// import { SectionForm } from "@/components/sectionForm";
import { Sections } from "@/components/sections";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSection } from "@/services";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { isSuperAdmin } from "@/lib/utils";
import { useSession } from "next-auth/react";

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
