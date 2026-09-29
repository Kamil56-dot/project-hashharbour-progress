import React from 'react';

/**
 * RedStandardContainerSVG — Photorealistic vector representation of the 
 * HashHarbour 40ft/20ft High Cube Red Standard Dry Container.
 * Features:
 * - 3D isometric perspective view (door end + long corrugated side wall + roof)
 * - Deep container red body with corrugated shadow/highlight ridge lines
 * - Front door end with 4 galvanized steel locking bars, handles, hinges & seals
 * - Official HashHarbour anchor emblem & '#HashHarbour' stencil lettering
 * - Authentic ISO markings: HHXU 784201 4, 45G1, Corten Steel, weight specs
 * - Heavy duty corner castings with twist-lock apertures
 * - Floor drop shadow for physical grounding
 */
export function RedStandardContainerSVG({ className = 'w-full h-auto drop-shadow-2xl' }) {
  // Generate 22 corrugated ridges along the side wall (from x=230 to x=690, dx=460)
  const ridgeCount = 22;
  const ridges = [];
  const startX = 230;
  const endX = 690;
  const dx = (endX - startX) / ridgeCount;

  for (let i = 0; i < ridgeCount; i++) {
    const x1 = startX + i * dx;
    const x2 = x1 + dx * 0.45;
    const x3 = x1 + dx * 0.9;
    
    // Line interpolation: y_top = 130 - t * 55, y_bot = 280 - t * 55
    const t1 = (x1 - startX) / 460;
    const t2 = (x2 - startX) / 460;
    const t3 = (x3 - startX) / 460;

    const y1Top = 130 - t1 * 55;
    const y1Bot = 280 - t1 * 55;
    const y2Top = 130 - t2 * 55;
    const y2Bot = 280 - t2 * 55;
    const y3Top = 130 - t3 * 55;
    const y3Bot = 280 - t3 * 55;

    ridges.push({
      id: i,
      highlight: `${x1},${y1Top} ${x2},${y2Top} ${x2},${y2Bot} ${x1},${y1Bot}`,
      shadow: `${x2},${y2Top} ${x3},${y3Top} ${x3},${y3Bot} ${x2},${y2Bot}`,
    });
  }

  return (
    <svg
      viewBox="0 0 780 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Red Standard Dry Intermodal Cargo Container"
    >
      <defs>
        {/* Soft Ambient Ground Shadow */}
        <radialGradient id="red-ground-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0B132B" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#0F172A" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
        </radialGradient>

        {/* Red container paint gradient for side */}
        <linearGradient id="red-side-grad" x1="230" y1="130" x2="690" y2="280" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D32F2F" />
          <stop offset="50%" stopColor="#C62828" />
          <stop offset="100%" stopColor="#B71C1C" />
        </linearGradient>

        {/* Red container paint gradient for door face */}
        <linearGradient id="red-door-grad" x1="70" y1="170" x2="230" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#B71C1C" />
          <stop offset="50%" stopColor="#C62828" />
          <stop offset="100%" stopColor="#D32F2F" />
        </linearGradient>

        {/* Roof gradient */}
        <linearGradient id="red-roof-grad" x1="380" y1="40" x2="380" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E53935" />
          <stop offset="50%" stopColor="#D32F2F" />
          <stop offset="100%" stopColor="#B71C1C" />
        </linearGradient>

        {/* Galvanized steel rod metallic gradient */}
        <linearGradient id="steel-rod-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="35%" stopColor="#F8FAFC" />
          <stop offset="70%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>

        {/* Corner casting dark metal */}
        <linearGradient id="corner-metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5B1010" />
          <stop offset="100%" stopColor="#300707" />
        </linearGradient>
      </defs>

      {/* 1. Floor Drop Shadow */}
      <ellipse cx="380" cy="295" rx="330" ry="24" fill="url(#red-ground-shadow)" />

      {/* 2. Top Roof Face (Axonometric polygon: 70,95 -> 230,130 -> 690,75 -> 530,40) */}
      <polygon
        points="70,95 230,130 690,75 530,40"
        fill="url(#red-roof-grad)"
        stroke="#8B1010"
        strokeWidth="1.5"
      />
      {/* Roof corrugation stripes */}
      {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((t, idx) => {
        const xA = 70 + t * (230 - 70);
        const yA = 95 + t * (130 - 95);
        const xB = 530 + t * (690 - 530);
        const yB = 40 + t * (75 - 40);
        return (
          <line
            key={idx}
            x1={xA}
            y1={yA}
            x2={xB}
            y2={yB}
            stroke="#EF5350"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
        );
      })}

      {/* 3. Long Side Corrugated Wall Base */}
      <polygon
        points="230,130 690,75 690,225 230,280"
        fill="url(#red-side-grad)"
        stroke="#8B1010"
        strokeWidth="1.5"
      />

      {/* Side Wall Ridges (Corrugation depth) */}
      {ridges.map(r => (
        <g key={r.id}>
          <polygon points={r.highlight} fill="#E53935" fillOpacity="0.32" />
          <polygon points={r.shadow} fill="#7F1010" fillOpacity="0.38" />
        </g>
      ))}

      {/* Side Top & Bottom Structural Steel Box Rails */}
      <polygon
        points="230,130 690,75 690,83 230,138"
        fill="#991B1B"
        stroke="#7F1010"
        strokeWidth="1"
      />
      <polygon
        points="230,272 690,217 690,225 230,280"
        fill="#7F1010"
        stroke="#5B0D0D"
        strokeWidth="1"
      />

      {/* Side Branding: Official HashHarbour Anchor Vector & Stencil Wordmark */}
      <g transform="matrix(0.966, -0.115, 0, 1, 320, 150)">
        {/* White Anchor Emblem */}
        <g transform="translate(0, 0) scale(0.095)">
          <path
            d="M 250 25 A 35 35 0 1 0 250 95 A 35 35 0 1 0 250 25 Z M 250 45 A 15 15 0 1 1 250 75 A 15 15 0 1 1 250 45 Z M 236 95 L 264 95 L 264 142 L 366 150 L 366 168 L 264 180 L 264 192 L 318 192 L 318 360 L 286 360 L 286 288 L 264 288 L 264 426 C 264 445 308 420 368 372 C 398 342 408 306 408 306 C 408 306 392 354 356 396 C 314 444 278 474 250 503 C 222 474 186 444 144 396 C 108 354 92 306 92 306 C 92 306 102 342 132 372 C 192 420 236 445 236 426 L 236 288 L 214 288 L 214 360 L 182 360 L 182 192 L 236 192 L 236 180 L 134 168 L 134 150 L 236 142 Z"
            fill="#FFFFFF"
            fillRule="evenodd"
          />
        </g>
        {/* #HashHarbour Brand Text */}
        <text
          x="56"
          y="35"
          fill="#FFFFFF"
          fontSize="24"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="1.5px"
        >
          #HashHarbour
        </text>
        <text
          x="58"
          y="50"
          fill="#FCA5A5"
          fontSize="8.5"
          fontWeight="700"
          fontFamily="monospace"
          letterSpacing="2.5px"
        >
          GLOBAL CONTAINER LOGISTICS
        </text>
      </g>

      {/* Side Technical Markings (Upper Right of Side) */}
      <g transform="matrix(0.966, -0.115, 0, 1, 565, 126)">
        <rect x="0" y="0" width="76" height="32" fill="#000000" fillOpacity="0.25" rx="2" />
        <text x="5" y="12" fill="#FFFFFF" fontSize="9" fontWeight="800" fontFamily="monospace">HHXU 784201 4</text>
        <text x="5" y="24" fill="#FDE047" fontSize="8" fontWeight="800" fontFamily="monospace">45G1 · HIGH CUBE</text>
      </g>

      {/* 4. Front Door End Base (70,95 -> 230,130 -> 230,280 -> 70,245) */}
      <polygon
        points="70,95 230,130 230,280 70,245"
        fill="url(#red-door-grad)"
        stroke="#5B0D0D"
        strokeWidth="2"
      />

      {/* Door Outer Rubber Seal Perimeter Gasket */}
      <polygon
        points="74,99 226,132 226,276 74,242"
        fill="none"
        stroke="#1E293B"
        strokeWidth="4"
      />

      {/* Door Split Line (Middle vertical seal at t=0.5 -> x=150) */}
      <line
        x1="150"
        y1="112.5"
        x2="150"
        y2="262.5"
        stroke="#0F172A"
        strokeWidth="3.5"
      />

      {/* Door Horizontal Pressed Panels */}
      {[0.25, 0.45, 0.65, 0.85].map((t, idx) => {
        const yL = 95 + t * (245 - 95);
        const yR = 130 + t * (280 - 130);
        return (
          <line
            key={idx}
            x1="76"
            y1={yL}
            x2="224"
            y2={yR}
            stroke="#991B1B"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
        );
      })}

      {/* 4 Vertical Steel Locking Bars (Galvanized Silver Rods) */}
      {/* Rod 1 & 2 on Left Door, Rod 3 & 4 on Right Door */}
      {[92, 128, 172, 208].map((rx, idx) => {
        const t = (rx - 70) / (230 - 70);
        const ryTop = 95 + t * 35;
        const ryBot = 245 + t * 35;

        return (
          <g key={idx}>
            {/* Lock Cam Top Bracket */}
            <rect
              x={rx - 4}
              y={ryTop + 4}
              width="8"
              height="10"
              fill="#475569"
              rx="1.5"
            />
            {/* The Solid Galvanized Rod */}
            <rect
              x={rx - 2.5}
              y={ryTop + 8}
              width="5"
              height={ryBot - ryTop - 16}
              fill="url(#steel-rod-grad)"
              stroke="#475569"
              strokeWidth="0.75"
              rx="1"
            />
            {/* Lock Cam Bottom Bracket */}
            <rect
              x={rx - 4}
              y={ryBot - 14}
              width="8"
              height="10"
              fill="#475569"
              rx="1.5"
            />
            {/* Center Lock Handle Lever */}
            <path
              d={`M ${rx - 2} ${ryTop + (ryBot - ryTop) * 0.62} L ${rx + 14} ${ryTop + (ryBot - ryTop) * 0.62 + 2} L ${rx + 14} ${ryTop + (ryBot - ryTop) * 0.62 + 6} L ${rx - 2} ${ryTop + (ryBot - ryTop) * 0.62 + 4} Z`}
              fill="#334155"
              stroke="#64748B"
              strokeWidth="0.5"
            />
          </g>
        );
      })}

      {/* Door Hinges (4 on far left edge, 4 on far right edge) */}
      {[0.12, 0.38, 0.64, 0.9].map((t, idx) => {
        const yLeft = 95 + t * 150;
        const yRight = 130 + t * 150;
        return (
          <g key={idx}>
            <rect x="68" y={yLeft - 5} width="6" height="10" fill="#334155" rx="1" />
            <rect x="226" y={yRight - 5} width="6" height="10" fill="#334155" rx="1" />
          </g>
        );
      })}

      {/* Door Markings & Warning Labels (Reference 3 Details) */}
      <g transform="matrix(0.976, 0.218, 0, 1, 80, 110)">
        {/* Yellow Caution Triangle */}
        <polygon points="40,28 32,42 48,42" fill="#EAB308" stroke="#CA8A04" strokeWidth="1" />
        <text x="36.5" y="39" fill="#000000" fontSize="5" fontWeight="900">!</text>

        {/* Door Serial & Classification */}
        <text x="56" y="24" fill="#FFFFFF" fontSize="6.5" fontWeight="900" fontFamily="monospace">HHXU 521551 2</text>
        <text x="56" y="32" fill="#FFFFFF" fontSize="6.5" fontWeight="900" fontFamily="monospace">42G1</text>

        {/* Technical Data Stencil Block */}
        <text x="56" y="44" fill="#E2E8F0" fontSize="4.5" fontWeight="700" fontFamily="monospace">MAX.GROSS  32,500 KG</text>
        <text x="56" y="50" fill="#E2E8F0" fontSize="4.5" fontWeight="700" fontFamily="monospace">TARE        3,980 KG</text>
        <text x="56" y="56" fill="#E2E8F0" fontSize="4.5" fontWeight="700" fontFamily="monospace">MAX.PAYLOAD 28,520 KG</text>
        <text x="56" y="62" fill="#E2E8F0" fontSize="4.5" fontWeight="700" fontFamily="monospace">CUBE        67.7 CU.M</text>
      </g>

      {/* 5. Heavy Duty Corner Castings (ISO Twist-lock Corners) */}
      {/* Front-Bottom-Left: (70, 245) */}
      <path
        d="M 66 238 L 76 240 L 76 252 L 66 250 Z"
        fill="url(#corner-metal)"
        stroke="#270505"
        strokeWidth="1"
      />
      <ellipse cx="71" cy="245" rx="2" ry="3.5" fill="#000000" />

      {/* Front-Bottom-Center: (230, 280) */}
      <path
        d="M 224 272 L 236 274 L 236 288 L 224 286 Z"
        fill="url(#corner-metal)"
        stroke="#270505"
        strokeWidth="1"
      />
      <ellipse cx="230" cy="280" rx="2.5" ry="4" fill="#000000" />

      {/* Back-Bottom-Right: (690, 225) */}
      <path
        d="M 686 218 L 696 217 L 696 228 L 686 229 Z"
        fill="url(#corner-metal)"
        stroke="#270505"
        strokeWidth="1"
      />
      <ellipse cx="691" cy="223" rx="2" ry="3" fill="#000000" />

      {/* Front-Top-Left: (70, 95) */}
      <path
        d="M 66 90 L 76 92 L 76 102 L 66 100 Z"
        fill="url(#corner-metal)"
        stroke="#270505"
        strokeWidth="1"
      />
      <ellipse cx="71" cy="96" rx="2" ry="3" fill="#000000" />

      {/* Front-Top-Center: (230, 130) */}
      <path
        d="M 224 122 L 236 124 L 236 136 L 224 134 Z"
        fill="url(#corner-metal)"
        stroke="#270505"
        strokeWidth="1"
      />
      <ellipse cx="230" cy="129" rx="2.5" ry="3.5" fill="#000000" />

      {/* Back-Top-Right: (690, 75) */}
      <path
        d="M 686 70 L 696 69 L 696 79 L 686 80 Z"
        fill="url(#corner-metal)"
        stroke="#270505"
        strokeWidth="1"
      />
      <ellipse cx="691" cy="74.5" rx="2" ry="2.5" fill="#000000" />

      {/* Back-Top-Left: (530, 40) */}
      <path
        d="M 526 36 L 536 37 L 536 46 L 526 45 Z"
        fill="url(#corner-metal)"
        stroke="#270505"
        strokeWidth="1"
      />
    </svg>
  );
}

/**
 * TankContainerSVG — Photorealistic vector representation of an ISO Tank Container.
 * Features:
 * - Stainless steel cylindrical tank vessel inside a blue structural ISO frame
 * - Top manhole dome & safety relief walkway
 * - End dish cap with liquid valves and discharge pipe
 */
export function TankContainerSVG({ className = 'w-full h-auto' }) {
  return (
    <svg
      viewBox="0 0 540 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="ISO Tank Container"
    >
      <defs>
        <radialGradient id="tank-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0B132B" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tank-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#E2E8F0" />
          <stop offset="70%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
        <linearGradient id="tank-frame-blue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="270" cy="280" rx="210" ry="18" fill="url(#tank-shadow)" />

      {/* Structural Blue Outer Box Frame (Rear Struts) */}
      <polygon points="60,90 180,120 460,70 340,40" stroke="url(#tank-frame-blue)" strokeWidth="8" fill="none" opacity="0.6" />
      <line x1="340" y1="40" x2="340" y2="190" stroke="url(#tank-frame-blue)" strokeWidth="8" opacity="0.6" />
      <line x1="460" y1="70" x2="460" y2="220" stroke="url(#tank-frame-blue)" strokeWidth="8" opacity="0.6" />

      {/* Cylindrical Stainless Steel Tank */}
      <g transform="translate(40, 20)">
        {/* Main Tank Barrel */}
        <path
          d="M 100,105 L 380,55 C 410,55 430,85 430,125 C 430,165 410,195 380,195 L 100,245 Z"
          fill="url(#tank-body)"
          stroke="#94A3B8"
          strokeWidth="2"
        />
        {/* Front Elliptical End Cap */}
        <ellipse cx="100" cy="175" rx="45" ry="70" fill="#E2E8F0" stroke="#64748B" strokeWidth="2.5" />
        <ellipse cx="100" cy="175" rx="35" ry="55" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
        {/* Discharge Valve Assembly */}
        <circle cx="100" cy="175" r="14" fill="#334155" stroke="#64748B" strokeWidth="2" />
        <circle cx="100" cy="175" r="6" fill="#94A3B8" />

        {/* Reinforcement Rings / Tank Bands */}
        {[170, 240, 310].map((bx, idx) => {
          const by = 175 - ((bx - 100) * 0.18);
          return (
            <ellipse
              key={idx}
              cx={bx}
              cy={by}
              rx="12"
              ry="65"
              fill="none"
              stroke="#0284C7"
              strokeWidth="4"
              opacity="0.85"
            />
          );
        })}

        {/* Top Manhole Dome & Spill Box */}
        <polygon points="220,70 270,61 270,76 220,85" fill="#334155" />
        <ellipse cx="245" cy="65" rx="18" ry="7" fill="#64748B" stroke="#94A3B8" strokeWidth="1.5" />

        {/* Hazard Class Label & HashHarbour Tank Decal */}
        <rect x="180" y="145" width="45" height="24" fill="#FFFFFF" rx="2" stroke="#CBD5E1" />
        <text x="186" y="157" fill="#0F172A" fontSize="7" fontWeight="900" fontFamily="sans-serif">ISO TANK</text>
        <text x="186" y="165" fill="#2563EB" fontSize="6" fontWeight="800" fontFamily="monospace">HH-T2600</text>
      </g>

      {/* Front Outer Frame Struts (Enclosing the Tank) */}
      <polygon points="60,90 180,120 180,270 60,240" stroke="url(#tank-frame-blue)" strokeWidth="10" fill="none" />
      <polygon points="180,120 460,70 460,220 180,270" stroke="url(#tank-frame-blue)" strokeWidth="10" fill="none" />
      {/* Corner diagonal supports */}
      <line x1="60" y1="90" x2="100" y2="135" stroke="url(#tank-frame-blue)" strokeWidth="6" />
      <line x1="180" y1="120" x2="140" y2="165" stroke="url(#tank-frame-blue)" strokeWidth="6" />
      <line x1="60" y1="240" x2="100" y2="195" stroke="url(#tank-frame-blue)" strokeWidth="6" />
      <line x1="180" y1="270" x2="140" y2="225" stroke="url(#tank-frame-blue)" strokeWidth="6" />
    </svg>
  );
}

/**
 * ReeferContainerSVG — Photorealistic vector representation of a 
 * Refrigerated (Reefer) Intermodal Container.
 * Features:
 * - Clean insulated cool-white container body with subtle corrugated ribs
 * - Front integrated refrigeration unit with intake ventilation grill & fan vents
 * - Digital thermal microprocessor display & power cabling box
 */
export function ReeferContainerSVG({ className = 'w-full h-auto' }) {
  return (
    <svg
      viewBox="0 0 600 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Refrigerated Reefer Container"
    >
      <defs>
        <radialGradient id="reefer-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0B132B" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="reefer-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
        <linearGradient id="reefer-unit-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="50%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="300" cy="275" rx="240" ry="20" fill="url(#reefer-shadow)" />

      {/* Top Roof Face */}
      <polygon points="80,85 210,115 520,65 390,35" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />

      {/* Long Side Insulated Wall */}
      <polygon points="210,115 520,65 520,215 210,265" fill="url(#reefer-body-grad)" stroke="#CBD5E1" strokeWidth="2" />
      {/* Light side corrugation lines */}
      {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((t, idx) => {
        const xT = 210 + t * 310;
        const yT = 115 - t * 50;
        const xB = xT;
        const yB = 265 - t * 50;
        return (
          <line key={idx} x1={xT} y1={yT} x2={xB} y2={yB} stroke="#94A3B8" strokeWidth="1.5" strokeOpacity="0.4" />
        );
      })}

      {/* Side HashHarbour Reefer Decal */}
      <g transform="matrix(0.987, -0.16, 0, 1, 300, 140)">
        <text x="0" y="0" fill="#0284C7" fontSize="16" fontWeight="900" fontFamily="sans-serif">#HashHarbour</text>
        <text x="0" y="14" fill="#0369A1" fontSize="8" fontWeight="800" fontFamily="monospace">REEFER COLD-CHAIN</text>
        <rect x="0" y="22" width="60" height="14" fill="#E0F2FE" rx="2" />
        <text x="5" y="32" fill="#0369A1" fontSize="7" fontWeight="700">TEMP: -30°C to +30°C</text>
      </g>

      {/* Front Refrigeration Compressor Unit Face */}
      <polygon points="80,85 210,115 210,265 80,235" fill="url(#reefer-unit-grad)" stroke="#0F172A" strokeWidth="2" />

      {/* Compressor Vents / Ventilation Grille */}
      <g transform="translate(10, 10)">
        <rect x="85" y="100" width="95" height="55" fill="#0F172A" rx="4" stroke="#475569" strokeWidth="1" />
        {/* Two Cooling Fan Grilles */}
        <circle cx="112" cy="127" r="18" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
        <circle cx="152" cy="127" r="18" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
        <circle cx="112" cy="127" r="6" fill="#94A3B8" />
        <circle cx="152" cy="127" r="6" fill="#94A3B8" />

        {/* Lower Intake Louvers */}
        <rect x="85" y="165" width="95" height="40" fill="#1E293B" rx="3" />
        {[172, 178, 184, 190, 196].map((ly, idx) => (
          <line key={idx} x1="90" y1={ly} x2="175" y2={ly} stroke="#0284C7" strokeWidth="1.5" strokeOpacity="0.8" />
        ))}

        {/* Microprocessor Display Panel */}
        <rect x="85" y="80" width="40" height="16" fill="#0284C7" rx="2" />
        <text x="90" y="92" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="monospace">-24.0°C</text>
      </g>

      {/* Corner Castings */}
      <polygon points="76,80 84,82 84,92 76,90" fill="#334155" />
      <polygon points="206,110 214,112 214,122 206,120" fill="#334155" />
      <polygon points="76,230 84,232 84,242 76,240" fill="#334155" />
      <polygon points="206,260 214,262 214,272 206,270" fill="#334155" />
    </svg>
  );
}

/**
 * OpenTopContainerSVG — Vector representation of Open Top Container
 */
export function OpenTopContainerSVG({ className = 'w-full h-auto' }) {
  return (
    <svg viewBox="0 0 600 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Open Top Container">
      <ellipse cx="300" cy="275" rx="240" ry="20" fill="#0B132B" fillOpacity="0.3" />
      {/* Heavy Tarpaulin Roof */}
      <polygon points="80,85 210,115 520,65 390,35" fill="#15803D" stroke="#166534" strokeWidth="2" />
      {/* Tarpaulin lashing eyelets */}
      {[0.2, 0.4, 0.6, 0.8].map((t, i) => (
        <circle key={i} cx={210 + t * 310} cy={115 - t * 50} r="3" fill="#FACC15" />
      ))}
      {/* Side Wall */}
      <polygon points="210,115 520,65 520,215 210,265" fill="#166534" stroke="#14532D" strokeWidth="2" />
      <polygon points="80,85 210,115 210,265 80,235" fill="#14532D" stroke="#052E16" strokeWidth="2" />
      <text x="320" y="165" fill="#FFFFFF" fontSize="20" fontWeight="900" fontFamily="sans-serif">#HashHarbour</text>
      <text x="322" y="185" fill="#86EFAC" fontSize="10" fontWeight="bold">OPEN TOP OVERSIZED</text>
    </svg>
  );
}

/**
 * FlatRackContainerSVG — Vector representation of Flat Rack Container
 */
export function FlatRackContainerSVG({ className = 'w-full h-auto' }) {
  return (
    <svg viewBox="0 0 600 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Flat Rack Container">
      <ellipse cx="300" cy="275" rx="240" ry="20" fill="#0B132B" fillOpacity="0.3" />
      {/* Heavy Duty Bed */}
      <polygon points="210,210 520,160 520,225 210,275" fill="#D97706" stroke="#B45309" strokeWidth="2" />
      <polygon points="80,180 210,210 210,275 80,245" fill="#B45309" stroke="#92400E" strokeWidth="2" />
      {/* Front Folding End Wall */}
      <polygon points="80,100 210,130 210,210 80,180" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
      {/* Rear Folding End Wall */}
      <polygon points="390,50 520,80 520,160 390,130" fill="#D97706" stroke="#B45309" strokeWidth="2" opacity="0.8" />
      <text x="100" y="160" fill="#FFFFFF" fontSize="12" fontWeight="900">FLAT RACK</text>
      <text x="260" y="248" fill="#FFFFFF" fontSize="16" fontWeight="900">#HashHarbour HEAVY LIFT</text>
    </svg>
  );
}
