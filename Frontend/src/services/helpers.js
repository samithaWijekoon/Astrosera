export function flattenFeed(feedData) {
  const neosByDate = feedData.near_earth_objects || {};
  const all = [];
  for (const [date, neos] of Object.entries(neosByDate)) {
    for (const neo of neos) {
      const approach = neo.close_approach_data?.[0];
      all.push({
        id: neo.id,
        name: neo.name,
        isHazardous: neo.is_potentially_hazardous_asteroid,
        isSentryObject: neo.is_sentry_object,
        approachDate: approach?.close_approach_date || date,
        approachTime: approach?.close_approach_date_full || '',
        missDistKm: parseFloat(approach?.miss_distance?.kilometers || 0),
        missDistLunar: parseFloat(approach?.miss_distance?.lunar || 0),
        velocityKph: parseFloat(approach?.relative_velocity?.kilometers_per_hour || 0),
        orbitingBody: approach?.orbiting_body || 'Earth',
        diamMinKm: neo.estimated_diameter?.kilometers?.estimated_diameter_min || 0,
        diamMaxKm: neo.estimated_diameter?.kilometers?.estimated_diameter_max || 0,
        absoluteMagnitude: neo.absolute_magnitude_h,
        nasaUrl: neo.nasa_jpl_url,
        links: neo.links,
      });
    }
  }
  // Sort by approach date then by miss distance
  return all.sort((a, b) => {
    const dateD = new Date(a.approachDate) - new Date(b.approachDate);
    return dateD !== 0 ? dateD : a.missDistKm - b.missDistKm;
  });
}

export function threatLevel(neo) {
  if (neo.isHazardous && neo.missDistLunar < 5)  return { level: 4, label: 'CRITICAL', color: '#ff2222' };
  if (neo.isHazardous && neo.missDistLunar < 20) return { level: 3, label: 'HIGH',     color: '#ff6600' };
  if (neo.isHazardous)                            return { level: 2, label: 'ELEVATED', color: '#f5a623' };
  return { level: 1, label: 'NOMINAL', color: '#4caf82' };
}

export function fmtKm(km) {
  if (km >= 1e6) return (km / 1e6).toFixed(2) + 'M km';
  if (km >= 1e3) return (km / 1e3).toFixed(0) + 'K km';
  return km.toFixed(0) + ' km';
}

export function fmtDiam(minKm, maxKm) {
  const toM = v => (v * 1000).toFixed(0);
  if (maxKm < 0.5) return `${toM(minKm)}–${toM(maxKm)} m`;
  return `${minKm.toFixed(3)}–${maxKm.toFixed(3)} km`;
}

export function relativeSize(diamMaxKm) {
  // Returns a 0–1 scale relative to 10km (extinction-level)
  return Math.min(diamMaxKm / 10, 1);
}
