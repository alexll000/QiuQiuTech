import { getUserDashboard } from "@/lib/cms-client";
import type { CmsUserDashboard } from "@/lib/cms-types";
import { getMockUserDashboard } from "@/lib/mock-account-service";

const CMS_ENABLED = process.env.NEXT_PUBLIC_USE_DIRECTUS === "true";

export async function getCurrentUserDashboard(): Promise<CmsUserDashboard> {
  if (CMS_ENABLED) {
    try {
      return await getUserDashboard();
    } catch {
      return getMockUserDashboard();
    }
  }

  return getMockUserDashboard();
}
