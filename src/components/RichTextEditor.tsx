"use client";

import { useState } from "react";
import { Bold, Italic, List, Type, Heading1, Heading2 } from "lucide-react";

interface RichTextEditorProps {
    name: string;
    defaultValue?: string;
    placeholder?: string;
}

export default function RichTextEditor({ name, defaultValue = "", placeholder }: RichTextEditorProps) {
    const [content, setContent] = useState(defaultValue);

    const formatText = (format: string) => {
        const textarea = document.getElementById(`editor-${name}`) as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);

        let formattedText = "";
        let newContent = "";

        switch (format) {
            case "bold":
                formattedText = `**${selectedText}**`;
                break;
            case "italic":
                formattedText = `*${selectedText}*`;
                break;
            case "h1":
                formattedText = `# ${selectedText}`;
                break;
            case "h2":
                formattedText = `## ${selectedText}`;
                break;
            case "list":
                formattedText = `- ${selectedText}`;
                break;
            default:
                return;
        }

        newContent = content.substring(0, start) + formattedText + content.substring(end);
        setContent(newContent);

        // Update cursor position
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start, start + formattedText.length);
        }, 0);
    };

    return (
        <div className="space-y-2">
            {/* Formatting Toolbar */}
            <div className="flex gap-2 p-2 bg-slate-900 border border-slate-700 rounded-lg">
                <button
                    type="button"
                    onClick={() => formatText("bold")}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                    title="Bold"
                >
                    <Bold size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => formatText("italic")}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                    title="Italic"
                >
                    <Italic size={18} />
                </button>
                <div className="w-px bg-slate-700"></div>
                <button
                    type="button"
                    onClick={() => formatText("h1")}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                    title="Heading 1"
                >
                    <Heading1 size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => formatText("h2")}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                    title="Heading 2"
                >
                    <Heading2 size={18} />
                </button>
                <div className="w-px bg-slate-700"></div>
                <button
                    type="button"
                    onClick={() => formatText("list")}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                    title="Bullet List"
                >
                    <List size={18} />
                </button>
            </div>

            {/* Editor Textarea */}
            <textarea
                id={`editor-${name}`}
                name={name}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none min-h-[200px] font-mono text-sm"
            />

            {/* Preview */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-2">Preview:</p>
                <div className="prose prose-invert prose-sm max-w-none">
                    <MarkdownPreview content={content} />
                </div>
            </div>
        </div>
    );
}

// Simple markdown preview component
function MarkdownPreview({ content }: { content: string }) {
    const lines = content.split("\n");

    return (
        <div className="space-y-2">
            {lines.map((line, index) => {
                // Heading 1
                if (line.startsWith("# ")) {
                    return (
                        <h1 key={index} className="text-2xl font-bold text-white">
                            {line.substring(2)}
                        </h1>
                    );
                }
                // Heading 2
                if (line.startsWith("## ")) {
                    return (
                        <h2 key={index} className="text-xl font-bold text-white">
                            {line.substring(3)}
                        </h2>
                    );
                }
                // List item
                if (line.startsWith("- ")) {
                    return (
                        <li key={index} className="text-slate-300 ml-4">
                            {formatInlineMarkdown(line.substring(2))}
                        </li>
                    );
                }
                // Regular paragraph with inline formatting
                return line.trim() ? (
                    <p key={index} className="text-slate-300">
                        {formatInlineMarkdown(line)}
                    </p>
                ) : null;
            })}
        </div>
    );
}

// Format inline markdown (bold, italic)
function formatInlineMarkdown(text: string) {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;

    // Match bold (**text**) and italic (*text*)
    const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
        // Add text before match
        if (match.index > currentIndex) {
            parts.push(text.substring(currentIndex, match.index));
        }

        // Add formatted text
        if (match[1]) {
            // Bold
            parts.push(<strong key={match.index} className="font-bold">{match[2]}</strong>);
        } else if (match[3]) {
            // Italic
            parts.push(<em key={match.index} className="italic">{match[4]}</em>);
        }

        currentIndex = regex.lastIndex;
    }

    // Add remaining text
    if (currentIndex < text.length) {
        parts.push(text.substring(currentIndex));
    }

    return parts.length > 0 ? parts : text;
}
