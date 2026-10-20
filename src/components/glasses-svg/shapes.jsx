/**
 * Reusable SVG glasses illustration set — 10 distinct frame-shape vector
 * line-art components. Each accepts a `tint` (frame color) and `className`
 * so the same shape can be recolored per-product without new artwork.
 * Rendered at viewBox 0 0 400 200 so they stay crisp at any render size —
 * from ~200px grid thumbnails up to 400px+ product-detail hero images.
 *
 * `sunglasses` prop (boolean): when true, lenses render as a solid tinted
 * fill (like real sunglasses) instead of a light outline-only lens, so
 * sunglasses products are instantly visually distinct from prescription
 * glasses in the same frame shape. Every shape explicitly draws:
 *   - two clear lens shapes (so each half unmistakably reads as a lens)
 *   - a visible bridge connecting the two lenses
 *   - temple arms extending out to both sides
 */

const DEFAULT_TINT = "#0b3d3e";

function Lens({ cx, cy, rx, ry, tint, shape = "ellipse", sunglasses = false }) {
  const fill = sunglasses ? `${tint}cc` : `${tint}22`;
  const strokeWidth = sunglasses ? 7 : 6;
  if (shape === "rect") {
    return (
      <rect
        x={cx - rx}
        y={cy - ry}
        width={rx * 2}
        height={ry * 2}
        rx={14}
        fill={fill}
        stroke={tint}
        strokeWidth={strokeWidth}
      />
    );
  }
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} stroke={tint} strokeWidth={strokeWidth} />;
}

/** Temple arms (the parts that go over the ears) — drawn on both sides,
 * angling outward/backward from the outer lens edge so every shape reads
 * as eyewear even before the lenses are recognized. */
function Temples({ tint, leftX = 30, rightX = 370, y = 90 }) {
  return (
    <>
      <path d={`M${leftX} ${y} Q${leftX - 24} ${y - 22} ${leftX - 2} ${y - 36}`} stroke={tint} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d={`M${rightX} ${y} Q${rightX + 24} ${y - 22} ${rightX + 2} ${y - 36}`} stroke={tint} strokeWidth="6" fill="none" strokeLinecap="round" />
    </>
  );
}

const wrap = (Component) => {
  return function Wrapped({ tint = DEFAULT_TINT, className, style, sunglasses = false }) {
    return (
      <svg
        viewBox="0 0 400 200"
        className={className}
        style={style}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={sunglasses ? "Sunglasses illustration" : "Eyeglasses illustration"}
      >
        <Component tint={tint} sunglasses={sunglasses} />
      </svg>
    );
  };
};

export const RoundGlasses = wrap(({ tint, sunglasses }) => (
  <g strokeLinecap="round">
    <path d="M140 100 H260" stroke={tint} strokeWidth="7" />
    <Temples tint={tint} leftX={38} rightX={362} y={100} />
    <Lens cx={100} cy={100} rx={64} ry={60} tint={tint} sunglasses={sunglasses} />
    <Lens cx={300} cy={100} rx={64} ry={60} tint={tint} sunglasses={sunglasses} />
  </g>
));

export const RectangleGlasses = wrap(({ tint, sunglasses }) => (
  <g strokeLinecap="round">
    <path d="M152 90 H248" stroke={tint} strokeWidth="7" />
    <Temples tint={tint} leftX={34} rightX={366} y={90} />
    <Lens cx={88} cy={90} rx={70} ry={44} tint={tint} shape="rect" sunglasses={sunglasses} />
    <Lens cx={312} cy={90} rx={70} ry={44} tint={tint} shape="rect" sunglasses={sunglasses} />
  </g>
));

export const CatEyeGlasses = wrap(({ tint, sunglasses }) => {
  const fill = sunglasses ? `${tint}cc` : `${tint}22`;
  const sw = sunglasses ? 7 : 6;
  return (
    <g strokeLinecap="round">
      <path d="M152 100 H248" stroke={tint} strokeWidth="7" />
      <Temples tint={tint} leftX={32} rightX={368} y={104} />
      <path
        d="M18 118 C14 72 54 44 102 48 C148 52 168 84 158 112 C148 140 112 150 74 146 C40 142 20 134 18 118 Z"
        fill={fill}
        stroke={tint}
        strokeWidth={sw}
      />
      <path
        d="M242 112 C232 84 252 52 298 48 C346 44 386 72 382 118 C380 134 360 142 326 146 C288 150 252 140 242 112 Z"
        fill={fill}
        stroke={tint}
        strokeWidth={sw}
      />
    </g>
  );
});

export const AviatorGlasses = wrap(({ tint, sunglasses }) => {
  const fill = sunglasses ? `${tint}cc` : `${tint}1f`;
  const sw = sunglasses ? 7 : 6;
  return (
    <g strokeLinecap="round">
      <path d="M150 76 L250 76" stroke={tint} strokeWidth="6" />
      <path d="M194 72 L206 72 L200 86 Z" fill={tint} />
      <Temples tint={tint} leftX={26} rightX={374} y={88} />
      <path
        d="M22 84 C22 62 56 54 94 58 C132 62 152 84 146 118 C140 150 102 162 68 154 C34 146 22 114 22 84 Z"
        fill={fill}
        stroke={tint}
        strokeWidth={sw}
      />
      <path
        d="M378 84 C378 62 344 54 306 58 C268 62 248 84 254 118 C260 150 298 162 332 154 C366 146 378 114 378 84 Z"
        fill={fill}
        stroke={tint}
        strokeWidth={sw}
      />
    </g>
  );
});

export const SquareGlasses = wrap(({ tint, sunglasses }) => (
  <g strokeLinecap="round">
    <path d="M150 88 H250" stroke={tint} strokeWidth="7" />
    <Temples tint={tint} leftX={30} rightX={370} y={88} />
    <Lens cx={88} cy={94} rx={62} ry={50} tint={tint} shape="rect" sunglasses={sunglasses} />
    <Lens cx={312} cy={94} rx={62} ry={50} tint={tint} shape="rect" sunglasses={sunglasses} />
  </g>
));

export const SportWrapGlasses = wrap(({ tint, sunglasses }) => {
  const fill = sunglasses ? `${tint}d9` : `${tint}26`;
  const sw = sunglasses ? 8 : 7;
  return (
    <g strokeLinecap="round">
      <Temples tint={tint} leftX={14} rightX={386} y={92} />
      <path
        d="M16 95 C16 54 80 36 200 36 C320 36 384 54 384 95 C384 140 320 158 200 158 C80 158 16 140 16 95 Z"
        fill={fill}
        stroke={tint}
        strokeWidth={sw}
      />
      {/* Bridge notch + lens-split line so the single wrap shield still
         reads as two connected lenses rather than one blank visor. */}
      <path d="M190 95 H210" stroke={tint} strokeWidth="6" />
      <path d="M198 50 L198 150" stroke={tint} strokeWidth="3" opacity="0.35" />
    </g>
  );
});

export const RimlessGlasses = wrap(({ tint, sunglasses }) => {
  const fill = sunglasses ? `${tint}99` : `${tint}14`;
  return (
    <g strokeLinecap="round">
      <path d="M150 96 H250" stroke={tint} strokeWidth="4" />
      <Temples tint={tint} leftX={36} rightX={364} y={96} />
      <ellipse cx={100} cy={96} rx={66} ry={52} fill={fill} stroke={tint} strokeWidth={sunglasses ? 5 : 3} />
      <ellipse cx={300} cy={96} rx={66} ry={52} fill={fill} stroke={tint} strokeWidth={sunglasses ? 5 : 3} />
      <circle cx={150} cy={96} r="3" fill={tint} />
      <circle cx={250} cy={96} r="3" fill={tint} />
    </g>
  );
});

export const ContactLensIcon = wrap(({ tint }) => (
  <g>
    <rect x={120} y={40} width={160} height={120} rx={14} fill="#ffffff" stroke={tint} strokeWidth="5" />
    <rect x={120} y={40} width={160} height={30} rx={10} fill={tint} />
    <circle cx={200} cy={112} r="34" fill={`${tint}22`} stroke={tint} strokeWidth="4" />
    <circle cx={200} cy={112} r="16" fill={`${tint}55`} />
  </g>
));

export const AccessoryIcon = wrap(({ tint }) => (
  <g strokeLinecap="round">
    <rect x={90} y={55} width={220} height={110} rx={22} fill={`${tint}18`} stroke={tint} strokeWidth="6" />
    <path d="M90 108 H310" stroke={tint} strokeWidth="4" />
    <circle cx={200} cy={80} r="8" fill={tint} />
  </g>
));

export const KidsRoundGlasses = wrap(({ tint, sunglasses }) => {
  const fill = sunglasses ? `${tint}cc` : `${tint}22`;
  return (
    <g strokeLinecap="round">
      <path d="M150 100 H250" stroke={tint} strokeWidth="7" />
      <Temples tint={tint} leftX={46} rightX={354} y={100} />
      <ellipse cx={105} cy={100} rx={58} ry={56} fill={fill} stroke={tint} strokeWidth="7" />
      <ellipse cx={295} cy={100} rx={58} ry={56} fill={fill} stroke={tint} strokeWidth="7" />
      <circle cx={85} cy={82} r="5" fill="#ffffff" opacity="0.7" />
      <circle cx={275} cy={82} r="5" fill="#ffffff" opacity="0.7" />
    </g>
  );
});

export const FRAME_SVG_MAP = {
  round: RoundGlasses,
  rectangle: RectangleGlasses,
  catEye: CatEyeGlasses,
  aviator: AviatorGlasses,
  square: SquareGlasses,
  sportWrap: SportWrapGlasses,
  rimless: RimlessGlasses,
  contactLens: ContactLensIcon,
  accessory: AccessoryIcon,
  kidsRound: KidsRoundGlasses,
};

export function getFrameSvgComponent(key) {
  return FRAME_SVG_MAP[key] || RoundGlasses;
}
