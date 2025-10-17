import * as React from "react";

const HeroBackgroundSVG = (props) => (
  <svg 
    viewBox="0 0 1000 563" 
    xmlns="http://www.w3.org/2000/svg" 
    className="absolute inset-0 w-full h-full z-0"
    preserveAspectRatio="xMidYMid slice"
    {...props}
  >
    <defs>
      <filter
        id="b"
        x={-500}
        y={-281.5}
        width={2000}
        height={1126}
        filterUnits="userSpaceOnUse"
      >
        <feGaussianBlur in="SourceGraphic" stdDeviation={70} />
      </filter>
      <filter
        id="a"
        x={-500}
        y={-281.5}
        width={2000}
        height={1126}
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodColor="#fff" result="neutral-gray" />
        <feTurbulence
          type="fractalNoise"
          baseFrequency={2.5}
          numOctaves={100}
          stitchTiles="stitch"
          result="noise"
        />
        <feColorMatrix
          in="noise"
          type="saturate"
          values={0}
          result="destaturatedNoise"
        />
        <feComponentTransfer in="destaturatedNoise" result="theNoise">
          <feFuncA type="table" tableValues="0 0 0.1 0" />
        </feComponentTransfer>
        <feBlend
          in="SourceGraphic"
          in2="theNoise"
          mode="soft-light"
          result="noisy-image"
        />
      </filter>
      <radialGradient id="c" cx="50%" cy="50%" r="50%" fx="50%" fy="29%">
        <stop offset="0%" stopColor="#006aff" />
        <stop offset="100%" stopColor="rgba(0,106,255,0.2)" />
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="#fff" />
    <g filter="url(#a)">
      <g filter="url(#b)">
        <svg
          width={1000}
          height={1000}
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
          transform="translate(-32.279 85.69)"
        >
          <path
            fill="url(#c)"
            d="M399 328q-59 78-165.5 106.5t-167-78Q6 250 88.5 181.5T254 106q83-7 143.5 68.5T399 328Z"
          />
        </svg>
      </g>
    </g>
    <svg
      width={500}
      height={90.312}
      viewBox="0 0 1218 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      transform="translate(250 236.344)"
    />
  </svg>
);

export default HeroBackgroundSVG;
