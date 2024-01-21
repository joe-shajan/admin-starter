import React from "react";
import { TeamMemberWithUser, TeamMember } from "@/types";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Loader } from "../Loader";

type UserRowProps = {
  teamMember: TeamMemberWithUser;
  shopId: string;
  i: number;
  teamMembersLength: number;
  setEditingTeamMember: (teamMember: TeamMemberWithUser) => void;
};

const UserRow = ({
  teamMember,
  teamMembersLength,
  shopId,
  i,
  setEditingTeamMember,
}: UserRowProps) => {
  const queryClient = useQueryClient();

  const { user, role, id } = teamMember;
  const mutation = useMutation({
    mutationFn: (teamMemberId: string) => {
      return axios.delete(`/api/shop/${shopId}/team/${teamMemberId}`);
    },
    onSuccess: (data, variable) => {
      queryClient.setQueryData(
        ["team"],
        (oldData: TeamMemberWithUser[] | undefined) => {
          if (!oldData) return;

          return oldData.filter(
            (data: TeamMemberWithUser) => data.id !== variable
          );
        }
      );
      toast.success("User removed successfully");
    },
    onError: () => {
      toast.error("Removing user failed");
    },
  });

  return (
    <tr
      key={id}
      className={`flex rounded-lg rounded-s-none flex-col flex-no wrap sm:table-row mb-2 border-grey-light md:border-b border border-l-0 sm:mb-0 hover:bg-slate-100 ${
        i % 2 === 0 ? "bg-slate-50" : ""
      }`}
    >
      <td className="p-3">{user.email}</td>
      <td className="p-3 truncate">{role}</td>
      <td className="flex gap-3 p-3 h-[48px] md:h-auto">
        <span
          className="text-blue-500 hover:text-blue-600 cursor-pointer"
          onClick={() => {
            if (teamMembersLength < 2) {
              toast.error("There must be atleat one Admin");
            } else {
              setEditingTeamMember(teamMember);
            }
          }}
        >
          <AiOutlineEdit size={22} />
        </span>
        <span
          className="text-red-500 hover:text-red-600 cursor-pointer"
          onClick={() => {
            if (teamMembersLength < 2) {
              toast.error("There must be atleat one team member");
            } else {
              mutation.mutate(id);
            }
          }}
        >
          {mutation.isLoading ? <Loader /> : <AiOutlineDelete size={22} />}
        </span>
      </td>
    </tr>
  );
};

type UsersTableProps = {
  teamMembers: TeamMemberWithUser[];
  shopId: string;
  setEditingTeamMember: (teamMember: TeamMemberWithUser) => void;
};

const UsersTable = ({
  teamMembers,
  shopId,
  setEditingTeamMember,
}: UsersTableProps) => {
  return (
    <div className="container my-2 mx-auto px-4 md:px-12 lg:px-28">
      <table className="w-full flex flex-row r flex-no-wrap sm:bg-white rounded-lg overflow-hidden sm:shadow-lg my-5">
        <thead className="text-gray-700 ">
          {Array(teamMembers.length)
            .fill(0)
            .map((i) => (
              <tr
                key={i}
                className="bg-slate-100 border-grey-light md:border-0 border border-r-0 flex flex-col flex-no wrap sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0"
              >
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Role</th>

                <th className="p-3 text-left w-[100px]">Actions</th>
              </tr>
            ))}
        </thead>
        <tbody className="flex-1 sm:flex-none border-grey-light md:border-0 borde">
          {teamMembers.map((teamMember, i) => (
            <UserRow
              key={teamMember.id}
              teamMember={teamMember}
              shopId={shopId}
              i={i}
              teamMembersLength={teamMembers.length}
              setEditingTeamMember={setEditingTeamMember}
            />
          ))}
        </tbody>
      </table>
      <Toaster />
    </div>
  );
};

export default UsersTable;
