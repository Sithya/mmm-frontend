"use client";

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
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

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export interface TextEditorHandle {
  getContent: () => string;
  setContent: (html: string) => void;
}

export default forwardRef<TextEditorHandle, TextEditorProps>(function TextEditor(
  {
    initialValue = "",
    onChange,
    allowImage = true,
    allowMap = true,
    allowVideo = true,
    allowLink = true,
  },
  ref
) {
  const quillRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState(initialValue);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"map" | "video" | "link" | null>(null);
  const [modalUrl, setModalUrl] = useState("");

  // ---------------- Client-side Quill Setup ---------------- //
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initQuill = async () => {
      const QuillModule = await import("react-quill-new");
      const Quill = QuillModule.Quill || QuillModule.default?.Quill || QuillModule.default || QuillModule;

      (window as any).Quill = Quill;
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

      Quill.register(IframeBlot as any);
      setMounted(true);
    };

    initQuill();
  }, []);

  useEffect(() => setValue(initialValue), [initialValue]);

  // ---------------- Image Handler ---------------- //
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

        // Add Tailwind classes
        const editor = quill.root;
        const imgs = editor.querySelectorAll("img");
        const img = imgs[imgs.length - 1]; // last inserted
        if (img) {
          img.classList.add("max-w-full", "h-auto", "hover:cursor-pointer", "transition-all", "duration-200");
        }
      };
      reader.readAsDataURL(file);
    };
  };

  // ---------------- Image Selection ---------------- //
  useEffect(() => {
    const editor = quillRef.current?.getEditor()?.root;
    if (!editor) return;

    const handleClick = (e: MouseEvent) => {
      const imgs = editor.querySelectorAll("img");
      imgs.forEach(img => img.classList.remove("ql-selected"));
      if ((e.target as HTMLElement).tagName === "IMG") {
        (e.target as HTMLElement).classList.add("ql-selected");
      }
    };

    editor.addEventListener("click", handleClick);
    return () => editor.removeEventListener("click", handleClick);
  }, [mounted]);

  const resizeImage = (size: "small" | "medium" | "large") => {
    const editor = quillRef.current?.getEditor()?.root;
    if (!editor) return;
    const img = editor.querySelector("img.ql-selected") as HTMLImageElement;
    if (!img) return;

    img.classList.remove("w-1/4", "w-1/2", "w-full");
    if (size === "small") img.classList.add("w-1/4");
    else if (size === "medium") img.classList.add("w-1/2");
    else img.classList.add("w-full");
  };

  // ---------------- Modals ---------------- //
  const openModal = (type: "map" | "video" | "link") => {
    setModalType(type);
    setModalUrl("");
    setShowModal(true);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const u = new URL(url);
      let videoId = "";
      if (u.hostname === "youtu.be") videoId = u.pathname.slice(1);
      else if (u.hostname.includes("youtube.com")) videoId = u.searchParams.get("v") || "";
      if (!videoId) return null;
      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return null;
    }
  };

  const insertEmbed = () => {
    if (!modalUrl) return;
    const quill = quillRef.current?.getEditor();
    const range = quill.getSelection(true);
    if (!quill) return;

    if (modalType === "video") {
      const embedUrl = getYouTubeEmbedUrl(modalUrl);
      if (!embedUrl) return alert("Invalid YouTube URL");
      quill.insertEmbed(range.index, "iframe", embedUrl);
    } else if (modalType === "map") {
      quill.insertEmbed(range.index, "iframe", modalUrl);
    } else if (modalType === "link") {
      quill.insertText(range.index, modalUrl, { link: modalUrl });
    }

    quill.setSelection(range.index + 1);
    setShowModal(false);
  };

  // ---------------- Toolbar & Modules ---------------- //
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

  // Expose getContent / setContent
  useImperativeHandle(ref, () => ({
    getContent: () => quillRef.current?.getEditor()?.root?.innerHTML || "",
    setContent: (html: string) => {
      const quill = quillRef.current?.getEditor();
      if (!quill) return;
      quill.root.innerHTML = html;
      setValue(html);
    },
  }));

  if (!mounted) return <div className="min-h-[200px] border p-4">Loading editor...</div>;

  const QuillComponent = ReactQuill as any;

  return (
    <div className="h-[70vh] w-[80vw]">
      {/* Toolbar */}
      <div id="custom-toolbar" className="ql-toolbar ql-snow flex flex-wrap gap-2">
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
        <span className="ql-formats">
          <select className="ql-color" title="Text Color"></select>
          <select className="ql-background" title="Background Color"></select>
        </span>
        <span className="ql-formats">
          <button className="ql-header" value="1"></button>
          <button className="ql-header" value="2"></button>
          <button className="ql-blockquote"></button>
          <button className="ql-code-block"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered"></button>
          <button className="ql-list" value="bullet"></button>
          <button className="ql-indent" value="-1"></button>
          <button className="ql-indent" value="+1"></button>
        </span>
        <span className="ql-formats">
          {allowLink && <button className="ql-link" title="Insert Link"></button>}
          {allowImage && <button className="ql-image" title="Insert Image"></button>}
          {allowVideo && <button className="ql-video" title="Insert Video"></button>}
          {allowMap && <button className="ql-map -mt-1" title="Insert Map">🗺</button>}
          {allowImage && (
            <>
              <button onClick={() => resizeImage("small")} className="mr-5 px-2 py-1 text-sm -mt-0.5 bg-gray-200 rounded hover:bg-gray-300">
                Small
              </button>
              <button onClick={() => resizeImage("medium")} className=" mr-3 px-2 py-1 text-sm -mt-0.5 bg-gray-200 rounded hover:bg-gray-300">
                Medium
              </button>
              <button onClick={() => resizeImage("large")} className=" ml-4 px-2 py-1 text-sm -mt-0.5 bg-gray-200 rounded hover:bg-gray-300">
                Large
              </button>
            </>
          )}
        </span>
        <span className="ql-formats">
          <button className="ql-clean" title="Remove Formatting"></button>
        </span>
      </div>

      {/* Editor */}
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

      {/* Modal */}
      {showModal && modalType && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 flex flex-col gap-4">
            <h3 className="text-lg font-semibold capitalize">
              {modalType === "link" ? "Insert Link" : modalType === "video" ? "Insert Video URL" : "Insert Map URL"}
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
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
                Cancel
              </button>
              <button onClick={insertEmbed} className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700">
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
