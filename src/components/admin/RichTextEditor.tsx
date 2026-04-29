import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Strikethrough, List, ListOrdered, Heading1, Heading2, Heading3,
  Quote, Code, Link as LinkIcon, Image as ImageIcon, Undo, Redo, Minus,
  AlignLeft, AlignCenter, AlignRight,
} from "lucide-react";
import { api } from "@/lib/api";
import { useCallback, useEffect, useRef } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      "data-align": {
        default: "center",
        parseHTML: (el) => el.getAttribute("data-align") || "center",
        renderHTML: (attrs) => ({ "data-align": attrs["data-align"] }),
      },
      "data-size": {
        default: "large",
        parseHTML: (el) => el.getAttribute("data-size") || "large",
        renderHTML: (attrs) => ({ "data-size": attrs["data-size"] }),
      },
      "data-caption": {
        default: "",
        parseHTML: (el) => el.getAttribute("data-caption") || "",
        renderHTML: (attrs) => (attrs["data-caption"] ? { "data-caption": attrs["data-caption"] } : {}),
      },
    };
  },
});

const MenuButton = ({ onClick, active, disabled, children, title }: { onClick: () => void; active?: boolean; disabled?: boolean; children: React.ReactNode; title: string }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`p-1.5 rounded transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"} disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground`}
  >
    {children}
  </button>
);

async function uploadAndInsertImage(file: File, editor: any, pos?: number) {
  try {
    const res = await api.upload<{ url: string }>("/admin/upload", file);
    const chain = editor.chain().focus();
    if (typeof pos === "number") chain.setTextSelection(pos);
    chain
      .setImage({ src: res.url })
      .updateAttributes("image", {
        "data-align": "center",
        "data-size": "large",
      } as any)
      .run();
  } catch (err) {
    console.warn("[RichTextEditor] image upload failed:", err);
  }
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editorRef = useRef<any>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomImage,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Comece a escrever..." }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handlePaste: (_view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        const imageFiles: File[] = [];
        for (let i = 0; i < items.length; i++) {
          const it = items[i];
          if (it.kind === "file" && it.type.startsWith("image/")) {
            const f = it.getAsFile();
            if (f) imageFiles.push(f);
          }
        }
        if (imageFiles.length === 0) return false;
        event.preventDefault();
        const ed = editorRef.current;
        if (ed) imageFiles.forEach((f) => uploadAndInsertImage(f, ed));
        return true;
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false;
        const dt = (event as DragEvent).dataTransfer;
        if (!dt || !dt.files || dt.files.length === 0) return false;
        const imageFiles = Array.from(dt.files).filter((f) => f.type.startsWith("image/"));
        if (imageFiles.length === 0) return false;
        event.preventDefault();
        const coords = { left: (event as DragEvent).clientX, top: (event as DragEvent).clientY };
        const dropPos = view.posAtCoords(coords)?.pos;
        const ed = editorRef.current;
        if (ed) imageFiles.forEach((f) => uploadAndInsertImage(f, ed, dropPos));
        return true;
      },
    },
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  const addImage = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = async (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (!files.length || !editor) return;
      for (const f of files) {
        await uploadAndInsertImage(f, editor);
      }
    };
    input.click();
  }, [editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL do link:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const imageSelected = editor.isActive("image");
  const setImageAlign = (value: "left" | "center" | "right") =>
    editor.chain().focus().updateAttributes("image", { "data-align": value } as any).run();
  const setImageSize = (value: "small" | "medium" | "large") =>
    editor.chain().focus().updateAttributes("image", { "data-size": value } as any).run();
  const currentImageAlign = (editor.getAttributes("image") as any)["data-align"];
  const currentImageSize = (editor.getAttributes("image") as any)["data-size"];
  const currentImageCaption = (editor.getAttributes("image") as any)["data-caption"] || "";
  const setImageCaption = (value: string) =>
    editor.chain().focus().updateAttributes("image", { "data-caption": value } as any).run();

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <div className="flex flex-wrap gap-0.5 p-2 border-b border-border bg-secondary/30">
        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Negrito">
          <Bold size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Itálico">
          <Italic size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Tachado">
          <Strikethrough size={16} />
        </MenuButton>
        <div className="w-px bg-border mx-1" />
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Título 1">
          <Heading1 size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Título 2">
          <Heading2 size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Título 3">
          <Heading3 size={16} />
        </MenuButton>
        <div className="w-px bg-border mx-1" />
        <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Lista">
          <List size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Lista numerada">
          <ListOrdered size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Citação">
          <Quote size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Código">
          <Code size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Separador">
          <Minus size={16} />
        </MenuButton>
        <div className="w-px bg-border mx-1" />
        <MenuButton onClick={addLink} active={editor.isActive("link")} title="Link">
          <LinkIcon size={16} />
        </MenuButton>
        <MenuButton onClick={addImage} title="Imagem">
          <ImageIcon size={16} />
        </MenuButton>
        <div className="w-px bg-border mx-1" />
        <MenuButton onClick={() => editor.chain().focus().undo().run()} title="Desfazer">
          <Undo size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()} title="Refazer">
          <Redo size={16} />
        </MenuButton>
      </div>

      {imageSelected && (
        <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-primary/5">
          <span className="text-xs font-medium text-muted-foreground px-2">Imagem:</span>
          <MenuButton onClick={() => setImageAlign("left")} active={currentImageAlign === "left"} title="Alinhar à esquerda">
            <AlignLeft size={16} />
          </MenuButton>
          <MenuButton onClick={() => setImageAlign("center")} active={currentImageAlign === "center"} title="Centralizar">
            <AlignCenter size={16} />
          </MenuButton>
          <MenuButton onClick={() => setImageAlign("right")} active={currentImageAlign === "right"} title="Alinhar à direita">
            <AlignRight size={16} />
          </MenuButton>
          <div className="w-px bg-border mx-1" />
          <button
            type="button"
            onClick={() => setImageSize("small")}
            className={`px-2 py-1 text-xs rounded transition-colors ${currentImageSize === "small" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
            title="Pequena (33%)"
          >
            P
          </button>
          <button
            type="button"
            onClick={() => setImageSize("medium")}
            className={`px-2 py-1 text-xs rounded transition-colors ${currentImageSize === "medium" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
            title="Média (66%)"
          >
            M
          </button>
          <button
            type="button"
            onClick={() => setImageSize("large")}
            className={`px-2 py-1 text-xs rounded transition-colors ${currentImageSize === "large" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
            title="Grande (100%)"
          >
            G
          </button>
          <div className="w-px bg-border mx-1" />
          <input
            type="text"
            value={currentImageCaption}
            onChange={(e) => setImageCaption(e.target.value)}
            placeholder="Legenda (opcional)"
            className="flex-1 min-w-[180px] px-2 py-1 text-xs rounded bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>
      )}

      <EditorContent
        editor={editor}
        className="rich-editor-content prose prose-sm dark:prose-invert max-w-none p-4 min-h-[400px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[400px] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none"
      />
    </div>
  );
};

export default RichTextEditor;
