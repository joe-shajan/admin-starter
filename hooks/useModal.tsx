"use client";

import { useCallback, useState } from "react";

export default function useModal() {
  const [isOpen, setisOpen] = useState(false);

  const toggle = useCallback(() => {
    setisOpen(!isOpen);
  }, [isOpen]);

  const openModal = useCallback(() => {
    setisOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setisOpen(false);
  }, []);

  return {
    isOpen,
    toggle,
    openModal,
    closeModal,
  };
}
