"use client";

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
    <>
      {session ? (
        <>
          <div>user logged in</div>
          <button
            onClick={() =>
              mutation.mutate({ name: "section-1", type: "IMAGE" })
            }
            className="bg-black p-4 text-white"
          >
            add section
          </button>
          <div>
            {sections?.map((section) => (
              <div key={section.id}>{section.name}</div>
            ))}
          </div>
        </>
      ) : (
        <div className=" text-lg container my-2 mx-auto px-4 md:px-12 lg:px-28 flex justify-center items-center h-[400px]">
          Login to continue
        </div>
      )}
    </>
  );
}
