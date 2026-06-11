import type { Metadata } from "next";

import { ComingSoonPage } from "@/components/layout/coming-soon-page";

export const metadata: Metadata = {
  title: "Resources | LawInd",
};

export default function ResourcesPage() {
  return (
    <ComingSoonPage
      eyebrow="Resources"
      title={
        <>
          Guides, reports,
          <br />
          <em>and webinars</em>
        </>
      }
      description="Videos, webinars, research reports, and practical guides for Indian legal professionals. Full resource hub launching with the platform."
    />
  );
}
