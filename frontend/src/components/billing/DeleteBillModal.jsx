import React from "react";

const DeleteBillModal = ({ open, bill, onClose, onConfirm }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-sm p-6">
        <h2 className="text-lg font-bold mb-2">Delete this bill?</h2>
        <p className="text-gray-600 mb-6">
          Invoice {bill?.billNumber} will be permanently removed.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 border py-2 rounded hover:bg-gray-100"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-2 rounded"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBillModal;
