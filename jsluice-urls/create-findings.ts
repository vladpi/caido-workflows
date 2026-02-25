export async function run({ request, response }, sdk) {
  if (!response || !request) return;

  const url = request.getHost() + request.getPath();
  const contentType = response.getHeader("content-type") || "";

  const isRelevant = contentType.includes("javascript") ||
    contentType.includes("html") ||
    contentType.includes("json") ||
    url.endsWith(".js") || url.endsWith(".jsx") || url.endsWith(".mjs");
  if (!isRelevant) return;

  const body = response.getBody()?.toText();
  if (!body) return;

  const lines = body.trim().split("\n");
  const foundUrls = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      if (parsed.url) foundUrls.push(parsed);
    } catch (e) {
      continue;
    }
  }

  if (foundUrls.length === 0) return;

  const unique = [...new Map(foundUrls.map(u => [u.url, u])).values()];

  const apiUrls = unique.filter(u => /\/api\//i.test(u.url) || /\/v[0-9]+\//i.test(u.url) || /graphql/i.test(u.url));
  const externalUrls = unique.filter(u => /^https?:\/\//.test(u.url) && !apiUrls.includes(u));
  const paths = unique.filter(u => !apiUrls.includes(u) && !externalUrls.includes(u));

  const sections = [];
  if (apiUrls.length > 0) sections.push("**API Endpoints (" + apiUrls.length + "):**\n" + apiUrls.map(u => "- `" + u.url + "` (" + (u.type || "") + ")").join("\n"));
  if (externalUrls.length > 0) sections.push("**External URLs (" + externalUrls.length + "):**\n" + externalUrls.map(u => "- `" + u.url + "`").join("\n"));
  if (paths.length > 0) sections.push("**Paths (" + paths.length + "):**\n" + paths.map(u => "- `" + u.url + "`").join("\n"));

  await sdk.findings.create({
    title: "[jsluice] " + unique.length + " URLs extracted",
    description: "**Source:** " + url + "\n**Total:** " + unique.length + "\n\n" + sections.join("\n\n"),
    reporter: "jsluice URL Extractor",
    request: request,
    dedupeKey: "jsluice-" + url
  });

  sdk.console.log("[jsluice] Found " + unique.length + " URL(s) in " + url);
}