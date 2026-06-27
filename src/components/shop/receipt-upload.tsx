"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ReceiptUploadProps {
  orderId?: string;
  onUploaded: (url: string) => void;
}

export function ReceiptUpload({ orderId, onUploaded }: ReceiptUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setPreview(data.url);
        onUploaded(data.url);
        if (orderId) {
          await fetch(`/api/orders/${orderId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ receiptUrl: data.url }),
          });
        }
        toast.success("Chek yuklandi!");
      } catch {
        toast.error("Yuklash xatosi");
      } finally {
        setUploading(false);
      }
    },
    [orderId, onUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`interactive mt-4 cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
        isDragActive ? "border-azure bg-azure/10" : "border-white/20 hover:border-azure/50"
      }`}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-glow" />
      ) : preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Receipt" className="mx-auto max-h-40 rounded-lg" />
      ) : (
        <>
          <Upload className="mx-auto h-8 w-8 text-slate" />
          <p className="text-slate mt-2 text-sm">Chekni bu yerga tashlang yoki bosing</p>
        </>
      )}
    </div>
  );
}
