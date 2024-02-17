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
                <div className="w-full whitespace-nowrap text-lg overflow-hidden text-ellipsis p-2 rounded-lg hover:bg-slate-50 transition ease">
                  {section.name}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
