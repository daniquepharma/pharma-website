export default function FormattedDescription({ content }: { content: string }) {
    const lines = content.split("\n");

    return (
        <div className="space-y-3">
            {lines.map((line, index) => {
                // Heading 1
                if (line.startsWith("# ")) {
                    return (
                        <h1 key={index} className="text-2xl font-bold text-white mt-4 mb-2">
                            {line.substring(2)}
                        </h1>
                    );
                }
                // Heading 2
                if (line.startsWith("## ")) {
                    return (
                        <h2 key={index} className="text-xl font-semibold text-white mt-3 mb-2">
                            {line.substring(3)}
                        </h2>
                    );
                }
                // List item
                if (line.startsWith("- ")) {
                    return (
                        <li key={index} className="text-slate-300 ml-4 list-disc">
                            {formatInlineMarkdown(line.substring(2))}
                        </li>
                    );
                }
                // Regular paragraph with inline formatting
                return line.trim() ? (
                    <p key={index} className="text-slate-300 leading-relaxed">
                        {formatInlineMarkdown(line)}
                    </p>
                ) : (
                    <div key={index} className="h-2"></div>
                );
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
            parts.push(<strong key={match.index} className="font-bold text-white">{match[2]}</strong>);
        } else if (match[3]) {
            // Italic
            parts.push(<em key={match.index} className="italic text-slate-200">{match[4]}</em>);
        }

        currentIndex = regex.lastIndex;
    }

    // Add remaining text
    if (currentIndex < text.length) {
        parts.push(text.substring(currentIndex));
    }

    return parts.length > 0 ? parts : text;
}
