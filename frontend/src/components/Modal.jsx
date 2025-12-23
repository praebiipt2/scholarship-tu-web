import React from "react";
import { createPortal } from "react-dom"; //ให้เปิดได้ทุกทีแม้จะอยู่ใน component

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-h-[90vh] overflow-auto  w-auto min-w-[500px]  max-w-6xl p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body //อยู่เหนือ layer อื่น
  );
}

export default Modal;
