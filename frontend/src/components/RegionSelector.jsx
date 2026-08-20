const REGIONS = [{ code: "IN", label: "🇮🇳 India (₹ INR)" }];

export default function RegionSelector() {
  return (
    <select className="region-selector" defaultValue="IN" aria-label="Region">
      {REGIONS.map((region) => (
        <option key={region.code} value={region.code}>
          {region.label}
        </option>
      ))}
    </select>
  );
}
