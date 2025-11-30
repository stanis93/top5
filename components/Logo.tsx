import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-0.5 select-none ${className}`}>
      {/* T */}
      <div className="transform -translate-y-[5px] translate-x-[15px]" title="Top 5 in Montenegro">
    <svg xmlns="http://www.w3.org/2000/svg"
     width="75" height="75"
     viewBox="0 0 768 768">

  <text x="145" y="520"
        font-family="Helvetica, Arial, sans-serif"
        font-weight="700"
        font-size="260"
        fill="currentColor">
    T
  </text>

  <text x="520" y="520"
        font-family="Helvetica, Arial, sans-serif"
        font-weight="700"
        font-size="260"
        fill="currentColor">
    P
  </text>

  <g transform="translate(45,-65)">
    <path
      d="
        M 324 316
        L 335 369
        L 279 374
        L 234 460
        L 247 516
        L 230 556
        L 271 559
        L 270 582
        L 250 579
        L 401 703
        L 393 622
        L 451 540
        L 497 533
        L 500 487
        L 531 479
        L 538 453
        L 436 395
        L 363 320
        Z"
      fill="#C70E2C"
      stroke="#D3C15C"
      strokeWidth="8"
    />
  </g>

  <text x="418" y="490"
        text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif"
        font-weight="700"
        font-size="210"
        fill="#D3C15C">
    5
  </text>

</svg>
</div>


    </div>
  );
};