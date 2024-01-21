import React, { ReactNode } from "react";

interface ModalType {
  children?: ReactNode;
  isOpen: boolean;
  toggle: () => void;
}

export default function Modal({ toggle, isOpen, children }: ModalType) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center w-screen h-screen bg-black bg-opacity-70 z-50 p-6 md:p-0">
          <div className="block bg-white w-full md:w-1/3 h-auto rounded-lg">
            {children}
          </div>
        </div>
      )}
    </>
  );
}
