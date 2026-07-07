import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, '..', '..', 'public', 'images', 'sponsors');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const sponsors = [
  { file: 'acme_ventures.svg', name: 'ACME', sub: 'VENTURES', color: '#C99E25', icon: 'triangle' },
  { file: 'global_tech_corp.svg', name: 'GLOBAL', sub: 'TECH CORP', color: '#1E40AF', icon: 'globe' },
  { file: 'apex_group.svg', name: 'APEX', sub: 'GROUP', color: '#047857', icon: 'mountain' },
  { file: 'credence_pay.svg', name: 'CREDENCE', sub: 'PAY', color: '#B91C1C', icon: 'shield' },
  { file: 'summit_works.svg', name: 'SUMMIT', sub: 'WORKS', color: '#6B21A8', icon: 'hexagon' },
  { file: 'nexus_connect.svg', name: 'NEXUS', sub: 'CONNECT', color: '#0369A1', icon: 'nodes' },
  { file: 'cloud_host.svg', name: 'CLOUD', sub: 'HOST', color: '#2563EB', icon: 'cloud' },
  { file: 'scale_dev.svg', name: 'SCALE', sub: 'DEV', color: '#D97706', icon: 'arrow-up' },
  { file: 'database_inc.svg', name: 'DATABASE', sub: 'INC', color: '#4B5563', icon: 'database' },
  { file: 'business_standard.svg', name: 'BUSINESS', sub: 'STANDARD', color: '#DC2626', icon: 'newspaper' },
  { file: 'startup_news.svg', name: 'STARTUP', sub: 'NEWS', color: '#059669', icon: 'bolt' },
  { file: 'tech_dispatch.svg', name: 'TECH', sub: 'DISPATCH', color: '#7C3AED', icon: 'message' },
  { file: 'founders_circle.svg', name: 'FOUNDERS', sub: 'CIRCLE', color: '#DB2777', icon: 'circle-dots' },
  { file: 'growth_labs.svg', name: 'GROWTH', sub: 'LABS', color: '#0891B2', icon: 'flask' },
  { file: 'venture_studio.svg', name: 'VENTURE', sub: 'STUDIO', color: '#EA580C', icon: 'rocket' },
  { file: 'community_hub.svg', name: 'COMMUNITY', sub: 'HUB', color: '#4F46E5', icon: 'users' },
  { file: 'delta_solutions.svg', name: 'DELTA', sub: 'SOLUTIONS', color: '#15803D', icon: 'delta' },
  { file: 'apex_legal.svg', name: 'APEX', sub: 'LEGAL', color: '#9A3412', icon: 'gavel' }
];

const getIconPath = (type, color) => {
  switch (type) {
    case 'triangle':
      return `<path d="M15 5 L5 25 L25 25 Z" fill="${color}" />`;
    case 'globe':
      return `<circle cx="15" cy="15" r="10" stroke="${color}" stroke-width="2" fill="none" />
              <path d="M5 15 H25 M15 5 A10 10 0 0 0 15 25 A10 10 0 0 0 15 5" stroke="${color}" stroke-width="1.5" fill="none" />`;
    case 'mountain':
      return `<path d="M6 25 L15 10 L24 25 Z" fill="${color}" opacity="0.8" />
              <path d="M12 25 L18 16 L24 25 Z" fill="${color}" />`;
    case 'shield':
      return `<path d="M15 5 L25 9 V17 C25 22 21 26 15 28 C9 26 5 22 5 17 V9 Z" fill="${color}" />`;
    case 'hexagon':
      return `<path d="M15 5 L24 10 V20 L15 25 L6 20 V10 Z" fill="${color}" />`;
    case 'nodes':
      return `<circle cx="15" cy="8" r="3" fill="${color}" />
              <circle cx="9" cy="20" r="3" fill="${color}" />
              <circle cx="21" cy="20" r="3" fill="${color}" />
              <line x1="15" y1="8" x2="9" y2="20" stroke="${color}" stroke-width="2" />
              <line x1="15" y1="8" x2="21" y2="20" stroke="${color}" stroke-width="2" />
              <line x1="9" y1="20" x2="21" y2="20" stroke="${color}" stroke-width="2" />`;
    case 'cloud':
      return `<path d="M9 20 A5 5 0 0 1 9 10 A7 7 0 0 1 21 12 A4 4 0 0 1 21 20 Z" fill="${color}" />`;
    case 'arrow-up':
      return `<path d="M15 5 L25 15 H19 V25 H11 V15 H5 Z" fill="${color}" />`;
    case 'database':
      return `<ellipse cx="15" cy="8" rx="8" ry="3" fill="${color}" />
              <path d="M7 8 V14 C7 16 11 17 15 17 C19 17 23 16 23 14 V8" fill="${color}" opacity="0.8" />
              <path d="M7 14 V20 C7 22 11 23 15 23 C19 23 23 22 23 20 V14" fill="${color}" />`;
    case 'newspaper':
      return `<rect x="5" y="6" width="20" height="18" rx="2" fill="${color}" />
              <line x1="9" y1="11" x2="21" y2="11" stroke="#FFF" stroke-width="2" />
              <line x1="9" y1="15" x2="21" y2="15" stroke="#FFF" stroke-width="2" />
              <line x1="9" y1="19" x2="17" y2="19" stroke="#FFF" stroke-width="2" />`;
    case 'bolt':
      return `<path d="M17 5 L7 14 H14 L11 25 L21 16 H14 Z" fill="${color}" />`;
    case 'message':
      return `<path d="M5 6 H25 V20 H12 L6 25 V20 H5 Z" fill="${color}" />`;
    case 'circle-dots':
      return `<circle cx="15" cy="15" r="9" stroke="${color}" stroke-width="2" fill="none" />
              <circle cx="15" cy="15" r="3" fill="${color}" />`;
    case 'flask':
      return `<path d="M11 6 H19 V9 L24 20 A3 3 0 0 1 21 24 H9 A3 3 0 0 1 6 20 L11 9 Z" fill="${color}" />`;
    case 'rocket':
      return `<path d="M15 5 C15 5 19 12 19 16 V22 L15 25 L11 22 V16 C11 12 15 5 15 5 Z" fill="${color}" />
              <path d="M11 18 L7 21 V23 L11 22 Z" fill="${color}" opacity="0.8" />
              <path d="M19 18 L23 21 V23 L19 22 Z" fill="${color}" opacity="0.8" />`;
    case 'users':
      return `<circle cx="11" cy="9" r="4" fill="${color}" />
              <path d="M5 21 C5 17 9 15 11 15 C13 15 17 17 17 21 Z" fill="${color}" />
              <circle cx="18" cy="11" r="3" fill="${color}" opacity="0.8" />
              <path d="M15 21 C15 18 17 17 19 17 C21 17 23 18 23 21 Z" fill="${color}" opacity="0.8" />`;
    case 'delta':
      return `<path d="M15 5 L5 23 H25 Z" stroke="${color}" stroke-width="3" fill="none" />`;
    case 'gavel':
      return `<path d="M6 10 L14 6 L18 10 L10 14 Z" fill="${color}" />
              <line x1="10" y1="10" x2="20" y2="20" stroke="${color}" stroke-width="3" />
              <rect x="14" y="21" width="8" height="3" rx="1" fill="${color}" />`;
    default:
      return `<circle cx="15" cy="15" r="8" fill="${color}" />`;
  }
};

sponsors.forEach(s => {
  const isLarge = s.file.includes('acme') || s.file.includes('global') || s.file.includes('apex') || s.file.includes('credence');
  const width = isLarge ? 240 : 160;
  const height = isLarge ? 108 : 72;

  // Let's use minimal border margins to maximize visual size inside viewBox
  const xOffset = isLarge ? 12 : 8;
  const yOffset = isLarge ? 24 : 16;
  const iconScale = isLarge ? 1.7 : 1.35;
  const textX = isLarge ? 80 : 54;
  const textY = isLarge ? 56 : 38;

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#FFFFFF" />
  <g>
    <!-- Icon -->
    <g transform="translate(${xOffset}, ${yOffset}) scale(${iconScale})">
      ${getIconPath(s.icon, s.color)}
    </g>
    <!-- Text -->
    <text x="${textX}" y="${textY}" font-family="system-ui, -apple-system, sans-serif" font-size="${isLarge ? '24' : '17.5'}" font-weight="900" fill="#1A202C" letter-spacing="-0.3">${s.name}</text>
    <text x="${textX}" y="${textY + (isLarge ? 18 : 13)}" font-family="system-ui, -apple-system, sans-serif" font-size="${isLarge ? '12.5' : '9.5'}" font-weight="800" fill="#718096" letter-spacing="1.5">${s.sub}</text>
  </g>
</svg>`;

  fs.writeFileSync(path.join(targetDir, s.file), svgContent);
});

console.log('Successfully regenerated 18 sponsor logos with maximized sizing.');
