"use client";

import { SectionForm } from "@/components/sectionForm";
import { Sections } from "@/components/sections";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSection } from "@/services";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

export default function Section() {
  const { sectionId } = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: section,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["section"],
    queryFn: () => getSection(sectionId as string),
  });

  const deleteMutation = useMutation({
    mutationFn: (sectionId: string) => {
      return axios.delete(`/api/sections/${sectionId}`);
    },
    onSuccess: (response) => {
      router.push("/");
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      toast({
        title: "Section deleted successfully",
      });
      // Handle any additional logic after successful deletion
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: "Error deleting section",
      });
    },
  });

  const handleDeleteSection = (sectionId: string) => {
    deleteMutation.mutate(sectionId);
  };

  return (
    <div className="flex h-[91vh] p-2 gap-2">
      <Sections hide />
      {isLoading ? (
        <div>loading...</div>
      ) : error ? (
        <div>cound not found section</div>
      ) : (
        <div className={`w-full md:w-4/5 border rounded p-6`}>
          <SectionForm selectedSection={section} isEditing={true} />
          {section ? (
            <>
              {deleteMutation.isLoading ? (
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-2"
                  disabled
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleDeleteSection(section.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
