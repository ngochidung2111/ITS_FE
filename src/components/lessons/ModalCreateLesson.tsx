import { useState } from "react";
import type { CreateLessonData, Content } from "../../types/course";

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

  const [contents, setContents] = useState<Content[]>([
    { order: 1, contentName: "", type: "text", text: "" },
  ]);

  // Add content
  const addContent = () => {
    setContents((prev) => [
      ...prev,
      {
        order: prev.length + 1,
        contentName: "",
        type: "text",
        text: "",
      },
    ]);
  };

  // Delete content
  const removeContent = (index: number) => {
    setContents((prev) => prev.filter((_, i) => i !== index));
  };

  // Update single content
  const updateContent = (
    index: number,
    field: keyof Content,
    value: Content[keyof Content]
  ) => {
    setContents((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSubmit = () => {
    const data: CreateLessonData = {
      lessonName,
      contents,
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

        {/* CONTENTS */}
        <h3 className="font-semibold mb-3 text-lg">Contents</h3>

        <div className="space-y-4">
          {contents.map((c, i) => (
            <div
              key={i}
              className="relative border rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
            >
              {/* Delete Button */}
              <button
                onClick={() => removeContent(i)}
                className="absolute top-0 right-1 cursor-pointer font-semibold"
              >
                X
              </button>

              {/*Name + Type */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <input
                  className="col-span-9 border p-2 rounded"
                  placeholder="Content name"
                  value={c.contentName}
                  onChange={(e) =>
                    updateContent(i, "contentName", e.target.value)
                  }
                />

                <select
                  className="col-span-3 border p-2 rounded"
                  value={c.type}
                  onChange={(e) =>
                    updateContent(i, "type", e.target.value as Content["type"])
                  }
                >
                  <option value="text">TEXT</option>
                  <option value="video">VIDEO</option>
                  <option value="image">IMAGE</option>
                </select>
              </div>

              {/* Text editor only for TEXT */}
              {c.type === "text" && (
                <textarea
                  placeholder="Enter text content..."
                  className="border w-full p-2 rounded mt-3"
                  value={c.text}
                  onChange={(e) => updateContent(i, "text", e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        {/* Add Content */}
        <button
          onClick={addContent}
          className="mt-3 w-full bg-gray-200 p-2 rounded hover:bg-gray-300 font-medium cursor-pointer"
        >
          + Add Content
        </button>

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
