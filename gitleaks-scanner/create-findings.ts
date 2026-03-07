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
    const secret = leak.Secret || leak.Match || "";
    if (!grouped[key])
      grouped[key] = { desc: leak.Description || key, secrets: new Set() };
    grouped[key].secrets.add(secret);
  }

  for (const [ruleId, { desc, secrets }] of Object.entries(grouped)) {
    const sorted = [...secrets].sort();
    const list = sorted.join("\n");
    await sdk.findings.create({
      title: "[Gitleaks] " + desc,
      description:
        "**Rule:** " +
        ruleId +
        "\n\n**URL:** " +
        url +
        "\n\n**Secrets (" +
        secrets.size +
        "):**\n\n```\n" +
        list +
        "\n```",
      reporter: "Gitleaks Scanner",
      request: request,
      dedupeKey:
        "gitleaks-" + ruleId + "-" + hash(sorted.join(",")),
    });
  }
  sdk.console.log("[Gitleaks] Found " + leaks.length + " leak(s) at " + url);
}
