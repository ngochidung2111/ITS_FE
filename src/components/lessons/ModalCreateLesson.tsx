import { useState } from "react";
import type { CreateLessonData} from "../../types/course";

interface CreateLessonProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLessonData) => void;
}

export default function ModalCreateLesson({
  isOpen,
  onClose,
  onSubmit,
}: CreateLessonProps) {
  const [lessonName, setLessonName] = useState("");

  // const [contents, setContents] = useState<Content[]>([
  //   { order: 1, contentName: "", type: "text", text: "" },
  // ]);

  // Add content
  // const addContent = () => {
  //   setContents((prev) => [
  //     ...prev,
  //     {
  //       order: prev.length + 1,
  //       contentName: "",
  //       type: "text",
  //       text: "",
  //     },
  //   ]);
  // };

  // // Delete content
  // const removeContent = (index: number) => {
  //   setContents((prev) => prev.filter((_, i) => i !== index));
  // };

  // // Update single content
  // const updateContent = (
  //   index: number,
  //   field: keyof Content,
  //   value: Content[keyof Content]
  // ) => {
  //   setContents((prev) => {
  //     const next = [...prev];
  //     next[index] = { ...next[index], [field]: value };
  //     return next;
  //   });
  // };

  const handleSubmit = () => {
    const data: CreateLessonData = {
      lessonName,
      contents: []
    };
    onSubmit(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl shadow-xl">
        <h2 className="text-xl font-bold mb-4">Create Lesson</h2>

        {/* Lesson Name */}
        <div className="mb-4">
          <label className="font-medium">Lesson Name</label>
          <input
            className="w-full border p-2 rounded mt-1"
            placeholder="Introduction to Modules"
            value={lessonName}
            onChange={(e) => setLessonName(e.target.value)}
          />
        </div>

  
        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button className="btn bg-gray-300" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
