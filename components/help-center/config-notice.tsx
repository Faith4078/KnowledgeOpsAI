import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ConfigNoticeProps {
  message: string;
}

/** Friendly notice shown when Sanity is not configured or unreachable. */
export function ConfigNotice({ message }: ConfigNoticeProps) {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Help Center unavailable</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <p className="leading-relaxed text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}
