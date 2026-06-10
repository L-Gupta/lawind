import { Badge } from "@/components/ui/badge";
import { Scale } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Scale className="size-4" />
        </div>
        <span className="text-base font-semibold tracking-tight">Lawind AI</span>
      </div>
      <Badge variant="secondary">Development</Badge>
    </header>
  );
}
