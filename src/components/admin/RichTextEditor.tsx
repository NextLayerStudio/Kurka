'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { EditorContent, Node, mergeAttributes, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import { IMAGE_TYPES, VIDEO_TYPES, uploadImage, uploadVideo } from './media';

const Video = Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return { src: { default: null } };
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-video]',
        getAttrs: (el) => ({ src: (el as HTMLElement).querySelector('video')?.getAttribute('src') ?? null }),
      },
      { tag: 'video[src]' },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { 'data-video': '' },
      ['video', mergeAttributes({ controls: 'true', preload: 'metadata', playsinline: 'true' }, { src: HTMLAttributes.src })],
    ];
  },
});

interface Upload {
  id: number;
  label: string;
  progress: number;
  status?: string;
}

interface Props {
  initialContent: string;
  blobEnabled: boolean;
  onChange: (html: string) => void;
  onError: (message: string) => void;
}

type Popover = null | 'link' | 'youtube';

export default function RichTextEditor({ initialContent, blobEnabled, onChange, onError }: Props) {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [popover, setPopover] = useState<Popover>(null);
  const [popoverValue, setPopoverValue] = useState('');
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const uploadCounter = useRef(0);

  const insertFiles = useCallback(
    async (files: File[], position?: number) => {
      const editor = editorRef.current;
      if (!editor) return;

      for (const file of files) {
        const isVideo = VIDEO_TYPES.includes(file.type);
        const isImage = IMAGE_TYPES.includes(file.type);
        if (!isVideo && !isImage) {
          onError(`Súbor „${file.name}“ nie je podporovaný obrázok ani video.`);
          continue;
        }

        const id = ++uploadCounter.current;
        setUploads((list) => [...list, { id, label: file.name, progress: 0 }]);
        const onProgress = (progress: number, status?: string) =>
          setUploads((list) =>
            list.map((u) => (u.id === id ? { ...u, progress, status: status ?? u.status } : u))
          );

        try {
          const src = isVideo
            ? await uploadVideo(file, blobEnabled, onProgress)
            : await uploadImage(file, blobEnabled, onProgress);
          const node = isVideo ? { type: 'video', attrs: { src } } : { type: 'image', attrs: { src, alt: '' } };
          const chain = editor.chain().focus();
          if (position !== undefined) chain.insertContentAt(position, node);
          else chain.insertContent(node);
          chain.run();
        } catch (error) {
          onError(error instanceof Error ? error.message : 'Nahrávanie zlyhalo.');
        } finally {
          setUploads((list) => list.filter((u) => u.id !== id));
        }
      }
    },
    [blobEnabled, onError]
  );

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
      }),
      Image.configure({ allowBase64: true }),
      Video,
      Youtube.configure({ nocookie: true, width: 640, height: 360 }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder: 'Začnite písať svoj článok… Obrázky a videá môžete sem rovno pretiahnuť alebo vložiť (Ctrl+V).',
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: { class: 'article-content' },
      handleDrop: (view, event, _slice, moved) => {
        const files = Array.from(event.dataTransfer?.files ?? []);
        if (moved || !files.length) return false;
        event.preventDefault();
        const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
        void insertFiles(files, pos);
        return true;
      },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []);
        if (!files.length) return false;
        event.preventDefault();
        void insertFiles(files);
        return true;
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  if (!editor) {
    return <div className="min-h-[480px] animate-pulse rounded-2xl bg-gray-100" />;
  }

  const openPopover = (kind: Popover) => {
    if (popover === kind) {
      setPopover(null);
      return;
    }
    setPopoverValue(kind === 'link' ? (editor.getAttributes('link').href ?? '') : '');
    setPopover(kind);
  };

  const applyPopover = () => {
    const value = popoverValue.trim();
    if (popover === 'link') {
      if (!value) editor.chain().focus().extendMarkRange('link').unsetLink().run();
      else {
        const href = /^(https?:|mailto:|tel:|\/)/.test(value) ? value : `https://${value}`;
        editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
      }
    } else if (popover === 'youtube' && value) {
      const ok = editor.chain().focus().setYoutubeVideo({ src: value }).run();
      if (!ok) {
        onError('Toto nevyzerá ako odkaz na YouTube video.');
        return;
      }
    }
    setPopover(null);
  };

  const headingValue = editor.isActive('heading', { level: 2 })
    ? 'h2'
    : editor.isActive('heading', { level: 3 })
      ? 'h3'
      : 'p';

  return (
    <div className="relative">
      <div className="sticky top-[72px] z-20 -mx-1 mb-6 rounded-2xl border border-gray-200 bg-white/95 px-2 py-2 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center gap-1">
          <select
            value={headingValue}
            onChange={(e) => {
              const chain = editor.chain().focus();
              if (e.target.value === 'p') chain.setParagraph().run();
              else chain.setHeading({ level: e.target.value === 'h2' ? 2 : 3 }).run();
            }}
            className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5ECAD5]"
            title="Štýl textu"
          >
            <option value="p">Bežný text</option>
            <option value="h2">Nadpis</option>
            <option value="h3">Podnadpis</option>
          </select>

          <Divider />
          <ToolButton title="Tučné (Ctrl+B)" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
            <span className="font-bold">B</span>
          </ToolButton>
          <ToolButton title="Kurzíva (Ctrl+I)" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <span className="italic font-serif">I</span>
          </ToolButton>
          <ToolButton title="Podčiarknuté (Ctrl+U)" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <span className="underline">U</span>
          </ToolButton>
          <ToolButton title="Prečiarknuté" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <span className="line-through">S</span>
          </ToolButton>

          <Divider />
          <ToolButton title="Odrážky" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <Icon d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />
          </ToolButton>
          <ToolButton title="Číslovaný zoznam" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <Icon d="M10 6h10M10 12h10M10 18h10M4 5h1v4M4 9h2M4 14.5a1 1 0 0 1 2 0c0 .8-2 1.5-2 3h2" />
          </ToolButton>
          <ToolButton title="Citát / zvýraznený blok" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <Icon d="M7 7h4v4c0 3-1.5 5-4 6M14 7h4v4c0 3-1.5 5-4 6" />
          </ToolButton>

          <Divider />
          <ToolButton title="Zarovnať doľava" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
            <Icon d="M4 6h16M4 10h10M4 14h16M4 18h10" />
          </ToolButton>
          <ToolButton title="Zarovnať na stred" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
            <Icon d="M4 6h16M7 10h10M4 14h16M7 18h10" />
          </ToolButton>
          <ToolButton title="Zarovnať doprava" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
            <Icon d="M4 6h16M10 10h10M4 14h16M10 18h10" />
          </ToolButton>

          <Divider />
          <ToolButton title="Odkaz" active={editor.isActive('link') || popover === 'link'} onClick={() => openPopover('link')}>
            <Icon d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
          </ToolButton>
          <ToolButton title="Vložiť obrázok" onClick={() => imageInput.current?.click()} label="Foto">
            <Icon d="M4 16l4.6-4.6a2 2 0 0 1 2.8 0L16 16m-2-2 1.6-1.6a2 2 0 0 1 2.8 0L20 14M14 8h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
          </ToolButton>
          <ToolButton title="Nahrať video zo zariadenia" onClick={() => videoInput.current?.click()} label="Video">
            <Icon d="M15 10l4.55-2.28A1 1 0 0 1 21 8.62v6.76a1 1 0 0 1-1.45.9L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" />
          </ToolButton>
          <ToolButton title="Vložiť YouTube video" active={popover === 'youtube'} onClick={() => openPopover('youtube')} label="YouTube">
            <Icon d="M10 9.5v5l4.5-2.5L10 9.5zM3 12c0-3 .3-4.6 1-5.3C5 5.7 8 5.5 12 5.5s7 .2 8 1.2c.7.7 1 2.3 1 5.3s-.3 4.6-1 5.3c-1 1-4 1.2-8 1.2s-7-.2-8-1.2C3.3 16.6 3 15 3 12z" />
          </ToolButton>
          <ToolButton title="Oddeľovač" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <Icon d="M4 12h16" />
          </ToolButton>

          <div className="ml-auto flex items-center gap-1">
            <ToolButton title="Späť (Ctrl+Z)" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
              <Icon d="M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3" />
            </ToolButton>
            <ToolButton title="Znova (Ctrl+Shift+Z)" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
              <Icon d="m15 14 5-5-5-5M20 9H9a5 5 0 0 0 0 10h3" />
            </ToolButton>
          </div>
        </div>

        {popover && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              applyPopover();
            }}
            className="mt-2 flex flex-col gap-2 border-t border-gray-100 pt-2 sm:flex-row"
          >
            <input
              autoFocus
              value={popoverValue}
              onChange={(e) => setPopoverValue(e.target.value)}
              placeholder={popover === 'link' ? 'https://… (najprv označte text, ktorý má byť odkazom)' : 'https://www.youtube.com/watch?v=…'}
              className="h-10 flex-1 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5ECAD5]"
            />
            <div className="flex gap-2">
              <button type="submit" className="h-10 rounded-lg bg-[#5ECAD5] px-4 text-sm font-semibold text-white hover:bg-[#4BB8C4]">
                {popover === 'link' ? (popoverValue.trim() ? 'Uložiť odkaz' : 'Odstrániť odkaz') : 'Vložiť video'}
              </button>
              <button type="button" onClick={() => setPopover(null)} className="h-10 rounded-lg px-3 text-sm text-gray-500 hover:bg-gray-100">
                Zrušiť
              </button>
            </div>
          </form>
        )}

        {uploads.length > 0 && (
          <div className="mt-2 space-y-1.5 border-t border-gray-100 pt-2">
            {uploads.map((u) => (
              <div key={u.id} className="flex items-center gap-3 text-xs text-gray-600">
                <span className="w-40 truncate sm:w-64">{u.status ?? `Nahrávam ${u.label}`}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-[#5ECAD5] transition-all" style={{ width: `${Math.max(4, u.progress)}%` }} />
                </div>
                <span className="w-10 text-right tabular-nums">{Math.round(u.progress)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <EditorContent editor={editor} />

      <input
        ref={imageInput}
        type="file"
        accept={IMAGE_TYPES.join(',')}
        multiple
        hidden
        onChange={(e) => {
          void insertFiles(Array.from(e.target.files ?? []));
          e.target.value = '';
        }}
      />
      <input
        ref={videoInput}
        type="file"
        accept={VIDEO_TYPES.join(',')}
        hidden
        onChange={(e) => {
          void insertFiles(Array.from(e.target.files ?? []));
          e.target.value = '';
        }}
      />
    </div>
  );
}

function ToolButton({
  children,
  title,
  label,
  active = false,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  label?: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-lg px-2 text-sm transition-colors disabled:opacity-30 ${
        active ? 'bg-[#5ECAD5]/15 text-[#1F8E99]' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
      {label && <span className="hidden text-xs font-medium lg:inline">{label}</span>}
    </button>
  );
}

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function Divider() {
  return <span className="mx-1 h-6 w-px bg-gray-200" aria-hidden />;
}
