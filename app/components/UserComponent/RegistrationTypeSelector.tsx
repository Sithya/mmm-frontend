import { RegistrationType } from "@/types";

type Option = {
    id: RegistrationType;
    label: string;
    price: string;
    description: string;
  };
  
  const OPTIONS: Option[] = [
    {
      id: "student",
      label: "Student",
      price: "€50",
      description: "For full-time students",
    },
    {
      id: "standard",
      label: "Standard",
      price: "€150",
      description: "For professionals and academics",
    },
    {
      id: "early_bird",
      label: "Early Bird",
      price: "€120",
      description: "Limited time offer - 30% off",
    },
  ];
  
  export default function RegistrationTypeSelector({
    value,
    onChange,
  }: {
    value: RegistrationType;
    onChange: (v: RegistrationType) => void;
  }) {
    return (
      <div className="max-w-4xl mx-auto my-10">
        <h2 className="text-center font-medium mb-6 text-2xl">
          Registration Types
        </h2>
  
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {OPTIONS.map((opt) => {
            const checked = value === opt.id;
  
            return (
              <label
                key={opt.id}
                className={`border rounded-lg p-4 cursor-pointer transition bg-white
                  ${
                    checked
                      ? "border-purple-600 ring-2 ring-purple-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <input
                  type="radio"
                  name="registrationType"
                  className="hidden"
                  checked={checked}
                  onChange={() => onChange(opt.id)}
                />
  
                <div className="text-sm font-medium">
                  {opt.label}
                </div>
                <div className="text-purple-700 font-semibold">
                  {opt.price}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {opt.description}
                </div>
              </label>
            );
          })}
        </div>
      </div>
    );
  }
  