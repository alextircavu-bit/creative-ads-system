const url = "https://jonfdlqlorqakbwiseip.supabase.co/rest/v1/projects?order=created_at.desc&limit=1&select=id,product_name,feature_name,status,generation_result";
const key = "sb_publishable_hB4QTd9pp19xGjcsHUxLEA_qQRasN_W";

const res = await fetch(url, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
const rows = await res.json();
if (!rows[0]) { console.log("No projects found"); process.exit(); }

const p = rows[0];
console.log("ID:", p.id);
console.log("Product:", p.product_name);
console.log("Feature:", p.feature_name);
console.log("Status:", p.status);

const g = p.generation_result;
if (!g) { console.log("No generation result"); process.exit(); }

const creatives = g.topCreatives?.creatives || [];
console.log("Total creatives:", creatives.length);

for (const cr of creatives) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Creative #${cr.rank} — "${cr.name}"`);
  console.log(`Emotion: ${cr.emotion} | Platform: ${cr.platform} | Delivery: ${cr.deliveryMode}`);
  console.log(`UGC Batch: ${cr.isUgcBatch || false} | Segment: ${cr.targetSegment || "n/a"}`);
  console.log(`Production: ${cr.productionStyle || "n/a"}`);

  console.log("\nHooks:");
  for (let j = 0; j < (cr.hooks || []).length; j++) {
    const h = cr.hooks[j];
    // show all hooks including hidden
    console.log(`  [H${j + 1}] "${h.text}"`);
    if (h.bodyText) console.log(`        bodyText: "${h.bodyText}"`);
    console.log(`        visual: ${h.visualStyle?.type} — ${h.visualStyle?.name}`);
    console.log(`        angle: ${h.angle}`);
    if (h.ugcArchetype) console.log(`        ugc: ${h.ugcArchetype}`);
  }

  console.log("\n  Bodies:");
  for (let j = 0; j < (cr.bodies || []).length; j++) {
    const b = cr.bodies[j];
    console.log(`  [B${j + 1}] text: "${b.text}"`);
    console.log(`        visual: ${b.visual}`);
  }

  console.log(`\n  CTA: "${cr.cta?.text}"`);
}
