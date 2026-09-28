"use client";

import { useEffect } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Bold, Italic, Link2, List, ListOrdered, Quote, Redo2, Underline as UnderlineIcon, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Éditeur de texte enrichi (TipTap) : gras, italique, souligné, listes, citation, liens. */
export function RichTextEditor({
  value,
  onChange,
  label,
  editorRef,
  minHeight = "12rem",
}: {
  value: string;
  onChange: (html: string) => void;
  label: string;
  editorRef?: (e: Editor | null) => void;
  minHeight?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, link: false }), Link.configure({ openOnClick: false, autolink: true })],
    content: value,
    editorProps: {
      attributes: {
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": label,
        class: "prose-editor px-4 py-3 focus:outline-none",
        style: `min-height:${minHeight}`,
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    editorRef?.(editor);
  }, [editor, editorRef]);

  const btn = (active: boolean) => cn("rounded p-1.5 hover:bg-black/5", active && "bg-black/10 text-ink");

  const tools: { label: string; icon: typeof Bold; run: (e: Editor) => void; active?: (e: Editor) => boolean }[] = [
    { label: "Gras", icon: Bold, run: (e) => e.chain().focus().toggleBold().run(), active: (e) => e.isActive("bold") },
    { label: "Italique", icon: Italic, run: (e) => e.chain().focus().toggleItalic().run(), active: (e) => e.isActive("italic") },
    { label: "Souligné", icon: UnderlineIcon, run: (e) => e.chain().focus().toggleUnderline().run(), active: (e) => e.isActive("underline") },
    { label: "Liste à puces", icon: List, run: (e) => e.chain().focus().toggleBulletList().run(), active: (e) => e.isActive("bulletList") },
    { label: "Liste numérotée", icon: ListOrdered, run: (e) => e.chain().focus().toggleOrderedList().run(), active: (e) => e.isActive("orderedList") },
    { label: "Citation", icon: Quote, run: (e) => e.chain().focus().toggleBlockquote().run(), active: (e) => e.isActive("blockquote") },
    {
      label: "Lien",
      icon: Link2,
      run: (e) => {
        const prev = e.getAttributes("link").href as string | undefined;
        const url = window.prompt("Adresse du lien (https://…)", prev ?? "https://");
        if (url === null) return;
        if (!url || url === "https://") e.chain().focus().unsetLink().run();
        else if (/^(https?:|mailto:|tel:)/.test(url)) e.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
      },
      active: (e) => e.isActive("link"),
    },
    { label: "Annuler", icon: Undo2, run: (e) => e.chain().focus().undo().run() },
    { label: "Rétablir", icon: Redo2, run: (e) => e.chain().focus().redo().run() },
  ];

  return (
    <div className="rounded-md border border-black/15 bg-white focus-within:border-ink focus-within:ring-2 focus-within:ring-ink/15">
      <div role="toolbar" aria-label="Mise en forme" className="flex flex-wrap gap-0.5 border-b border-black/10 px-2 py-1.5 text-muted-dark">
        {tools.map(({ label: l, icon: Icon, run, active }) => (
          <button
            key={l}
            type="button"
            title={l}
            aria-label={l}
            aria-pressed={active ? Boolean(editor && active(editor)) : undefined}
            onClick={() => editor && run(editor)}
            className={btn(Boolean(editor && active?.(editor)))}
          >
            <Icon aria-hidden className="size-4" />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
