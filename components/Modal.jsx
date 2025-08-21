"use client";

import { useEffect, useState } from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.key = "Escape")) {
        onClose();
      }
      window.addEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-5 shadow-md max-w-sm mx-auto">
          <button onClick={onClose}>{children}</button>
        </div>
      </div>
    </>
  );
};

export default Modal;
