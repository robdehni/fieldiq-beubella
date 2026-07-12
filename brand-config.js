// ── FieldIQ white-label branding config ────────────────────────────────
// Single source of truth for the company name shown across every page.
// To rebrand for a different company, change ONLY the two values below —
// every page picks them up automatically on load via applyBrand(). No
// other file needs to be touched.
var FIELDIQ_BRAND = {
  name: 'Beu Bella Cosmetics',
  tagline: 'by FieldIQ'
};

function applyBrand() {
  document.querySelectorAll('[data-brand-name]').forEach(function(el) {
    el.textContent = FIELDIQ_BRAND.name;
  });
  document.querySelectorAll('[data-brand-tagline]').forEach(function(el) {
    el.textContent = FIELDIQ_BRAND.tagline;
  });
  // Browser tab title is left as the static value already baked into each
  // page's <title> tag at build time (already correct, e.g. "Beu Bella
  // Cosmetics — Dashboard") rather than rewritten dynamically here.
}

document.addEventListener('DOMContentLoaded', applyBrand);
