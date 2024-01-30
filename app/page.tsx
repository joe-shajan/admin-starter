"use client";

import { SectionForm } from "@/components/sectionForm";
import { Button } from "@/components/ui/button";
import useModal from "@/hooks/useModal";
import { getSections } from "@/services";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { Sections as SctionTYpe } from "@/types";
import { Sections } from "@/components/sections";

export default function Home() {
  const { isOpen, toggle } = useModal();
  const { data: session } = useSession();
  const [selectedSection, setSelectedSection] = useState<SctionTYpe | null>(
    null
  );

  // const {
  //   data: sections,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["sections"],
  //   queryFn: () => getSections(),
  // });

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
