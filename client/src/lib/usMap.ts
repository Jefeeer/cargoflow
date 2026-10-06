// ============================================================
// Dot-matrix map of the contiguous United States.
// A hand-simplified outline (lon/lat) is projected, then filled
// with a hex grid of dots. Accuracy is "recognisable at a glance",
// which is all a dot map needs.
// ============================================================

type LonLat = readonly [number, number];
export type Point = readonly [number, number];

const OUTLINE: LonLat[] = [
  // Pacific Northwest → northern border
  [-124.7, 48.4], [-123.2, 48.2], [-122.8, 49.0], [-95.15, 49.0], [-94.8, 49.35], [-93.5, 48.6],
  [-92.0, 48.3], [-90.0, 48.1], [-89.6, 48.0],
  // Lake Superior north shore back to Duluth, then the south shore east
  [-92.1, 46.75], [-90.5, 46.6], [-88.5, 47.0], [-88.0, 47.4], [-87.4, 46.5], [-86.0, 46.6], [-84.5, 46.45],
  // Upper Peninsula → Lake Huron shore of the Lower Peninsula
  [-83.6, 46.0], [-84.6, 45.75], [-83.4, 45.05], [-83.3, 44.3], [-83.9, 43.75], [-82.9, 44.05],
  [-82.5, 43.6], [-82.4, 43.0], [-82.5, 42.6], [-83.1, 42.1], [-83.4, 41.7],
  // Lake Erie & Lake Ontario south shores, St. Lawrence
  [-82.7, 41.45], [-81.7, 41.5], [-80.5, 41.95], [-79.0, 42.75], [-79.05, 43.25], [-78.0, 43.35],
  [-76.6, 43.45], [-76.2, 43.55], [-76.3, 44.2], [-75.3, 44.85], [-74.7, 45.0],
  // New England & Maine
  [-71.5, 45.0], [-71.1, 45.3], [-70.7, 45.4], [-70.0, 46.7], [-69.2, 47.45], [-68.3, 47.35],
  [-67.8, 47.05], [-67.8, 45.7], [-67.4, 45.2], [-67.0, 44.8],
  // Atlantic coast
  [-68.8, 44.3], [-70.2, 43.6], [-70.8, 42.6], [-70.0, 41.8], [-71.4, 41.4], [-73.8, 40.6],
  [-74.0, 39.6], [-74.9, 38.9], [-75.5, 38.4], [-76.0, 37.0], [-75.5, 35.2], [-76.7, 34.7],
  [-78.0, 33.9], [-79.2, 33.2], [-80.9, 32.0], [-81.4, 30.6], [-81.0, 29.2], [-80.5, 28.0],
  [-80.0, 26.7], [-80.1, 25.8], [-80.4, 25.2],
  // Florida Gulf coast → Texas
  [-81.1, 25.1], [-81.8, 26.1], [-82.6, 27.5], [-82.8, 28.9], [-83.6, 29.9], [-84.4, 30.0],
  [-85.4, 29.7], [-86.5, 30.4], [-88.0, 30.6], [-89.6, 30.2], [-89.4, 29.0], [-90.5, 29.1],
  [-91.8, 29.5], [-93.8, 29.7], [-94.8, 29.3], [-96.5, 28.3], [-97.4, 27.3], [-97.2, 25.9],
  // Rio Grande & the Mexican border
  [-99.5, 27.5], [-101.0, 29.6], [-102.4, 29.8], [-103.2, 29.0], [-104.5, 29.7], [-106.5, 31.8],
  [-108.2, 31.8], [-108.2, 31.3], [-111.1, 31.3], [-114.8, 32.5], [-117.1, 32.5],
  // Pacific coast
  [-118.5, 34.0], [-120.6, 34.6], [-121.9, 36.6], [-122.5, 37.8], [-123.8, 39.8], [-124.4, 40.4],
  [-124.2, 42.0], [-124.0, 46.2],
];

/** Lake Michigan, cut out of the land mass. */
const LAKE_MICHIGAN: LonLat[] = [
  [-87.55, 41.65], [-86.9, 41.65], [-86.25, 42.3], [-86.2, 43.0], [-86.5, 43.7], [-86.25, 44.6],
  [-85.5, 45.2], [-84.9, 45.75], [-85.6, 45.95], [-86.6, 45.85], [-87.3, 45.2], [-87.75, 44.6],
  [-87.75, 43.4], [-87.85, 42.5],
];

// Equirectangular projection, x scaled by cos(38°) so the country isn't stretched.
const LON0 = -125.2;
const LAT0 = 49.8;
const K = 19;
const XSCALE = Math.cos((38 * Math.PI) / 180);

export const MAP_WIDTH = Math.round((LON0 * -1 - 66.5) * XSCALE * K);
export const MAP_HEIGHT = Math.round((LAT0 - 24.2) * K);

export function project([lon, lat]: LonLat): Point {
  return [(lon - LON0) * XSCALE * K, (LAT0 - lat) * K];
}

function inside([x, y]: Point, poly: Point[]): boolean {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

/** Builds a single SVG path of zero-length segments; render with round caps to get dots. */
export function buildDotPath(spacing = 10.5): string {
  const land = OUTLINE.map(project);
  const lake = LAKE_MICHIGAN.map(project);
  const rowH = spacing * 0.866;
  let d = '';
  for (let row = 0, y = rowH / 2; y < MAP_HEIGHT; row++, y += rowH) {
    const offset = row % 2 ? spacing / 2 : 0;
    for (let x = spacing / 2 + offset; x < MAP_WIDTH; x += spacing) {
      const p: Point = [x, y];
      if (inside(p, land) && !inside(p, lake)) d += `M${x.toFixed(1)} ${y.toFixed(1)}h0`;
    }
  }
  return d;
}

export interface MapCity {
  code: string;
  name: string;
  lonLat: LonLat;
  /** Label placement relative to the marker. */
  anchor?: 'start' | 'end';
}

export const HUB: MapCity = { code: 'MIA', name: 'Miami', lonLat: [-80.19, 25.77] };

/** Illustrative destinations — representative of national reach, not a list of service locations. */
export const DESTINATIONS: MapCity[] = [
  { code: 'ATL', name: 'Atlanta', lonLat: [-84.39, 33.75], anchor: 'end' },
  { code: 'CLT', name: 'Charlotte', lonLat: [-80.84, 35.23] },
  { code: 'NYC', name: 'New York', lonLat: [-74.0, 40.71] },
  { code: 'CHI', name: 'Chicago', lonLat: [-87.63, 41.88], anchor: 'end' },
  { code: 'DFW', name: 'Dallas', lonLat: [-97.04, 32.9], anchor: 'end' },
  { code: 'HOU', name: 'Houston', lonLat: [-95.37, 29.76], anchor: 'end' },
  { code: 'DEN', name: 'Denver', lonLat: [-104.99, 39.74], anchor: 'end' },
  { code: 'PHX', name: 'Phoenix', lonLat: [-112.07, 33.45], anchor: 'end' },
  { code: 'LAX', name: 'Los Angeles', lonLat: [-118.24, 34.05], anchor: 'end' },
  { code: 'SEA', name: 'Seattle', lonLat: [-122.33, 47.61], anchor: 'end' },
];

/** Quadratic route from the hub, bowed to the north-west so arcs fan out rather than overlap. */
export function routePath(to: MapCity): string {
  const [x1, y1] = project(HUB.lonLat);
  const [x2, y2] = project(to.lonLat);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  // Perpendicular, flipped so the bow always points "up" (negative y).
  let nx = -dy / len;
  let ny = dx / len;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const bow = len * 0.13;
  const cx = (x1 + x2) / 2 + nx * bow;
  const cy = (y1 + y2) / 2 + ny * bow;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}
