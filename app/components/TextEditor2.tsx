"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

interface TextEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  allowImage?: boolean;
  allowMap?: boolean;
  allowVideo?: boolean;
  allowLink?: boolean;
}

// Dynamic import for client-side only
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// ---------------- Iframe Blot ---------------- //
let iframeRegistered = false;

const registerIframeBlot = async () => {
  if (typeof window === "undefined" || iframeRegistered) return;

  const QuillModule = await import("react-quill-new");
  const Quill = QuillModule.Quill || QuillModule.default?.Quill || QuillModule.default || QuillModule;
  const BlockEmbed = Quill.import("blots/block/embed") as any;

  class IframeBlot extends BlockEmbed {
    static blotName = "iframe";
    static tagName = "iframe";

    static create(value: string) {
      const node = super.create() as HTMLElement;
      node.setAttribute("src", value);
      node.setAttribute("frameborder", "0");
      node.setAttribute("allowfullscreen", "");
      node.style.width = "100%";
      node.style.minHeight = "300px";
      return node;
    }

    static value(node: HTMLElement) {
      return node.getAttribute("src");
    }
  }

  try {
    Quill.register(IframeBlot as any);
    iframeRegistered = true;
  } catch {}
};

// ---------------- YouTube URL helper ---------------- //
const getYouTubeEmbedUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    let videoId = "";

    if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.slice(1); 
    } else if (
      urlObj.hostname === "www.youtube.com" ||
      urlObj.hostname === "youtube.com"
    ) {
      videoId = urlObj.searchParams.get("v") || "";
    }

    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
};

// ---------------- Component ---------------- //
export default function TextEditor({
  initialValue = "",
  onChange,
  allowImage = true,
  allowMap = true,
  allowVideo = true,
  allowLink = true,
}: TextEditorProps) {
  const quillRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState(initialValue);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"map" | "video" | "link" | null>(null);
  const [modalUrl, setModalUrl] = useState("");

  useEffect(() => {
    registerIframeBlot().then(() => setMounted(true));
  }, []);

  useEffect(() => setValue(initialValue), [initialValue]);

  // ---------------- Handlers ---------------- //
  const imageHandler = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const quill = quillRef.current?.getEditor();
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "image", reader.result);
        quill.setSelection(range.index + 1);
      };
      reader.readAsDataURL(file);
    };
  };

  const openModal = (type: "map" | "video" | "link") => {
    setModalType(type);
    setModalUrl("");
    setShowModal(true);
  };

  const insertEmbed = () => {
    if (!modalUrl) return;
    const quill = quillRef.current?.getEditor();
    const range = quill.getSelection(true);

    if (modalType === "video") {
      const embedUrl = getYouTubeEmbedUrl(modalUrl);
      if (!embedUrl) {
        alert("Invalid YouTube URL");
        return;
      }
      quill.insertEmbed(range.index, "iframe", embedUrl);
    } else if (modalType === "map") {
      quill.insertEmbed(range.index, "iframe", modalUrl);
    } else if (modalType === "link") {
      quill.insertText(range.index, modalUrl, { link: modalUrl });
    }

    quill.setSelection(range.index + 1);
    setShowModal(false);
  };

  const modules = {
    toolbar: {
      container: "#custom-toolbar",
      handlers: {
        image: imageHandler,
        map: () => openModal("map"),
        video: () => openModal("video"),
        link: () => openModal("link"),
      },
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "indent",
    "script",
    "direction",
    "align",
    "link",
    "image",
    "video",
    "color",
    "background",
    "iframe",
  ];

  const handleChange = (content: string) => {
    setValue(content);
    onChange?.(content);
  };

  if (!mounted)
    return <div className="min-h-[200px] border p-4">Loading editor...</div>;

  const QuillComponent = ReactQuill as any;

  return (
    <div className="h-[70vh] w-[80vw]">
      {/* -------- Custom Toolbar -------- */}
      <div id="custom-toolbar" className="ql-toolbar ql-snow">
        <span className="ql-formats">
          <select className="ql-font" title="Font"></select>
          <select className="ql-size" title="Size"></select>
        </span>

        <span className="ql-formats">
          <button className="ql-bold" title="Bold"></button>
          <button className="ql-italic" title="Italic"></button>
          <button className="ql-underline" title="Underline"></button>
          <button className="ql-strike" title="Strike"></button>
        </span>

        <span className="ql-formats ml-5">
          <button className="ql-list" value="ordered" title="Ordered List"></button>
          <button className="ql-list" value="bullet" title="Bullet List"></button>
          {allowLink && <button className="ql-link" title="Insert Link"></button>}
          {allowImage && <button className="ql-image" title="Insert Image"></button>}
          {allowVideo && <button className="ql-video" title="Insert Video"></button>}
          {allowMap && <button className="ql-map" title="Insert Map">🗺</button>}
        </span>

        <span className="ql-formats">
          <button className="ql-clean" title="Remove Formatting"></button>
        </span>
      </div>

      {/* -------- Editor -------- */}
      <QuillComponent
        ref={quillRef}
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="Compose an epic..."
        theme="snow"
        className="h-full"
      />

      {/* -------- Modal -------- */}
      {showModal && modalType && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 flex flex-col gap-4">
            <h3 className="text-lg font-semibold capitalize">
              {modalType === "link"
                ? "Insert Link"
                : modalType === "video"
                ? "Insert Video URL"
                : "Insert Map URL"}
            </h3>
            <input
              type="text"
              placeholder={
                modalType === "link"
                  ? "Paste link URL"
                  : modalType === "video"
                  ? "Paste YouTube video URL"
                  : "Paste Google Maps embed URL"
              }
              value={modalUrl}
              onChange={(e) => setModalUrl(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={insertEmbed}
                className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
