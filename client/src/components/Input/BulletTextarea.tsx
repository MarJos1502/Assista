import { type FC, type ChangeEvent } from "react";

interface BulletTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  errors?: string[];
}

const BulletTextarea: FC<BulletTextareaProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = "Enter text with bullet points...",
  rows = 4,
  errors = [],
}) => {
  const handleAddBullet = () => {
    const currentValue = value || "";
    const newValue = currentValue + (currentValue ? "\n• " : "• ");
    onChange(newValue);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    let newValue = e.target.value;

    // Auto-format bullet points
    if (newValue.includes("\n") && !newValue.endsWith("\n")) {
      const lines = newValue.split("\n");
      const lastLine = lines[lines.length - 1];

      if (lastLine && !lastLine.startsWith("•") && lastLine.trim()) {
        lines[lines.length - 1] = "• " + lastLine.trim();
        newValue = lines.join("\n");
      }
    }

    onChange(newValue);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.length > 0 ? "border-red-500" : "border-gray-300"
          }`}
        />
        <button
          type="button"
          onClick={handleAddBullet}
          className="absolute top-2 right-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          title="Add bullet point"
        >
          • Bullet
        </button>
      </div>
      {errors.length > 0 && (
        <div className="mt-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      )}
      <div className="mt-2 text-xs text-gray-500">
        Tip: Start each line with "•" for bullet points
      </div>
    </div>
  );
};

export default BulletTextarea;
