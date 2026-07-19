import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const BarcodeScanner = ({ onScan, onCancel }) => {
  const [error, setError] = useState("");
  const scannerRef = useRef(null);

  useEffect(() => {
    let html5QrCode;

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode("reader");
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            html5QrCode.stop().then(() => {
              onScan(decodedText);
            }).catch(err => console.error("Error stopping scanner", err));
          },
          (errorMessage) => {
            // parse errors are frequent, ignore them
          }
        );
      } catch (err) {
        setError("Camera permission denied or camera not found.");
      }
    };

    startScanner();

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.error("Error stopping scanner during unmount", err));
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
      <div className="bg-white p-4 rounded max-w-sm w-full">
        <h3 className="text-lg font-bold mb-2">Scan Barcode</h3>
        {error ? (
          <div className="text-red-500 mb-2">{error}</div>
        ) : (
          <div id="reader" className="w-full"></div>
        )}
        <button
          onClick={onCancel}
          className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BarcodeScanner;
