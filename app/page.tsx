"use client";

import { SectionForm } from "@/components/sectionForm";
import { Button } from "@/components/ui/button";
import useModal from "@/hooks/useModal";
import { getSections } from "@/services";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";

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

  return (
    <div className="flex h-[91vh] p-2 gap-2">
      <div className="w-1/5 border rounded overflow-auto">
        {sections?.map((section) => (
          <div key={section.id} className="px-6 py-3 ">
            <div className="cursor-pointer">
              <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
                {section.name}
              </div>

              {/* <Image
                src="https://agency-demo-joe.s3.amazonaws.com/360_F_283839302_yt6JIsE96Pj4PydFDcBNKDUnuSpYB9h0.jpg"
                className="w-full h-auto"
                alt="image"
                fill
                objectFit="contain"
              /> */}
              {section.type === "IMAGE" ? (
                <div className="w-full relative pt-[50%] mt-2">
                  <Image
                    src="https://agency-demo-joe.s3.amazonaws.com/360_F_283839302_yt6JIsE96Pj4PydFDcBNKDUnuSpYB9h0.jpg"
                    alt="profile"
                    objectFit="cover"
                    fill
                    className="w-full h-auto top-0 left-0 object-contain rounded-md"
                  />
                </div>
              ) : null}

              {section.type === "VIDEO" && section.url ? (
                <div className="w-full mt-2 rounded-md overflow-hidden">
                  <video src={section.url} autoPlay loop muted></video>
                </div>
              ) : null}

              {section.type === "TEXT" && section.text ? (
                <div className="w-full h-28 p-1  mt-2 border rounded-md">
                  <p>{section.text}</p>
                </div>
              ) : null}

              {section.type === "EMBEDED" && section.url ? (
                <div className="w-full  mt-2  overflow-hidden rounded-md">
                  {/* <p>{section.url}</p> */}
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/aSW7RJ5zWgE"
                    allow="accelerometer; encrypted-media; gyroscope"
                  ></iframe>
                </div>
              ) : null}
            </div>
          </div>
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
