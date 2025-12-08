import { useState } from "react";
import type { ContentType } from "../../types/course";
import { courseApi } from "../../services/courseApi";

interface ModalCreateContentProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string;
  courseId: string;
  onUploaded: (contentId: string, key: string) => void;
}

interface PresignedResponse {
  contentId: string;
  preSignedUrl: string;
  key: string;
  fields: Object;
}

const detectContentType = (file: File): ContentType => {
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type.startsWith("image/")) return "image";
  return "text";
};

export default function ModalCreateContent({
  isOpen,
  onClose,
  courseId,
  lessonId,
  onUploaded,
}: ModalCreateContentProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState<string>("");
  const [contentName, setContentName] = useState<string>("");
  const [contentType, setContentType] = useState<ContentType | null>(null);

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  if (!isOpen) return null;

  // ===========================
  // STEP 1 — Request presigned URL
  // ===========================
  const requestPresignedUrl = async (): Promise<PresignedResponse> => {
    const body = {
      contentName: selectedFile?.name,
      type: detectContentType(selectedFile!),
    };

    const res = await courseApi.createLessonContent(courseId, lessonId, body);
    return res;
  };

  // ===========================
  // STEP 2 — Upload file to S3
  // ===========================
  const uploadFileToS3 = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const presigned = await requestPresignedUrl();

      const formData = new FormData();
      Object.entries(presigned.fields).forEach(([key, value]) => {
        if (key === "bucket" || key === "acl") return;
        formData.append(key, value.toString());
      });
      formData.append("file", selectedFile);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", presigned.preSignedUrl);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 204) resolve();
          else reject("Upload to S3 failed");
        };

        xhr.onerror = () => reject("Error uploading");
        xhr.send(formData);
      });

      onUploaded(presigned.contentId, presigned.key);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // ===========================
  // STEP 3 — Save text content
  // ===========================
  const uploadTextContent = async () => {
    if (!textContent.trim()) return alert("Text cannot be empty");

    try {
      setIsUploading(true);
    
      const body = {
        contentName,
        type: "text",
        text: textContent
      }
      
      await courseApi.createLessonContent(courseId, lessonId, body);

      onClose();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // ===========================
  // UI RENDERING
  // ===========================
  const renderInputField = () => {
    if (contentType === "text") {
      return (
        <>
        <textarea placeholder="Nhập tên nội dung" className="border rounded w-full p-3 mb-4" value={contentName} onChange={(e) => setContentName(e.target.value)}></textarea>
        <textarea
          className="border rounded w-full p-3 h-40 mb-4"
          placeholder="Nhập nội dung text..."
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
        />
        </>
        
      );
    }

    return (
      <input
        type="file"
        accept="video/*,audio/*,image/*,text/*"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setSelectedFile(file);
          setContentType(file ? detectContentType(file) : null);
        }}
        className="border rounded w-full p-2 mb-4"
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white p-6 w-full max-w-lg rounded shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">
          Upload Nội Dung Bài Học
        </h2>

        {/* Select type (optional) */}
        <select
          className="border p-2 rounded w-full mb-4"
          value={contentType ?? ""}
          onChange={(e) => setContentType(e.target.value as ContentType)}
        >
          <option value="">-- Chọn loại nội dung --</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
          <option value="image">Image</option>
          <option value="text">Text</option>
        </select>

        {/* Dynamic input */}
        {renderInputField()}

        {/* Progress bar */}
        {isUploading && (
          <>
            <div className="w-full bg-gray-200 rounded h-3 overflow-hidden mb-2">
              <div
                className="bg-blue-500 h-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mb-3">{uploadProgress}%</p>
          </>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            className="btn btn-primary bg-gray-400"
            onClick={onClose}
            disabled={isUploading}
          >
            Cancel
          </button>

          <button
            className={`btn btn-primary ${
              isUploading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={contentType === "text" ? uploadTextContent : uploadFileToS3}
            disabled={isUploading || (!textContent && !selectedFile)}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
