function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(36);
}

export async function run({ request, response, extra }, sdk) {
  if (!request) return;

  const url = request.getHost() + request.getPath();
  const body = sdk.asString(extra.stdout);
  if (!body || !body.trim()) return;

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

  const unique = [...new Map(foundUrls.map((u) => [u.url, u])).values()];

  const urls = unique.filter((u) => /^https?:\/\//.test(u.url));
  const paths = unique.filter((u) => !/^https?:\/\//.test(u.url));

  if (urls.length > 0) {
    const h = hash(
      urls
        .map((u) => u.url)
        .sort()
        .join(","),
    );
    await sdk.findings.create({
      title: "[jsluice] " + urls.length + " URLs",
      description:
        "**Source:** " +
        url +
        "\n\n```\n" +
        urls.map((u) => u.url).join("\n") +
        "\n```",
      reporter: "jsluice URL Extractor",
      request: request,
      dedupeKey: "jsluice-urls-" + url + "-" + h,
    });
  }

  if (paths.length > 0) {
    const h = hash(
      paths
        .map((u) => u.url)
        .sort()
        .join(","),
    );
    await sdk.findings.create({
      title: "[jsluice] " + paths.length + " paths",
      description:
        "**Source:** " +
        url +
        "\n\n```\n" +
        paths.map((u) => u.url).join("\n") +
        "\n```",
      reporter: "jsluice URL Extractor",
      request: request,
      dedupeKey: "jsluice-paths-" + url + "-" + h,
    });
  }

  sdk.console.log("[jsluice] Found " + unique.length + " URL(s) in " + url);
}
