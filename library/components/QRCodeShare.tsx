"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaQrcode, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "qrcode";

interface QRCodeShareProps {
  roomUrl: string;
  roomCode: string;
}

export default function QRCodeShare({ roomUrl, roomCode }: QRCodeShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    if (isOpen && roomUrl) {
      QRCode.toDataURL(roomUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error("QR Code generation error:", err));
    }
  }, [isOpen, roomUrl]);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
      >
        <FaQrcode /> QR Code
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md space-y-6 rounded-2xl border-2 border-white/20 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Scan to Join</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center rounded-xl bg-white p-4">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="QR Code" className="h-64 w-64" />
                  ) : (
                    <div className="flex h-64 w-64 items-center justify-center">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
                    </div>
                  )}
                </div>

                <div className="rounded-lg bg-gray-100 p-4 text-center">
                  <p className="text-sm font-semibold text-gray-600">Room Code</p>
                  <p className="font-mono text-3xl font-bold text-gray-900">{roomCode}</p>
                </div>

                <p className="text-center text-sm text-gray-600">
                  Scan this QR code with your phone to join the game instantly!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}