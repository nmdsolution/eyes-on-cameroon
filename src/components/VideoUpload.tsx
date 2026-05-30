"use client";

import { useState, useRef } from "react";
import { Loader2, X, Video as VideoIcon } from "lucide-react";

interface VideoUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
}

export default function VideoUpload({ value, onChange, folder = "videos" }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setUploading(true);
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
      alert("Failed to upload video");
      setPreview(value);
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    onChange(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 bg-gray-900">
          <video
            src={preview}
            controls
            className="w-full h-full object-contain"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 z-10"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-green-500 hover:bg-green-50 transition-colors disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="animate-spin text-green-600" />
              <span className="text-sm text-gray-600">Uploading...</span>
            </>
          ) : (
            <>
              <VideoIcon size={24} className="text-gray-400" />
              <span className="text-sm text-gray-600">Click to upload video</span>
              <span className="text-xs text-gray-400">or drag and drop</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
