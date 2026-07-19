import React from "react";

const InvoiceFooter = ({ bill, message }) => {
  return (
    <div className="border-t mt-6 pt-4 text-center text-sm text-gray-600">
      <p className="capitalize mb-2">
        <span className="font-semibold">Payment :</span> {bill.paymentMethod}
      </p>
      {message ? (
        <p>{message}</p>
      ) : (
        <>
          <p>Thank you for shopping!</p>
          <p>Goods once sold will not be returned.</p>
          <p className="font-semibold">Visit Again!</p>
        </>
      )}
    </div>
  );
};

export default InvoiceFooter;
