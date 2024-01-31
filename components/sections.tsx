"use client";

import { getSections } from "@/services";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { SkeletonCard } from "./skeletons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { isSuperAdmin } from "@/lib/utils";

type Props = {
  hide: boolean;
};

export const Sections = ({ hide }: Props) => {
  const { data: session } = useSession();

  const router = useRouter();

  const {
    data: sections,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sections"],
    queryFn: () => getSections(),
  });

  return (
    <div
      className={`${
        hide ? `hidden md:block md:w-1/5` : `w-full md:w-1/5`
      } border rounded overflow-auto`}
    >
      {isSuperAdmin(session) ? (
        <div className="py-4 px-4 flex justify-end">
          <Link href="/new">
            <Button>Add new section</Button>
          </Link>
        </div>
      ) : null}
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
                onClick={() => router.push(`/${section.id}`)}
              >
                <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
                  {section.name}
                </div>
                {section.type === "IMAGE" && section.url ? (
                  <div className="w-full relative pt-[50%] mt-2">
                    <Image
                      src={section.url}
                      alt="profile"
                      objectFit="contain"
                      fill
                      className="w-full h-auto top-0 left-0 rounded-md border"
                    />
                  </div>
                ) : null}

                {section.type === "VIDEO" && section.url ? (
                  <div className="w-full mt-2 rounded-md border overflow-hidden">
                    <video src={section.url} autoPlay loop muted></video>
                  </div>
                ) : null}

                {section.type === "TEXT" && section.text ? (
                  <div className="w-full h-28 p-1  mt-2 border rounded-md">
                    <p>{section.text}</p>
                  </div>
                ) : null}

                {section.type === "EMBEDED" && section.url ? (
                  <div className="w-full  mt-2  overflow-hidden border rounded-md">
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
