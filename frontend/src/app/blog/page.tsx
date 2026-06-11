import type { Metadata } from "next";

import { ComingSoonPage } from "@/components/layout/coming-soon-page";

export const metadata: Metadata = {
  title: "Blog | LawInd",
};

export default function BlogPage() {
  return (
    <ComingSoonPage
      eyebrow="Blog"
      title={
        <>
          Insights on
          <br />
          <em>Indian legal AI</em>
        </>
      }
      description="Product updates, legal technology insights, and perspectives on the future of Indian legal practice. First posts coming at launch."
    />
  );
}
