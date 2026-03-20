import { getUserStats } from "@/app/actions";
import StatsPageClient from "./StatsPageClient";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  return <StatsPageClient />;
}
