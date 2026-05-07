import type {
  CmsRequestApplicationGuide,
  CmsSubmissionCenterData,
} from "@/lib/cms-types";
import {
  getMockRequestApplicationGuide,
  getMockSubmissionCenterData,
} from "@/lib/mock-workflow-service";

export async function getSubmissionCenterData(): Promise<CmsSubmissionCenterData> {
  return getMockSubmissionCenterData();
}

export async function getRequestApplicationGuide(): Promise<CmsRequestApplicationGuide> {
  return getMockRequestApplicationGuide();
}
