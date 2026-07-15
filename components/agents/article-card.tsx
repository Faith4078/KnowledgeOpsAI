import { Markdown } from "@/components/markdown";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ArticleCardProps {
  article: string;
}

/** Help-center article previewed as polished, executive-ready prose. */
export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Help article</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Markdown>{article}</Markdown>
      </CardContent>
    </Card>
  );
}
