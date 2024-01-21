"use client";
import { Button } from "@/components";
import "../shop.css";

import useModal from "@/hooks/useModal";
import Modal from "@/components/Modal";
import UsersTable from "@/components/team/TeamMembersTable";
import { AddTeamMember } from "@/components/team/TeamMember";
import { useQuery } from "@tanstack/react-query";
import { getTeamMembers } from "@/services/TeamsServices";
import { getUserRole } from "@/services";
import { useEffect, useState } from "react";
import { TeamMemberWithUser } from "@/types";
import { Loader } from "@/components/Loader";

export default function Page({ params }: any) {
  const { id } = params;
  const { isOpen, toggle, openModal, closeModal } = useModal();

  const [editingTeamMember, setEditingTeamMember] =
    useState<TeamMemberWithUser | null>(null);

  const {
    data: teamMembers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["team"],
    queryFn: () => getTeamMembers(id),
  });

  const { data: userRole } = useQuery({
    queryKey: ["userRole"],
    queryFn: () => getUserRole(id),
  });

  useEffect(() => {
    if (editingTeamMember) {
      openModal();
    } else {
      closeModal();
    }
  }, [closeModal, editingTeamMember, openModal]);

  if (error) {
    return <div>Could not fetch team members</div>;
  }

  return (
    <>
      {userRole === "ADMIN" ? (
        <>
          <Modal isOpen={isOpen} toggle={toggle}>
            <AddTeamMember
              userRole={userRole || "MANAGER"}
              toggle={toggle}
              shopId={id}
              editingTeamMember={editingTeamMember}
              setEditingTeamMember={setEditingTeamMember}
            />
          </Modal>
          <div className="flex md:flex-row flex-col md:justify-between md:items-center px-4 md:px-12 lg:px-28 mt-6 mb-2">
            <div className="text-2xl md:ms-16 font-semibold text-center md:text-left md:mb-0 mb-6">
              Team Members
            </div>
            <div className="flex justify-end">
              <Button onClick={toggle}>Add team member</Button>
            </div>
          </div>
        </>
      ) : null}

      {isLoading ? (
        <div className="text-lg container my-2 mx-auto px-4 md:px-12 lg:px-28 flex justify-center items-center h-[400px]">
          <Loader size="xl" />
        </div>
      ) : teamMembers ? (
        <UsersTable
          teamMembers={teamMembers}
          shopId={id}
          setEditingTeamMember={setEditingTeamMember}
        />
      ) : null}
    </>
  );
}
