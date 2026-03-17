function toNum(value) {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function formatNumber(n, decimals = 2) {
  if (!Number.isFinite(n)) return '0';
  const opts = { maximumFractionDigits: decimals, minimumFractionDigits: 0 };
  return n.toLocaleString(undefined, opts);
}

export function fmtKm(km) {
  return `${formatNumber(km, km < 1000 ? 1 : 0)} km`;
}

export function fmtDiam(minKm, maxKm) {
  const max = toNum(maxKm);
  const min = toNum(minKm);
  if (max < 1) {
    const minM = min * 1000;
    const maxM = max * 1000;
    return `${formatNumber(minM, 0)}–${formatNumber(maxM, 0)} m`;
  }
  return `${formatNumber(min, 2)}–${formatNumber(max, 2)} km`;
}

export function relativeSize(diamMaxKm) {
  const v = Math.max(0.001, toNum(diamMaxKm));
  const min = 0.001;
  const max = 10;
  const norm = (Math.log10(v) - Math.log10(min)) / (Math.log10(max) - Math.log10(min));
  return Math.min(1, Math.max(0.1, norm));
}

export function threatLevel(neo) {
  const missLunar = toNum(neo.missDistLunar);
  const sizeKm = toNum(neo.diamMaxKm);
  const hazardous = !!neo.isHazardous;

  if (hazardous && missLunar < 5) return { label: 'HIGH', color: '#ef4444' };
  if (hazardous && missLunar < 15) return { label: 'ELEVATED', color: '#f59e0b' };
  if (sizeKm >= 0.14 || missLunar < 10) return { label: 'WATCH', color: '#eab308' };
  return { label: 'LOW', color: '#22c55e' };
}

export function flattenFeed(feed) {
  const groups = feed?.near_earth_objects;
  if (!groups) return [];

  return Object.entries(groups).flatMap(([date, items]) =>
    items.map(neo => {
      const approach = neo.close_approach_data?.[0] || {};
      const miss = approach.miss_distance || {};
      const vel = approach.relative_velocity || {};
      const diam = neo.estimated_diameter?.kilometers || {};

      return {
        id: neo.id,
        name: neo.name,
        approachDate: approach.close_approach_date || date,
        approachFull: approach.close_approach_date_full,
        missDistKm: toNum(miss.kilometers),
        missDistLunar: toNum(miss.lunar),
        velocityKph: toNum(vel.kilometers_per_hour),
        diamMinKm: toNum(diam.estimated_diameter_min),
        diamMaxKm: toNum(diam.estimated_diameter_max),
        isHazardous: !!neo.is_potentially_hazardous_asteroid,
        nasaJplUrl: neo.nasa_jpl_url,
      };
    })
  );
}
