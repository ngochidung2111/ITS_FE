interface EditData {
    title: string;
    description: string;
    price: string;
}

interface ModalEditCourseProps {
  editData: EditData;
  setEditData: (editData: EditData) => void;
  setIsEditOpen: (open: boolean) => void;
  handleUpdateCourse: () => void;
}

const ModalEditCourse = ({
  editData,
  setEditData,
  setIsEditOpen,
  handleUpdateCourse
}: ModalEditCourseProps) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Course</h2>

        {/* TITLE */}
        <label className="block mb-3">
          <span className="text-gray-700 dark:text-gray-300">Title</span>
          <input
            type="text"
            className="input w-full mt-1"
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
          />
        </label>

        {/* DESCRIPTION */}
        <label className="block mb-3">
          <span className="text-gray-700 dark:text-gray-300">Description</span>
          <textarea
            className="input w-full mt-1"
            rows={3}
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
          />
        </label>

        {/* PRICE */}
        <label className="block mb-3">
          <span className="text-gray-700 dark:text-gray-300">Price</span>
          <input
            type="number"
            className="input w-full mt-1"
            value={editData.price}
            onChange={(e) =>
              setEditData({ ...editData, price: e.target.value })
            }
          />
        </label>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setIsEditOpen(false)}
            className="btn btn-secondary"
          >
            Cancel
          </button>

          <button onClick={handleUpdateCourse} className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditCourse;
