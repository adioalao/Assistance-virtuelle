// 📁 /components/FileUploader.tsx
"use client";

import React, { useRef } from "react";
import {  Plus  } from 'lucide-react';

interface FileUploaderProps {
  onFileUpload: (fileUrl: string, fileType: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    onFileUpload(url, file.type);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={triggerFileInput}
        className="  bg-gray-500 hover:bg-gray-300 px-1 py-1 rounded-full"
      >
       < Plus size={18}  />
      </button>
    </div>
  );
};

export default FileUploader;
