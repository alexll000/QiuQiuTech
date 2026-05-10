import { NextRequest, NextResponse } from "next/server";
import { searchSite } from "@/lib/content-service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const type = searchParams.get("type") || "all"; // all | contents | topics | requests
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  if (!query || query.trim().length < 2) {
    return NextResponse.json({
      success: false,
      error: "Query must be at least 2 characters",
      results: [],
    });
  }

  try {
    const result = await searchSite(query.trim());

    // Filter by type if specified
    let filteredResults = result;
    if (type !== "all") {
      filteredResults = {
        ...result,
        contents: type === "contents" ? result.contents : [],
        topics: type === "topics" ? result.topics : [],
        requests: type === "requests" ? result.requests : [],
      };
    }

    // Limit results
    const limitedContents = filteredResults.contents.slice(0, limit);
    const limitedTopics = filteredResults.topics.slice(0, limit);
    const limitedRequests = filteredResults.requests.slice(0, limit);

    return NextResponse.json({
      success: true,
      query: result.query,
      total: limitedContents.length + limitedTopics.length + limitedRequests.length,
      contents: limitedContents.map((item) => ({
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        brandName: item.brandName,
        sourceName: item.sourceName,
        contentType: item.contentType,
        tags: (item.tags || []).map((t) => t.name),
        href: `/contents/${item.slug}`,
      })),
      topics: limitedTopics.map((item) => ({
        slug: item.slug,
        title: item.title,
        intro: item.intro,
        href: `/topics/${item.slug}`,
      })),
      requests: limitedRequests.map((item) => ({
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        city: item.city,
        industry: item.industry?.name,
        requestType: item.requestType,
        href: `/requests/${item.slug}`,
      })),
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({
      success: false,
      error: "Search failed",
      results: [],
    });
  }
}
