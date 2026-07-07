import { parseArticleBlocks } from "@/utils/article";

interface ArticleBodyProps {
  article: string;
}

const HEADING_CLASSES = {
  1: "font-serif text-2xl tracking-tight",
  2: "text-xl font-medium tracking-tight",
  3: "text-lg font-medium",
} as const;

// Article heading levels sit under the page <h1>, so level 1 → <h2> etc.
const HEADING_TAGS = { 1: "h2", 2: "h3", 3: "h4" } as const;

/** The full help article rendered as plain formatted text. */
export function ArticleBody({ article }: ArticleBodyProps) {
  const blocks = parseArticleBlocks(article);

  return (
    <div className="grid gap-4">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Heading = HEADING_TAGS[block.level];
          return (
            <Heading key={index} className={HEADING_CLASSES[block.level]}>
              {block.text}
            </Heading>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={index} className="grid list-disc gap-1.5 pl-5">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className="leading-relaxed text-muted-foreground">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
