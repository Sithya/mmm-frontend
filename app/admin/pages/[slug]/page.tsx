"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TextEditor from "@/app/components/AdminComponent/TextEditor";
import { useAuth } from "@/app/components/AuthProvider";

interface PageSection {
  id: string;
  type: "text" | "news" | "keynotes";
  data: any;
}

interface Page {
  id: number;
  slug: string;
  title: string;
  component: string;
  json: { sections: PageSection[] };
}

let API_URL_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1";

if (typeof window !== "undefined") {
  try {
    const parsed = new URL(API_URL_BASE);
    if (parsed.hostname === "backend-nginx") {
      parsed.hostname = "localhost";
      parsed.port = "8000";
      API_URL_BASE = parsed.toString().replace(/\/$/, "");
    }
  } catch (e) {}
}

const API_URL = `${API_URL_BASE.replace(/\/$/, "")}/pages`;

export default function AdminPageEditor() {
  const { user } = useAuth();
  const isAdmin = user?.is_admin === true;

  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  const [page, setPage] = useState<Page | null>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user === null) return;
    if (!isAdmin) router.replace("/");
  }, [user, isAdmin, router]);

  useEffect(() => {
    if (!slug) return;

    const fetchPage = async () => {
      try {
        const res = await fetch(`${API_URL}/slug/${slug}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch page");

        const response = await res.json();
        const pageData: Page = response.data || response;

        if (!pageData.json?.sections || pageData.json.sections.length === 0) {
          pageData.json = {
            sections: [{ id: "text-1", type: "text", data: { html: "" } }],
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
    updatedSections[index] = {
      ...updatedSections[index],
      data: { html },
    };
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

  const handleSubmit = async () => {
    if (!page) return;
    setSaving(true);

    try {
      const url = page.id ? `${API_URL}/${page.id}` : API_URL;
      const method = page.id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: page.slug,
          title: page.title,
          component: page.component,
          json: page.json,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

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
        <h1 className="text-3xl font-bold text-purple-900 mb-4">
          Edit {slug}
        </h1>

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
            <div key={section.id}>
              {activeTab === "edit" ? (
                <div className="border border-purple-200 rounded-xl p-4 mb-6">
                  <p className="font-semibold mb-4">
                    Text Section {index + 1}
                  </p>
                  <TextEditor
                    initialValue={section.data.html}
                    onChange={(html) =>
                      handleSectionChange(index, html)
                    }
                    allowMap
                    allowImage
                  />
                </div>
              ) : (
                <div className="ql-snow bg-gray-50 border border-purple-200 rounded-xl p-6">
                  <div
                    className="ql-editor"
                    dangerouslySetInnerHTML={{
                      __html: section.data.html,
                    }}
                  />
                </div>
              )}
            </div>
          ))}

          {activeTab === "edit" && (
            <button
              onClick={addTextSection}
              className="w-full px-6 py-2 my-4 font-medium rounded-lg border-2 border-purple-300 bg-white text-purple-950 hover:bg-purple-700 hover:text-white"
            >
              + Add Text Section
            </button>
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
  