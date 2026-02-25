export async function run({ request, response }, sdk) {
  if (!response || !request) return;

  const url = request.getHost() + request.getPath();
  const body = response.getBody()?.toText();
  if (!body) return;

  let leaks = [];
  try {
    leaks = JSON.parse(body);
  } catch (e) {
    return;
  }

  if (!Array.isArray(leaks) || leaks.length === 0) return;

  const grouped = {};
  for (const leak of leaks) {
    const key = leak.RuleID || "unknown";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(leak);
  }

  for (const [ruleId, items] of Object.entries(grouped)) {
    const secrets = items.map(i => i.Secret || i.Match || "").join("\n");
    const desc = items[0].Description || ruleId;
    await sdk.findings.create({
      title: "[Gitleaks] " + desc,
      description: "**Rule:** " + ruleId + "\n**URL:** " + url + "\n**Secrets:**\n```\n" + secrets + "\n```",
      reporter: "Gitleaks Scanner",
      request: request,
      dedupeKey: "gitleaks-" + ruleId + "-" + url
    });
  }
  sdk.console.log("[Gitleaks] Found " + leaks.length + " secret(s) at " + url);
}