"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components";
import { TeamMemberWithUser, UserRoles } from "@/types";
import { useEffect } from "react";
import { Loader } from "../Loader";
import { AiOutlineClose } from "react-icons/ai";

const validationSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email",
  }),
  role: z.string().min(1, { message: "role is required" }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

type AddTeamMemberFormType = {
  toggle: () => void;
  setEditingTeamMember: (product: TeamMemberWithUser | null) => void;
  shopId: string;
  editingTeamMember: TeamMemberWithUser | null;
  userRole: UserRoles;
};

export const AddTeamMemberForm = ({
  shopId,
  toggle,
  editingTeamMember,
  setEditingTeamMember,
}: AddTeamMemberFormType) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ValidationSchema>({
    // @ts-ignore
    resolver: zodResolver(validationSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: ValidationSchema) => {
      return axios.post(`/api/shop/${shopId}/team`, data);
    },
    onSuccess: ({ data }) => {
      queryClient.setQueryData(["team"], (oldData: any) => [
        ...oldData,
        data.newTeamMember,
      ]);

      toggle();
      toast.success("Team member added successfully");
    },
    onError: () => {
      toast.error("Adding team member failed");
    },
  });

  const editTeamMemberMutation = useMutation({
    mutationFn: (data: ValidationSchema) => {
      return axios.put(
        `/api/shop/${shopId}/team/${editingTeamMember?.id}`,
        data
      );
    },
    onSuccess: ({ data }) => {
      toggle();
      setEditingTeamMember(null);
      queryClient.setQueryData(["team"], (oldData: any) => {
        return oldData.map((teamMember: any) => {
          if (teamMember.id === editingTeamMember?.id) {
            teamMember.role = data.updatedTeamMember.role;
          }
          return teamMember;
        });
      });
      toast.success("Team member updated successfully");
    },
    onError: (error) => {
      console.log(error);

      toast.error("Could not update Team member");
    },
  });

  useEffect(() => {
    if (editingTeamMember) {
      setValue("email", editingTeamMember.user.email);
      setValue("role", editingTeamMember.role);
    }
  }, [editingTeamMember]);

  return (
    <form
      className="px-8 pt-6 pb-2 mb-4"
      onSubmit={handleSubmit((formData) => {
        if (editingTeamMember) {
          editTeamMemberMutation.mutate(formData);
        } else {
          mutation.mutate(formData);
        }
      })}
    >
      <div className="mb-4 md:mr-2">
        <label
          className="block mb-2 text-sm font-bold text-gray-700"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border ${
            errors.email && "border-red-500"
          } rounded appearance-none focus:outline-none focus:shadow-outline`}
          id="email"
          type="text"
          placeholder="email"
          disabled={editingTeamMember ? true : false}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.email?.message}
          </p>
        )}
      </div>
      <div className="mb-6">
        <label
          className="block mb-2 text-sm font-bold text-gray-700"
          htmlFor="role"
        >
          Role
        </label>
        <select
          className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border ${
            errors.role && "border-red-500"
          } rounded appearance-none focus:outline-none focus:shadow-outline`}
          id="role"
          {...register("role")}
          defaultValue="MANAGER" // Set "MANAGER" as the default value
        >
          <option value="ADMIN">ADMIN</option>
          <option value="MANAGER">MANAGER</option>
        </select>
        {errors.role && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.role?.message}
          </p>
        )}
      </div>

      <div className="text-center">
        <Button className="w-full " type="submit">
          {editingTeamMember ? (
            editTeamMemberMutation.isLoading ? (
              <Loader />
            ) : (
              "Update Team member"
            )
          ) : mutation.isLoading ? (
            <Loader />
          ) : (
            "Add Team member"
          )}
        </Button>
      </div>
    </form>
  );
};

type AddTeamMemberProps = {
  toggle: () => void;
  setEditingTeamMember: (product: TeamMemberWithUser | null) => void;
  shopId: string;
  editingTeamMember: TeamMemberWithUser | null;
  userRole: UserRoles;
};

export const AddTeamMember = ({
  toggle,
  setEditingTeamMember,
  ...props
}: AddTeamMemberProps) => {
  return (
    <div className="max-w-xl mx-auto my-auto py-4 w-full">
      <div className="flex justify-center">
        <div className="w-full lg:w-11/12">
          <div className="flex justify-between items-center px-5">
            <h3 className="text-lg font-semibold">Add new User</h3>
            <div
              className="text-lg cursor-pointer hover:bg-slate-100 p-1 rounded-lg"
              onClick={() => {
                setEditingTeamMember(null);
                toggle();
              }}
            >
              <AiOutlineClose />
            </div>
          </div>
          <AddTeamMemberForm
            toggle={toggle}
            setEditingTeamMember={setEditingTeamMember}
            {...props}
          />
        </div>
      </div>
      <Toaster />
    </div>
  );
};
