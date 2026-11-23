<script setup lang="ts">
const props = defineProps<{ slug: string }>();

type Scene = 'rickhouse' | 'pour' | 'dusk' | 'still';

interface Variant {
  scene: Scene;
  bgFrom: string;
  bgTo: string;
  glow: string;
  glowX: number;
  glowY: number;
  stars: [number, number, number][];
}

const variants: Variant[] = [
  { scene: 'rickhouse', bgFrom: '#2a1b14', bgTo: '#14110f', glow: '#d98a1f', glowX: 720, glowY: 200, stars: [[560, 70, 9], [860, 90, 12], [840, 300, 6]] },
  { scene: 'pour', bgFrom: '#241a16', bgTo: '#14110f', glow: '#d98a1f', glowX: 600, glowY: 210, stars: [[110, 250, 8], [420, 300, 6], [470, 60, 10], [880, 300, 7]] },
  { scene: 'dusk', bgFrom: '#14110f', bgTo: '#7a3a1c', glow: '#e99a30', glowX: 480, glowY: 270, stars: [[90, 60, 9], [210, 120, 6], [380, 50, 8], [520, 100, 5], [860, 70, 10]] },
  { scene: 'still', bgFrom: '#3a2412', bgTo: '#171009', glow: '#d98a1f', glowX: 300, glowY: 210, stars: [[90, 80, 9], [520, 60, 10], [600, 150, 6], [560, 300, 7]] },
];

const hash = (text: string) => {
  const h = [...text].reduce((sum, char) => Math.imul(sum ^ char.charCodeAt(0), 16777619) >>> 0, 2166136261);
  return (h ^ (h >>> 15)) >>> 0;
};
// Numbered tastings ("17-gifted-whisky") cycle through the variants so neighbours differ; other slugs are hashed.
const seed = computed(() => /^\d+/.exec(props.slug)?.[0] ?? hash(props.slug));
const variant = computed(() => variants[Number(seed.value) % variants.length]!);
const scene = computed(() => variant.value.scene);
const id = computed(() => `tp-${scene.value}`);

const star = (x: number, y: number, r: number) =>
  `M${x} ${y - r}L${x + r * 0.22} ${y - r * 0.22}L${x + r} ${y}L${x + r * 0.22} ${y + r * 0.22}L${x} ${y + r}L${x - r * 0.22} ${y + r * 0.22}L${x - r} ${y}L${x - r * 0.22} ${y - r * 0.22}Z`;

const hoop = (x: number) => {
  const half = 32 + 10 * (1 - (x / 60) ** 2);
  return `M${x} ${-half}V${half}`;
};

const rickBarrels = [[96, 286], [264, 286], [432, 286], [180, 188], [348, 188], [264, 90]];
const ears = [{ x: 828, h: 190, turn: -7 }, { x: 866, h: 226, turn: 3 }, { x: 904, h: 176, turn: 10 }];
const grains = Array.from({ length: 6 }, (_, i) => ({ y: i * 15, side: i % 2 ? 1 : -1 }));
</script>

<template>
  <svg
    class="size-full overflow-visible"
    viewBox="0 0 960 360"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient
        :id="`${id}-bg`"
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1="0"
        x2="0"
        y2="360"
      >
        <stop
          offset="0"
          :stop-color="variant.bgFrom"
        />
        <stop
          offset="1"
          :stop-color="variant.bgTo"
        />
      </linearGradient>
      <radialGradient
        :id="`${id}-glow`"
        cx="0.5"
        cy="0.5"
        r="0.5"
      >
        <stop
          offset="0"
          :stop-color="variant.glow"
          stop-opacity="0.5"
        />
        <stop
          offset="1"
          :stop-color="variant.glow"
          stop-opacity="0"
        />
      </radialGradient>
      <linearGradient
        :id="`${id}-whisky`"
        x1="0"
        y1="0"
        x2="0"
        y2="1"
      >
        <stop
          offset="0"
          stop-color="#f3b955"
        />
        <stop
          offset="1"
          stop-color="#b8680f"
        />
      </linearGradient>
      <linearGradient
        :id="`${id}-oak`"
        x1="0"
        y1="0"
        x2="0"
        y2="1"
      >
        <stop
          offset="0"
          stop-color="#7a4f2c"
        />
        <stop
          offset="0.55"
          stop-color="#4a2f1b"
        />
        <stop
          offset="1"
          stop-color="#2a1b14"
        />
      </linearGradient>
      <pattern
        :id="`${id}-staves`"
        width="48"
        height="2400"
        y="-1000"
        patternUnits="userSpaceOnUse"
      >
        <rect
          width="2"
          height="2400"
          fill="#f1e7d3"
          opacity="0.05"
        />
        <rect
          x="24"
          width="1"
          height="2400"
          fill="#f1e7d3"
          opacity="0.03"
        />
      </pattern>
      <path
        :id="`${id}-glencairn`"
        d="M-30 -85C-48 -50 -56 -5 -48 28C-44 44 -26 54 -14 56V62C-14 66 -34 68 -40 76H40C34 68 14 66 14 62V56C26 54 44 44 48 28C56 -5 48 -50 30 -85Z"
      />
      <path
        :id="`${id}-tumbler`"
        d="M-48 -50L-42 70Q-41 78 -32 78H32Q41 78 42 70L48 -50Z"
      />
      <clipPath :id="`${id}-clip-glencairn`">
        <use :href="`#${id}-glencairn`" />
      </clipPath>
      <clipPath :id="`${id}-clip-tumbler`">
        <use :href="`#${id}-tumbler`" />
      </clipPath>
      <g
        v-if="scene === 'rickhouse' || scene === 'still'"
        :id="`${id}-barrel`"
      >
        <path
          d="M-60 -32Q0 -52 60 -32V32Q0 52 -60 32Z"
          :fill="`url(#${id}-oak)`"
        />
        <path
          d="M-60 -12Q0 -18 60 -12M-60 12Q0 18 60 12"
          fill="none"
          stroke="#14110f"
          stroke-opacity="0.35"
          stroke-width="1.5"
        />
        <path
          :d="`${hoop(-44)}${hoop(-18)}${hoop(18)}${hoop(44)}`"
          fill="none"
          stroke="#8a7a68"
          stroke-width="5"
        />
        <path
          :d="`${hoop(-44)}${hoop(44)}`"
          fill="none"
          stroke="#14110f"
          stroke-opacity="0.35"
          stroke-width="1.5"
        />
        <ellipse
          cx="0"
          cy="-38"
          rx="7"
          ry="3.5"
          fill="#14110f"
          opacity="0.75"
        />
        <path
          d="M-54 -30Q0 -42 54 -30"
          fill="none"
          stroke="#f1e7d3"
          stroke-opacity="0.22"
          stroke-width="2"
        />
      </g>
    </defs>

    <rect
      x="-3000"
      y="-1000"
      width="7000"
      height="2400"
      :fill="`url(#${id}-bg)`"
    />
    <rect
      x="-3000"
      y="-1000"
      width="7000"
      height="2400"
      :fill="`url(#${id}-staves)`"
    />
    <ellipse
      :cx="variant.glowX"
      :cy="variant.glowY"
      rx="320"
      ry="200"
      :fill="`url(#${id}-glow)`"
    />

    <path
      v-for="([x, y, r], index) in variant.stars"
      :key="index"
      :d="star(x, y, r)"
      fill="#f1e7d3"
      :opacity="index === 0 ? 0.8 : 0.45"
    />

    <g v-if="scene === 'rickhouse'">
      <rect
        x="-3000"
        y="338"
        width="7000"
        height="200"
        fill="#0d0b09"
        opacity="0.7"
      />
      <use
        v-for="([x, y], index) in rickBarrels"
        :key="index"
        :href="`#${id}-barrel`"
        :transform="`translate(${x} ${y}) scale(1.35 1.25)`"
      />
      <g transform="translate(720 205) scale(1.35)">
        <ellipse
          cx="0"
          cy="78"
          rx="62"
          ry="8"
          fill="#000"
          opacity="0.4"
        />
        <g :clip-path="`url(#${id}-clip-glencairn)`">
          <rect
            x="-60"
            y="-90"
            width="120"
            height="180"
            fill="#f1e7d3"
            opacity="0.08"
          />
          <path
            d="M-60 -6C-30 -14 -10 2 10 -6C30 -14 45 -2 60 -8V90H-60Z"
            :fill="`url(#${id}-whisky)`"
          />
        </g>
        <use
          :href="`#${id}-glencairn`"
          fill="none"
          stroke="#f1e7d3"
          stroke-opacity="0.6"
          stroke-width="2.5"
        />
        <path
          d="M-38 -66C-46 -34 -46 -4 -40 20"
          fill="none"
          stroke="#fff"
          stroke-opacity="0.45"
          stroke-linecap="round"
          stroke-width="4"
        />
        <ellipse
          cx="0"
          cy="-85"
          rx="30"
          ry="4.5"
          fill="none"
          stroke="#f1e7d3"
          stroke-opacity="0.55"
          stroke-width="2"
        />
      </g>
    </g>

    <g v-else-if="scene === 'pour'">
      <g>
        <clipPath :id="`${id}-head`">
          <circle
            cx="770"
            cy="182"
            r="168"
          />
        </clipPath>
        <circle
          cx="770"
          cy="182"
          r="168"
          :fill="`url(#${id}-oak)`"
        />
        <g :clip-path="`url(#${id}-head)`">
          <path
            d="M620 -20V380M680 -20V380M740 -20V380M800 -20V380M860 -20V380M920 -20V380"
            stroke="#14110f"
            stroke-opacity="0.4"
            stroke-width="2"
          />
        </g>
        <circle
          cx="770"
          cy="182"
          r="164"
          fill="none"
          stroke="#8a7a68"
          stroke-width="8"
        />
        <circle
          cx="770"
          cy="182"
          r="130"
          fill="none"
          stroke="#14110f"
          stroke-opacity="0.35"
          stroke-width="3"
        />
        <circle
          cx="810"
          cy="118"
          r="11"
          fill="#14110f"
          opacity="0.7"
        />
      </g>
      <g transform="translate(560 218) scale(1.3)">
        <ellipse
          cx="0"
          cy="80"
          rx="62"
          ry="7"
          fill="#000"
          opacity="0.4"
        />
        <g :clip-path="`url(#${id}-clip-tumbler)`">
          <rect
            x="-60"
            y="-60"
            width="120"
            height="150"
            fill="#f1e7d3"
            opacity="0.08"
          />
          <path
            d="M-60 -2C-30 -8 -10 6 10 -2C30 -8 45 2 60 -4V90H-60Z"
            :fill="`url(#${id}-whisky)`"
          />
          <path
            d="M-60 54H60V90H-60Z"
            fill="#f1e7d3"
            opacity="0.2"
          />
        </g>
        <use
          :href="`#${id}-tumbler`"
          fill="none"
          stroke="#f1e7d3"
          stroke-opacity="0.6"
          stroke-width="2.5"
        />
        <path
          d="M-36 -36L-31 44"
          fill="none"
          stroke="#fff"
          stroke-opacity="0.45"
          stroke-linecap="round"
          stroke-width="4"
        />
        <ellipse
          cx="0"
          cy="-50"
          rx="48"
          ry="5"
          fill="none"
          stroke="#f1e7d3"
          stroke-opacity="0.55"
          stroke-width="2"
        />
      </g>
      <path
        d="M334 106C420 106 562 92 562 208"
        fill="none"
        stroke="#e69a2e"
        stroke-linecap="round"
        stroke-width="7"
      />
      <path
        d="M340 104C420 103 556 90 559 200"
        fill="none"
        stroke="#fbe3a0"
        stroke-linecap="round"
        stroke-opacity="0.7"
        stroke-width="2"
      />
      <path
        d="M528 214C520 200 522 192 530 188M596 214C604 198 602 192 594 188"
        fill="none"
        stroke="#e69a2e"
        stroke-linecap="round"
        stroke-width="3"
      />
      <g transform="translate(298 90) rotate(105)">
        <clipPath :id="`${id}-bottle`">
          <path d="M-35 150V40Q-35 20 -12 14V-20H12V14Q35 20 35 40V150Z" />
        </clipPath>
        <path
          d="M-35 150V40Q-35 20 -12 14V-20H12V14Q35 20 35 40V150Z"
          fill="#2a1b14"
        />
        <g :clip-path="`url(#${id}-bottle)`">
          <rect
            x="-40"
            y="-20"
            width="80"
            height="170"
            :fill="`url(#${id}-whisky)`"
            opacity="0.85"
          />
          <rect
            x="-40"
            y="70"
            width="80"
            height="54"
            fill="#f1e7d3"
          />
          <path
            d="M-24 86H24M-18 98H18M-24 110H24"
            stroke="#14110f"
            stroke-linecap="round"
            stroke-opacity="0.6"
            stroke-width="3"
          />
        </g>
        <path
          d="M-35 150V40Q-35 20 -12 14V-20H12V14Q35 20 35 40V150Z"
          fill="none"
          stroke="#f1e7d3"
          stroke-opacity="0.5"
          stroke-width="2.5"
        />
        <path
          d="M-26 130V44"
          stroke="#fff"
          stroke-linecap="round"
          stroke-opacity="0.4"
          stroke-width="4"
        />
        <rect
          x="-15"
          y="-36"
          width="30"
          height="16"
          rx="3"
          fill="#d98a1f"
        />
      </g>
    </g>

    <g v-else-if="scene === 'dusk'">
      <path
        d="M-300 262C80 190 200 236 340 218C470 202 600 246 760 210C880 184 1050 236 1300 256V400H-300Z"
        fill="#3a2019"
      />
      <path
        d="M-300 312C100 270 280 306 470 288C680 270 820 306 1300 288V400H-300Z"
        fill="#1b1210"
      />
      <g transform="translate(640 296) scale(1.15) translate(-640 -296)">
        <g fill="#100b09">
          <path d="M520 296V254L548 236L576 254V296Z" />
          <path d="M580 296V246H760V296Z" />
          <path d="M574 248L670 214L766 248Z" />
          <path d="M692 236V172H740V236Z" />
          <path d="M678 174Q710 170 716 120Q722 170 754 174Z" />
          <path d="M708 122V108H724V122Z" />
          <path d="M703 110L716 94L729 110Z" />
        </g>
        <path
          d="M716 92C690 80 730 66 704 52C690 44 702 38 694 30"
          fill="none"
          stroke="#f1e7d3"
          stroke-linecap="round"
          stroke-opacity="0.3"
          stroke-width="5"
        />
        <g fill="#f3b955">
          <rect
            x="598"
            y="266"
            width="14"
            height="16"
          />
          <rect
            x="634"
            y="266"
            width="14"
            height="16"
          />
          <rect
            x="702"
            y="266"
            width="14"
            height="16"
          />
          <rect
            x="540"
            y="268"
            width="10"
            height="14"
          />
        </g>
      </g>
      <rect
        x="-3000"
        y="334"
        width="7000"
        height="200"
        fill="#0d0b09"
      />
      <g transform="translate(250 262) scale(0.78)">
        <ellipse
          cx="0"
          cy="78"
          rx="62"
          ry="8"
          fill="#000"
          opacity="0.5"
        />
        <g :clip-path="`url(#${id}-clip-glencairn)`">
          <rect
            x="-60"
            y="-90"
            width="120"
            height="180"
            fill="#f1e7d3"
            opacity="0.1"
          />
          <path
            d="M-60 -6C-30 -14 -10 2 10 -6C30 -14 45 -2 60 -8V90H-60Z"
            :fill="`url(#${id}-whisky)`"
          />
        </g>
        <use
          :href="`#${id}-glencairn`"
          fill="none"
          stroke="#f1e7d3"
          stroke-opacity="0.65"
          stroke-width="3"
        />
        <ellipse
          cx="0"
          cy="-85"
          rx="30"
          ry="4.5"
          fill="none"
          stroke="#f1e7d3"
          stroke-opacity="0.55"
          stroke-width="2.5"
        />
      </g>
    </g>

    <g v-else>
      <rect
        x="-3000"
        y="338"
        width="7000"
        height="200"
        fill="#0d0b09"
        opacity="0.7"
      />
      <clipPath :id="`${id}-pot`">
        <path d="M205 312C168 298 160 250 190 218C215 192 252 178 254 156H306C308 178 345 192 370 218C400 250 392 298 355 312Z" />
      </clipPath>
      <linearGradient
        :id="`${id}-copper`"
        x1="0"
        y1="0"
        x2="1"
        y2="0"
      >
        <stop
          offset="0"
          stop-color="#8a4a1f"
        />
        <stop
          offset="0.3"
          stop-color="#f0a05a"
        />
        <stop
          offset="0.65"
          stop-color="#c46a2a"
        />
        <stop
          offset="1"
          stop-color="#7a3a18"
        />
      </linearGradient>
      <path
        d="M280 176V112C280 72 330 58 366 84L470 160"
        fill="none"
        stroke="#7a3a18"
        stroke-linecap="round"
        stroke-width="40"
      />
      <path
        d="M280 176V112C280 72 330 58 366 84L470 160"
        fill="none"
        :stroke="`url(#${id}-copper)`"
        stroke-linecap="round"
        stroke-width="34"
      />
      <path
        d="M280 176V112C280 80 322 66 352 86"
        fill="none"
        stroke="#fbd9a0"
        stroke-linecap="round"
        stroke-opacity="0.4"
        stroke-width="4"
        transform="translate(-8 0)"
      />
      <rect
        x="256"
        y="156"
        width="48"
        height="12"
        rx="3"
        fill="#7a3a18"
      />
      <path
        d="M205 312C168 298 160 250 190 218C215 192 252 178 254 156H306C308 178 345 192 370 218C400 250 392 298 355 312Z"
        :fill="`url(#${id}-copper)`"
      />
      <g :clip-path="`url(#${id}-pot)`">
        <path
          d="M150 252Q280 266 410 252M150 300Q280 314 410 300"
          fill="none"
          stroke="#3a1c0c"
          stroke-opacity="0.45"
          stroke-width="3"
        />
        <ellipse
          cx="280"
          cy="258"
          rx="22"
          ry="28"
          fill="none"
          stroke="#3a1c0c"
          stroke-opacity="0.5"
          stroke-width="3"
        />
      </g>
      <path
        d="M196 232C178 252 184 282 206 296"
        fill="none"
        stroke="#fff"
        stroke-linecap="round"
        stroke-opacity="0.35"
        stroke-width="4"
      />
      <rect
        x="200"
        y="312"
        width="160"
        height="28"
        rx="4"
        fill="#1b1210"
      />
      <ellipse
        cx="280"
        cy="326"
        rx="38"
        ry="7"
        fill="#e99a30"
        opacity="0.7"
      />

      <use
        :href="`#${id}-barrel`"
        transform="translate(672 288) scale(1.5)"
      />
      <g transform="translate(672 150) scale(0.85)">
        <ellipse
          cx="0"
          cy="78"
          rx="60"
          ry="6"
          fill="#000"
          opacity="0.35"
        />
        <g :clip-path="`url(#${id}-clip-tumbler)`">
          <rect
            x="-60"
            y="-60"
            width="120"
            height="150"
            fill="#f1e7d3"
            opacity="0.08"
          />
          <path
            d="M-60 -2C-30 -8 -10 6 10 -2C30 -8 45 2 60 -4V90H-60Z"
            :fill="`url(#${id}-whisky)`"
          />
          <path
            d="M-60 54H60V90H-60Z"
            fill="#f1e7d3"
            opacity="0.2"
          />
        </g>
        <use
          :href="`#${id}-tumbler`"
          fill="none"
          stroke="#f1e7d3"
          stroke-opacity="0.65"
          stroke-width="3"
        />
        <ellipse
          cx="0"
          cy="-50"
          rx="48"
          ry="5"
          fill="none"
          stroke="#f1e7d3"
          stroke-opacity="0.55"
          stroke-width="2.5"
        />
      </g>

      <g
        v-for="ear in ears"
        :key="ear.x"
        :transform="`translate(${ear.x} 340) rotate(${ear.turn})`"
      >
        <path
          :d="`M0 0V${-ear.h}`"
          stroke="#c99a3c"
          stroke-width="3"
        />
        <g :transform="`translate(0 ${-ear.h})`">
          <g
            v-for="(grain, index) in grains"
            :key="index"
          >
            <ellipse
              :cx="grain.side * 5"
              :cy="grain.y"
              rx="4.5"
              ry="10"
              fill="#e0a53a"
              :transform="`rotate(${grain.side * -22} ${grain.side * 5} ${grain.y})`"
            />
            <path
              :d="`M${grain.side * 7} ${grain.y - 6}L${grain.side * 18} ${grain.y - 40}`"
              stroke="#f1e7d3"
              stroke-linecap="round"
              stroke-opacity="0.5"
              stroke-width="1.2"
            />
          </g>
          <ellipse
            cx="0"
            cy="-12"
            rx="4"
            ry="10"
            fill="#e0a53a"
          />
        </g>
      </g>
    </g>
  </svg>
</template>
