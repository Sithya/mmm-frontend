// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { KeynoteCard } from "@/components/KeynoteCard";

// interface KeynoteType {
//   id: number;
//   name: string;
//   title?: string;
//   content?: string;
//   photo_url?: string;
// }

// interface ContentRendererProps {
//   html: string;
//   keynotes?: KeynoteType[];
//   apiBase?: string;
// }

// export const ContentRenderer: React.FC<ContentRendererProps> = ({
//   html,
//   keynotes = [],
//   apiBase = "http://localhost:8000/api",
// }) => {
//   const [keynoteMap, setKeynoteMap] = useState<Record<number, KeynoteType>>({});

//   useEffect(() => {
//     // Build initial map from provided keynotes
//     const map: Record<number, KeynoteType> = {};
//     keynotes.forEach((k) => k.id && (map[k.id] = k));
//     setKeynoteMap(map);

//     // Parse HTML and fetch missing keynotes
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(html, "text/html");
//     const missingIds: number[] = [];

//     doc.querySelectorAll("div[data-type=keynote]").forEach((el) => {
//       const id = parseInt(el.getAttribute("data-id")  "");
//       if (!isNaN(id) && !map[id]) missingIds.push(id);
//     });

//     if (missingIds.length) {
//       axios
//         .get(`${apiBase}/keynotes?ids=${missingIds.join(",")}`)
//         .then((res) => {
//           const fetched: Record<number, KeynoteType> = {};
//           res.data.forEach((k: KeynoteType) => (fetched[k.id] = k));
//           setKeynoteMap((prev) => ({ ...prev, ...fetched }));
//         })
//         .catch(console.error);
//     }
//   }, [html, keynotes, apiBase]);

//   const renderContent = () => {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(html, "text/html");

//     return Array.from(doc.body.childNodes).map((node, idx) => {
//       if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).dataset.type === "keynote") {
//         const id = parseInt((node as HTMLElement).dataset.id  "");
//         const keynote = keynoteMap[id];
//         return keynote ? <KeynoteCard key={id} {...keynote} /> : <div key={idx}>Loading keynote...</div>;
//       } else {
//         const content = node.nodeType === Node.ELEMENT_NODE
//           ? (node as HTMLElement).outerHTML
//           : node.textContent;
//         return <span key={idx} dangerouslySetInnerHTML={{ __html: content || "" }} />;
//       }
//     });
//   };

//   return <div className="flex flex-col gap-12">{renderContent()}</div>;
// };