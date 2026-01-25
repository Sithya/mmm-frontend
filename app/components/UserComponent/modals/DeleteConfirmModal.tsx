export default function DeleteConfirmModal({
  title,
  description,
  confirmText = "Delete",
  danger = false,
  onCancel,
  onConfirm,
}: {
  title: string;
  description?: string;
  confirmText?: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm space-y-4 shadow-lg">
        <h3 className="font-semibold text-gray-900">{title}</h3>

        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onCancel}>Cancel</button>

          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-white ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-800"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
