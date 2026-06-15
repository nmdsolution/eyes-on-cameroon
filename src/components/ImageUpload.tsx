"use client";

import { useState, useId } from "react";
import { Loader2, X, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  folder?: string;
}

export default function ImageUpload({ value, onChange, onUploadingChange, folder = "images" }: ImageUploadProps) {
  const id = useId();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value);

  function setUploadingState(val: boolean) {
    setUploading(val);
    onUploadingChange?.(val);
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setUploadingState(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/admin/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();
      onChange(url);
      setPreview(url);
    } catch {
      alert("Failed to upload image");
      setPreview(value);
    } finally {
      setUploadingState(false);
    }
  }

  function handleRemove() {
    onChange(null);
    setPreview(null);
  }

  return (
    <div className="space-y-3">
      <input
        id={id}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
      />

      {preview ? (
        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          className="cursor-pointer w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-green-500 hover:bg-green-50 transition-colors"
          style={uploading ? { pointerEvents: "none", opacity: 0.6 } : {}}
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="animate-spin text-green-600" />
              <span className="text-sm text-gray-600">Uploading...</span>
            </>
          ) : (
            <>
              <ImageIcon size={24} className="text-gray-400" />
              <span className="text-sm text-gray-600">Click to upload image</span>
              <span className="text-xs text-gray-400">or drag and drop</span>
            </>
          )}
        </label>
      )}
    </div>
  );
}
