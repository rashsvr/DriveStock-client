import React from "react";

const Modal = ({ isOpen, onClose, title, message, primaryButtonText = "OK" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-sm">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button className="btn border-orange-400" onClick={onClose}>
            {primaryButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;