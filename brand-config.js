// ── FieldIQ white-label branding config ────────────────────────────────
// Single source of truth for the company name shown across every page.
// To rebrand for a different company, change ONLY the value below — every
// page picks it up automatically on load via applyBrand(). No other file
// needs to be touched.
var FIELDIQ_BRAND = {
  name: 'Beu Bella Cosmetics'
};

function applyBrand() {
  // Matches the MedTech reference exactly: company name in dark navy,
  // "BY" in neutral gray, "FieldIQ" in the existing two-tone wordmark
  // style (dark navy "Field" + blue "IQ") — all inline-styled so this
  // renders identically on every page regardless of that page's own CSS,
  // and touches nothing outside these two existing header elements.
  var nameHtml =
    '<span style="color:#0b1f3a">' + FIELDIQ_BRAND.name + '</span>' +
    '<span style="color:#8a9bb3;font-weight:700"> BY </span>' +
    '<span style="color:#0b1f3a">Field</span><span style="color:#2f8fff">IQ</span>';
  document.querySelectorAll('[data-brand-name]').forEach(function(el) {
    el.innerHTML = nameHtml;
  });
  document.querySelectorAll('[data-brand-tagline]').forEach(function(el) {
    el.textContent = 'TERRITORY INTELLIGENCE PLATFORM';
  });
  // Browser tab title is left as the static value already baked into each
  // page's <title> tag at build time (already correct, e.g. "Beu Bella
  // Cosmetics — Dashboard") rather than rewritten dynamically here.
}

document.addEventListener('DOMContentLoaded', applyBrand);
