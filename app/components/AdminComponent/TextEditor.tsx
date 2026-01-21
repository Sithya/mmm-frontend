"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

interface TextEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  allowImage?: boolean;
  allowMap?: boolean;
}

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// Iframe Blot //
let iframeRegistered = false;

const registerIframeBlot = async () => {
  if (typeof window === "undefined" || iframeRegistered) return;

  try {
    // Import Quill - try quill package first, then react-quill-new
    let Quill: any;
    try {
      const QuillModule = await import("quill");
      Quill = QuillModule.default || QuillModule;
    } catch {
      // Fallback to react-quill-new if quill package not available
      const ReactQuillModule = await import("react-quill-new");
      Quill =
        ReactQuillModule.Quill ||
        ReactQuillModule.default?.Quill ||
        // ReactQuillModule.default?.reactQuill?.Quill ||
        ReactQuillModule.default;
    }

    if (!Quill || typeof Quill.import !== "function") {
      console.error("Quill not properly loaded");
      return;
    }

    const Embed = Quill.import("blots/embed") as any;
    const BlockEmbed = Quill.import("blots/block/embed") as any;

    class ImageBlot extends Embed {
      static blotName = "image";
      static tagName = "img";

      static create(value: string) {
        const node = super.create() as HTMLImageElement;
        node.src = value;
        node.style.width = "100%";
        node.style.height = "auto";
        node.style.maxWidth = "100%";
        node.style.borderRadius = "6px";
        node.style.margin = "4px 0";
        return node;
      }

      static value(node: HTMLElement) {
        return node.getAttribute("src");
      }
    }

    class IframeBlot extends BlockEmbed {
      static blotName = "iframe";
      static tagName = "iframe";

      static create(value: string) {
        const node = super.create() as HTMLElement;
        node.setAttribute("src", value);
        node.setAttribute("frameborder", "0");
        node.setAttribute("allowfullscreen", "");
        node.style.width = "100%";
        node.style.minHeight = "450px";
        return node;
      }

      static value(node: HTMLElement) {
        return node.getAttribute("src");
      }
    }
    class VideoBlot extends BlockEmbed {
      static blotName = "video";
      static tagName = "iframe";

      static create(value: string) {
        const node = super.create() as HTMLElement;
        node.setAttribute("src", value);
        node.setAttribute("frameborder", "0");
        node.setAttribute("allowfullscreen", "");
        node.style.width = "100%";
        node.style.minHeight = "200px"; // smaller minHeight for mobile
        node.style.maxHeight = "500px"; // optional maxHeight
        node.style.borderRadius = "10px";
        node.classList.add("responsive-iframe"); // class for CSS
        return node;
      }
    }


    class DividerBlot extends BlockEmbed {
      static blotName = "divider";
      static tagName = "hr";
    }

    Quill.register(IframeBlot as any);
    Quill.register(VideoBlot as any);
    Quill.register(ImageBlot as any);
    Quill.register(DividerBlot as any);
    iframeRegistered = true;
  } catch (error) {
    console.error("Error registering Quill blots:", error);
  }
};

const registerFontSizes = async () => { };


// Component //
function TextEditor({
  initialValue = "",
  onChange,
  allowImage = true,
  allowMap = true,
}: TextEditorProps) {
  const quillRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState(initialValue);

  // popup states
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState<"link" | "video" | "map" | null>(
    null
  );
  const [popupValue, setPopupValue] = useState("");
  const [popupDisplay, setPopupDisplay] = useState("");

  useEffect(() => {
    registerIframeBlot().then(() => setMounted(true));
  }, []);

  //   useEffect(() => {
  //   Promise.all([
  //     registerIframeBlot(),
  //     registerFontSizes(),
  //   ]).then(() => setMounted(true));
  // }, []);

  useEffect(() => setValue(initialValue), [initialValue]);

  // Toolbar Options //
  const toolbarOptions: any[] = [
    [{ font: [] }, { size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ header: "1" }, { header: "2" }, { header: "3" }, { header: "4" }, "blockquote", "code-block"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    [{ direction: "rtl" }, { align: [] }],
    ["link", "video"],
    ["divider"],
    ["clean"],
  ];

  if (allowImage) toolbarOptions[toolbarOptions.length - 3].push("image");
  if (allowMap) toolbarOptions[toolbarOptions.length - 3].push({ map: "Map" });

  // Handlers //
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

  // const dividerHandler =() =>{
  //   divider: function () {
  //       const range = this.quill.getSelection(true);
  //       this.quill.insertEmbed(range.index, "divider", true);
  //       this.quill.setSelection(range.index + 1);
  //     }
  // }

  // Popup Handler //
  const openPopup = (type: "link" | "video" | "map") => {
    setPopupType(type);
    setPopupValue("");
    setPopupDisplay("");
    setPopupOpen(true);
  };

  const insertPopupValue = () => {
    if (!popupValue.trim()) {
      setPopupOpen(false);
      return;
    }

    const quill = quillRef.current?.getEditor();
    const range = quill.getSelection(true);

    if (popupType === "link") {
      const url = popupValue.trim();
      const display = popupDisplay.trim() || popupValue.trim();

      if (!url) {
        setPopupOpen(false);
        return;
      }

      if (range.length === 0) {
        // No selected text, insert display text with link
        quill.insertText(range.index, display, "link", url);
        quill.setSelection(range.index + display.length);
      } else {
        // There is selected text, replace it with display text + link
        quill.deleteText(range.index, range.length);
        quill.insertText(range.index, display, "link", url);
        quill.setSelection(range.index + display.length);
      }

      setPopupOpen(false);
      return;
    } else if (popupType === "video") {
      let videoUrl = popupValue.trim();

      // Convert normal YouTube link to embed URL
      const ytShort = videoUrl.match(/youtu\.be\/([^?]+)/);
      const ytLong = videoUrl.match(/youtube\.com\/watch\?v=([^&]+)/);

      if (ytShort) {
        videoUrl = `https://www.youtube.com/embed/${ytShort[1]}`;
      } else if (ytLong) {
        videoUrl = `https://www.youtube.com/embed/${ytLong[1]}`;
      }

      quill.insertEmbed(range.index, "video", videoUrl);
      quill.setSelection(range.index + 1);
    } else if (popupType === "map") {
      quill.insertEmbed(range.index, "iframe", popupValue);
      quill.setSelection(range.index + 1);
    }

    setPopupOpen(false);
  };

  const modules = {
    toolbar: {
      container: toolbarOptions,
      handlers: {
        image: imageHandler,
        link: () => openPopup("link"),
        video: () => openPopup("video"),
        map: () => openPopup("map"),
        divider: () => {
          const quill = quillRef.current?.getEditor();
          if (!quill) return;
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "divider", true);
          quill.setSelection(range.index + 1);
        },
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
    "divider",
    "color",
    "background",
    "iframe",
  ];

  const handleChange = (content: string) => {
    setValue(content);
    onChange?.(content);
  };

  // Add Tooltips - Currently not wroking//
  useEffect(() => {
    if (!mounted) return;

    const toolbar = document.querySelector(".ql-toolbar");
    if (!toolbar) return;

    const titles: Record<string, string> = {
      bold: "Bold",
      italic: "Italic",
      underline: "Underline",
      strike: "Strike",
      link: "Insert Link",
      video: "Insert Video",
      image: "Insert Image",
      map: "Insert Map",
      clean: "Remove Formatting",
      list: "Ordered List",
      bullet: "Bullet List",
    };

    Object.entries(titles).forEach(([cls, title]) => {
      const btn = toolbar.querySelector(`.ql-${cls}`) as HTMLElement;
      if (btn) btn.setAttribute("title", title);
    });
  }, [mounted]);

  if (!mounted)
    return (
      <div className="min-h-[200px] border p-4 rounded-sm">
        Loading editor...
      </div>
    );

  const QuillComponent = ReactQuill as any;

  return (
    <div
      className="relative w-full max-w-5xl mx-auto"
      style={{ height: "40vh", borderRadius: "10px" }}
    >
      {/* Popup Modal */}
      {popupOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[2000]">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm sm:max-w-md animate-scaleIn">
            <h2 className="text-lg font-semibold mb-4 capitalize">
              Insert {popupType}
            </h2>

            <input
              type="text"
              value={popupValue}
              onChange={(e) => setPopupValue(e.target.value)}
              placeholder={
                popupType === "map"
                  ? "Google Maps embed URL"
                  : popupType === "video"
                    ? "YouTube/Vimeo video URL"
                    : "https://example.com"
              }
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring focus:ring-purple-300 outline-none"
            />
            {popupType === "link" && (
              <input
                type="text"
                value={popupDisplay}
                onChange={(e) => setPopupDisplay(e.target.value)}
                placeholder="Display text (optional)"
                className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring focus:ring-purple-300 outline-none"
              />
            )}

            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={() => setPopupOpen(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={insertPopupValue}
                className="px-4 py-2 rounded-lg bg-purple-800 text-white hover:bg-purple-900"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      {/* <QuillComponent
        ref={quillRef}
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="write Something..."
        theme="snow"
        style={{ height: "100%" }}
      /> */}

      <div className="relative w-full max-w-6xl px-4 sm:px-6">
        <QuillComponent
          ref={quillRef}
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder="Write something..."
          theme="snow"
          className="h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[75vh] rounded-lg overflow-auto"
        />
      </div>

    </div>
  );
}

export default TextEditor;
