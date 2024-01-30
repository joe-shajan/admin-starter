"use client";

import { getSections } from "@/services";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { SkeletonCard } from "./skeletons";

type Props = {};

export const Sections = (props: Props) => {
  const {
    data: sections,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sections"],
    queryFn: () => getSections(),
  });

  return (
    <div className="w-full md:w-1/5 border rounded overflow-auto">
      <div className="py-4 px-4 flex justify-end">
        <Link href="/new">
          <Button>Add new section</Button>
        </Link>
      </div>
      {isLoading ? (
        <div className="px-4 py-3 flex flex-col space-y-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <>
          {sections?.map((section) => (
            <div key={section.id} className="px-4 py-3">
              <div
                className="cursor-pointer"
                // onClick={() => setSelectedSection(section)}
              >
                <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
                  {section.name}
                </div>
                {section.type === "IMAGE" && section.url ? (
                  <div className="w-full relative pt-[50%] mt-2">
                    <Image
                      src={section.url}
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
                      src={section.url}
                      allow="accelerometer; encrypted-media; gyroscope"
                    ></iframe>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
