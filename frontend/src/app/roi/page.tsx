import type { Metadata } from "next";

import { RoiCalculator } from "@/components/roi/roi-calculator";

export const metadata: Metadata = {
  title: "ROI Calculator | LawInd",
};

export default function RoiPage() {
  return <RoiCalculator />;
}
