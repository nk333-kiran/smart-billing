import React from "react";

const InvoiceHeader = ({ store, bill }) => {
  return (
    <div className="border-b pb-4 mb-4">
      <div className="text-center">
        {store.logo && (
          <img
            src={store.logo}
            alt={store.name}
            className="h-14 mx-auto mb-2 object-contain"
          />
        )}
        <h1 className="text-2xl font-bold">{store.name}</h1>
        <p className="text-sm text-gray-600">{store.address}</p>
        <p className="text-sm text-gray-600">
          GSTIN : {store.gstin} · Phone : {store.phone}
        </p>
      </div>

      <div className="flex justify-between mt-4 text-sm">
        <div>
          <p>
            <span className="font-semibold">Invoice No :</span>{" "}
            {bill.billNumber}
          </p>
          <p>
            <span className="font-semibold">Date :</span>{" "}
            {new Date(bill.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Customer</p>
          <p>{bill.customer?.name || "Walk-in Customer"}</p>
          {bill.customer?.phone && <p>{bill.customer.phone}</p>}
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
