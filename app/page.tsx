"use client";

import { SectionForm } from "@/components/sectionForm";
import { Button } from "@/components/ui/button";
import useModal from "@/hooks/useModal";
import { getSections } from "@/services";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function Home() {
  const { isOpen, toggle } = useModal();
  const { data: session } = useSession();

  const {
    data: sections,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sections"],
    queryFn: () => getSections(),
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axios.post("/api/sections", data);
    },
    onSuccess: () => {
      console.log("success");

      // toast.success("Signup successfull now Log in");
      // router.push("/auth/login");
    },
    onError: () => {
      // toast.error("Signup failed");
    },
  });

  return (
    <div className="flex h-[91vh] p-2 gap-2">
      <div className="w-1/5 border rounded">
        {sections?.map((section) => (
          <div key={section.id}>{section.name}</div>
        ))}
      </div>

      <div className="border p-6 w-4/5 rounded">
        {/* <div></div>
        <Button
          onClick={() => mutation.mutate({ name: "section-1", type: "IMAGE" })}
        >
          add section
        </Button> */}
        <SectionForm />
      </div>
    </div>
  );
}
