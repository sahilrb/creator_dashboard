import React from 'react';

interface updateCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const UpdateCreditModal: React.FC<updateCreditModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default UpdateCreditModal;