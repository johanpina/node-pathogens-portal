"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Escribe el contenido aquí...",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addImage = useCallback(
    async (file: File) => {
      if (!editor) return;
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const { url } = await res.json();
        editor.chain().focus().setImage({ src: url }).run();
      }
    },
    [editor]
  );

  const setLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL del enlace:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="tiptap-editor">
      <div className="tiptap-toolbar">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "is-active" : ""} title="Negrita"><b>B</b></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "is-active" : ""} title="Cursiva"><i>I</i></button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive("strike") ? "is-active" : ""} title="Tachado"><s>S</s></button>
        <span className="mx-1 text-muted">|</span>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}>H3</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} className={editor.isActive("heading", { level: 4 }) ? "is-active" : ""}>H4</button>
        <span className="mx-1 text-muted">|</span>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "is-active" : ""} title="Lista"><i className="bi bi-list-ul"></i></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? "is-active" : ""} title="Lista numerada"><i className="bi bi-list-ol"></i></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive("blockquote") ? "is-active" : ""} title="Cita"><i className="bi bi-quote"></i></button>
        <span className="mx-1 text-muted">|</span>
        <button type="button" onClick={setLink} className={editor.isActive("link") ? "is-active" : ""} title="Enlace"><i className="bi bi-link-45deg"></i></button>
        <button type="button" onClick={() => fileInputRef.current?.click()} title="Imagen"><i className="bi bi-image"></i></button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="d-none"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) addImage(file);
            e.target.value = "";
          }}
        />
        <span className="mx-1 text-muted">|</span>
        <button type="button" onClick={() => editor.chain().focus().undo().run()} title="Deshacer"><i className="bi bi-arrow-counterclockwise"></i></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} title="Rehacer"><i className="bi bi-arrow-clockwise"></i></button>
      </div>
      <EditorContent editor={editor} className="tiptap-content" />
    </div>
  );
}
