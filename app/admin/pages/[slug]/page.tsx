"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TextEditor from "@/app/components/AdminComponent/TextEditor";

interface PageSection {
  id: string;
  type: "text" | "news" | "keynotes" | "important-dates";
  data: any;
}

interface Page {
  id: number;
  slug: string;
  title: string;
  component: string;
  json: { sections: PageSection[] };
}

// Build API base robustly: prefer NEXT_PUBLIC_API_BASE_URL, fall back to localhost.
let API_URL_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1";

// If running in the browser and the base uses a Docker internal host, rewrite it
// so the browser can reach the backend during local development.
if (typeof window !== "undefined") {
  try {
    const parsed = new URL(API_URL_BASE);
    if (parsed.hostname === "backend-nginx") {
      parsed.hostname = "localhost";
      parsed.port = "8000";
      API_URL_BASE = parsed.toString().replace(/\/$/, "");
    }
  } catch (e) {
    // ignore malformed env value and keep fallback
  }
}

const API_URL = `${API_URL_BASE.replace(/\/$/, "")}/pages`;

export default function AdminPageEditor() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  const [page, setPage] = useState<Page | null>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchPage = async () => {
      try {
        const res = await fetch(`${API_URL}/slug/${slug}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Failed to fetch page:", errorText);
          throw new Error("Failed to fetch page");
        }
        const response = await res.json();
        // Handle both old format (direct page object) and new format ({success, data, message})
        const pageData: Page = response.data || response;

        // initialize sections if empty
        if (!pageData.json?.sections || pageData.json.sections.length === 0) {
          pageData.json = {
            sections: [{ id: `text-1`, type: "text", data: { html: "" } }],
          };
        }

        setPage(pageData);
      } catch (err) {
        console.error("Error fetching page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  const handleSectionChange = (index: number, html: string) => {
    if (!page) return;
    const updatedSections = [...page.json.sections];
    updatedSections[index] = { ...updatedSections[index], data: { html } };
    setPage({ ...page, json: { sections: updatedSections } });
  };

  const addTextSection = () => {
    if (!page) return;
    const newSection: PageSection = {
      id: `text-${page.json.sections.length + 1}`,
      type: "text",
      data: { html: "" },
    };
    setPage({
      ...page,
      json: { sections: [...page.json.sections, newSection] },
    });
  };

  const addImportantDatesSection = () => {
    if (!page) return;
    const newSection: PageSection = {
      id: `important-dates-${Date.now()}`,
      type: "important-dates",
      data: {},
    };
    setPage({
      ...page,
      json: { sections: [...page.json.sections, newSection] },
    });
  };

  const handleSubmit = async () => {
    if (!page) return;
    setSaving(true);

    try {
      const url = page.id ? `${API_URL}/${page.id}` : API_URL;
      const method = page.id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: page.slug,
          title: page.title,
          component: page.component,
          json: page.json,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Save failed:", errorText);
        throw new Error("Failed to save");
      }

      // Handle response format (could be wrapped in {success, data, message})
      const response = await res.json();
      const savedPage = response.data || response;

      router.push(`/${slug}`);
    } catch (err) {
      console.error("Error saving page:", err);
      alert("Failed to save content. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!page) return <p className="p-6 text-center">Page not found</p>;

  return (
    <div className="max-h-screen bg-gray-50 p-6 mt-20">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col h-[87vh]">
        <h1 className="text-3xl font-bold text-purple-900 mb-4">Edit {slug}</h1>

        {/* Tabs */}
        <div className="flex border-b border-purple-300 mb-4">
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-4 py-2 font-semibold text-lg ${
              activeTab === "edit"
                ? "border-b-4 border-purple-700 text-purple-900"
                : "border-b-4 border-transparent text-purple-700"
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`ml-4 px-4 py-2 font-semibold text-lg ${
              activeTab === "preview"
                ? "border-b-4 border-purple-700 text-purple-900"
                : "border-b-4 border-transparent text-purple-700"
            }`}
          >
            Preview
          </button>
        </div>

        {/* Editor / Preview */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {page.json.sections.map((section, index) => (
            <div key={section.id} className="w-full">
              {activeTab === "edit" ? (
                section.type === "important-dates" ? (
                  <div className="border border-purple-200 rounded-xl p-4 mb-6">
                    <p className="font-semibold mb-4">
                      Important Dates Section
                    </p>
                    <p className="text-gray-600 text-sm">
                      This section will display all important dates. No
                      configuration needed.
                    </p>
                  </div>
                ) : (
                  <div className="border border-purple-200 rounded-xl p-4 mb-6">
                    <p className="font-semibold mb-4">
                      Text Section {index + 1}
                    </p>
                    <div className="h-[57vh] overflow-y-auto">
                      <TextEditor
                        initialValue={section.data.html}
                        onChange={(html) => handleSectionChange(index, html)}
                        allowMap
                        allowImage
                      />
                    </div>
                  </div>
                )
              ) : section.type === "important-dates" ? (
                <div className="my-6 bg-gray-50 border border-purple-200 rounded-xl p-6">
                  <p className="text-gray-600 italic">
                    Important Dates will be displayed here
                  </p>
                </div>
              ) : (
                <div className="ql-snow max-w-5xl my-6 bg-gray-50 border border-purple-200 rounded-xl p-6">
                  <div
                    className="ql-editor"
                    dangerouslySetInnerHTML={{ __html: section.data.html }}
                  />
                </div>
              )}
            </div>
          ))}

          {activeTab === "edit" && (
            <div className="flex justify-center gap-4">
              <button
                onClick={addTextSection}
                className="px-6 py-2 my-4
              font-medium rounded-lg
              border-2 border-purple-300
              bg-white text-purple-950
              transition-all duration-300 ease-out
              hover:bg-purple-700 hover:text-white
              hover:-translate-y-3
              active:translate-y-0
              disabled:opacity-70
              disabled:cursor-not-allowed"
              >
                + Add Text Section
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-purple-200">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 rounded-lg bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2 rounded-lg bg-purple-700 text-white"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
