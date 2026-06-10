import { BookOpen, FileText, Shield } from "lucide-react";

import { ApiStatus } from "@/components/status/api-status";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    title: "Legal Research",
    description:
      "Natural language search across Supreme Court judgments, High Court decisions, statutes, and regulations.",
    icon: BookOpen,
    status: "In development",
  },
  {
    title: "AI Drafting Studio",
    description:
      "Generate NDAs, agreements, notices, and petitions from plain English instructions.",
    icon: FileText,
    status: "Coming soon",
  },
  {
    title: "Contract Review",
    description:
      "Upload documents for clause extraction, risk identification, and compliance analysis.",
    icon: Shield,
    status: "Coming soon",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 p-6 md:p-10">
      <section className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          Phase 1 — Legal Research Engine
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          AI-powered legal intelligence for India
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Lawind AI combines artificial intelligence with Indian legal knowledge
          to make legal work faster, more accurate, and more accessible.
        </p>
      </section>

      <Separator />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} size="sm">
            <CardHeader>
              <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-muted">
                <feature.icon className="size-4 text-foreground" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-xs font-medium text-muted-foreground">
                {feature.status}
              </span>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="max-w-md">
        <ApiStatus />
      </section>
    </div>
  );
}
