import { apiClient } from "@/lib/api";
import { RegistrationType } from "@/types";
import { useState } from "react";
import countries from "world-countries";

const countryOptions = countries.map((c) => c.name.common);
  
type FormData = {
    first_name: string;
    last_name: string;
    email: string;
    affiliation: string;
    country: string;
    dietary_restrictions: string;
    agreed_to_terms: boolean;
  };
  
export default function RegistrationForm({
    registration_type,
}: {
    registration_type: RegistrationType;
}) {
const [form, setForm] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    affiliation: "",
    country: "",
    dietary_restrictions: "",
    agreed_to_terms: false,
});

const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
    !form.first_name ||
    !form.last_name ||
    !form.email ||
    !form.country ||
    !form.agreed_to_terms
    ) {
    alert("Please fill all required fields.");
    return;
    }

    const payload = {registration_type, ...form};

    await apiClient.post("/registrations", payload);

    alert("Registration submitted!");
};

return (
    <form
    onSubmit={submit}
    className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow"
    >
    <h3 className="font-medium mb-4">Your Information</h3>

    {/* First / Last name */}
    <div className="grid grid-cols-2 gap-4">
        <input
        required
        placeholder="First Name *"
        className="input"
        value={form.first_name}
        onChange={(e) =>
            setForm({ ...form, first_name: e.target.value })
        }
        />
        <input
        required
        placeholder="Last Name *"
        className="input"
        value={form.last_name}
        onChange={(e) =>
            setForm({ ...form, last_name: e.target.value })
        }
        />
    </div>

    {/* Email */}
    <input
        required
        type="email"
        placeholder="Email Address *"
        className="input mt-3"
        value={form.email}
        onChange={(e) =>
        setForm({ ...form, email: e.target.value })
        }
    />

    {/* Affiliation */}
    <input
        placeholder="Affiliation (University/Company)"
        className="input mt-3"
        value={form.affiliation}
        onChange={(e) =>
        setForm({ ...form, affiliation: e.target.value })
        }
    />

    {/* Country */}
    <select
        required
        className="input mt-3"
        value={form.country}
        onChange={(e) =>
        setForm({ ...form, country: e.target.value })
        }
    >
        <option value="">Select a country *</option>
        {countryOptions.map((c) => (
        <option key={c}>{c}</option>
        ))}
    </select>

    {/* Dietary */}
    <textarea
        placeholder="Dietary restrictions (optional)"
        className="input mt-3"
        value={form.dietary_restrictions}
        onChange={(e) =>
        setForm({ ...form, dietary_restrictions: e.target.value })
        }
    />

    {/* Terms */}
    <label className="flex items-center gap-2 mt-4 text-sm">
        <input
        type="checkbox"
        checked={form.agreed_to_terms}
        onChange={(e) =>
            setForm({ ...form, agreed_to_terms: e.target.checked })
        }
        />
        I agree to the terms and conditions *
    </label>

    <button
        type="submit"
        className="mt-5 w-full bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-out
              hover:bg-purple-800 hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
    >
        Complete Registration
    </button>
    </form>
);
}
  