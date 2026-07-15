import { Markdown } from "@/components/markdown";

interface ArticleBodyProps {
  article: string;
}

/** The full help article rendered as polished, executive-ready prose. */
export function ArticleBody({ article }: ArticleBodyProps) {
  return <Markdown>{article}</Markdown>;
}
