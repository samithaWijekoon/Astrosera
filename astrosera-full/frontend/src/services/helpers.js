export function flattenFeed(feedData) {
  if (!feedData?.near_earth_objects) return [];
  const result = [];
  for (const [, list] of Object.entries(feedData.near_earth_objects)) {
    for (const neo of list) {
      const approach = neo.close_approach_data?.[0];
      if (!approach) continue;
      result.push({
        id:           neo.id,
        name:         neo.name,
        nasaJplUrl:   neo.nasa_jpl_url,
        isHazardous:  neo.is_potentially_hazardous_asteroid,
        approachDate: approach.close_approach_date,
        approachFull: approach.close_approach_date_full,
        missDistKm:   parseFloat(approach.miss_distance.kilometers),
        missDistLunar:parseFloat(approach.miss_distance.lunar),
        velocityKph:  parseFloat(approach.relative_velocity.kilometers_per_hour),
        diamMinKm:    neo.estimated_diameter.kilometers.estimated_diameter_min,
        diamMaxKm:    neo.estimated_diameter.kilometers.estimated_diameter_max,
      });
    }
  }
  return result.sort((a, b) => new Date(a.approachDate) - new Date(b.approachDate));
}

export function threatLevel(neo) {
  if (neo.isHazardous && neo.missDistLunar < 10)  return { label: 'CRITICAL', color: '#ef4444' };
  if (neo.isHazardous && neo.missDistLunar < 30)  return { label: 'HIGH',     color: '#f97316' };
  if (neo.isHazardous)                             return { label: 'ELEVATED', color: '#eab308' };
  return                                                  { label: 'NOMINAL',  color: '#22c55e' };
}

export function fmtKm(km) {
  if (km >= 1e6) return (km / 1e6).toFixed(2) + ' M km';
  if (km >= 1e3) return (km / 1e3).toFixed(1) + ' k km';
  return km.toFixed(0) + ' km';
}

export function fmtDiam(min, max) {
  const avg = (min + max) / 2;
  if (avg < 1) return (avg * 1000).toFixed(0) + ' m';
  return avg.toFixed(2) + ' km';
}

export function relativeSize(diamKm) {
  return Math.min(diamKm / 2, 1);
}
