import type { FC } from "react";

interface UploadInputProps {
  label: string;
  name: string;
  value: File | null;
  onChange: (file: File | null) => void;
  onRemoveExistingImageUrl?: () => void; // Added
  existingImageUrl?: string | null; // Added
  errors?: string[];
}

const UploadFileInput: FC<UploadInputProps> = ({
  label,
  name,
  value,
  onChange,
  onRemoveExistingImageUrl,
  existingImageUrl,
  errors,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    } else {
      onChange(null);
    }
  };

  return (
    <div className="relative mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        type="file"
        id={name}
        name={name}
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 shadow-sm"
      />
      {value && (
        <p className="mt-2 text-sm text-gray-600">
          Selected file: {value.name}
        </p>
      )}
      {existingImageUrl && !value && (
        <div className="mt-2 flex items-center text-sm text-gray-600">
          Existing:{" "}
          <a
            href={existingImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline ml-1"
          >
            View File
          </a>
          {onRemoveExistingImageUrl && (
            <button
              type="button"
              onClick={onRemoveExistingImageUrl}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              (Remove)
            </button>
          )}
        </div>
      )}
      {errors && errors.length > 0 && (
        <p className="mt-2 text-sm text-red-600">{errors[0]}</p>
      )}
    </div>
  );
};

export default UploadFileInput;