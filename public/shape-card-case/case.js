[
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "ケースの底面を描画する",
    props: {
      floorRect: {
        x1: -maxX,
        z1: -maxZ,
        x2: maxX,
        z2: maxZ,
      },
      height: slabDepth,
    },
  },
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "ケースの横面を描画する",
    props: {
      floorRect: {
        x1: -maxX,
        z1: -maxZ,
        x2: -(maxX + slabDepth),
        z2: maxZ,
      },
      height: maxY - 1.0,
    },
  },
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "ケースの横面を描画する",
    props: {
      floorRect: {
        x1: -(maxX + slabDepth / 2),
        z1: -maxZ,
        x2: -(maxX + slabDepth),
        z2: maxZ,
      },
      height: maxY - slabDepth - 0.4,
    },
  },
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "ケースの横面を描画する",
    props: {
      floorRect: {
        x1: maxX,
        z1: -maxZ,
        x2: maxX + slabDepth,
        z2: maxZ,
      },
      height: maxY,
    },
  },
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "ケースの横面を描画する",
    props: {
      floorRect: {
        x1: maxX + slabDepth,
        z1: maxZ,
        x2: -maxX - slabDepth,
        z2: maxZ + slabDepth,
      },
      height: maxY,
    },
  },
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "ケースの横面を描画する",
    props: {
      floorRect: {
        x1: maxX + slabDepth,
        z1: -maxZ,
        x2: -maxX - slabDepth,
        z2: -(maxZ + slabDepth),
      },
      height: maxY,
    },
  },
  {
    type: "SweepShape.fromSVG",
    comment: "ケースの前面を描画する",
    hidden: !drawSvgPatterns,
    props: {
      svgFilePath: "/svg-pattern/pattern.svg",
      faceDirection: "x-front",
      floorRect: {
        x1: -(maxX + slabDepth) - slabDepth / 2,
        z1: 2.3,
        x2: -(maxX + slabDepth),
        z2: maxZ + slabDepth,
      },
      height: maxZ + slabDepth - 2.3,
      floorLevel: slabDepth,
    },
    loop: {
      count: patternCount,
      translate: {
        x: 0.0,
        y: patternSize,
        z: 0.0,
      },
    },
  },
  {
    type: "SweepShape.fromSVG",
    comment: "ケースの前面を描画する",
    hidden: !drawSvgPatterns,
    props: {
      svgFilePath: "/svg-pattern/pattern.svg",
      faceDirection: "x-front",
      floorRect: {
        x1: -(maxX + slabDepth) - slabDepth / 2,
        z1: -2.3,
        x2: -(maxX + slabDepth),
        z2: -(maxZ + slabDepth),
      },
      height: maxZ + slabDepth - 2.3,
      floorLevel: slabDepth,
    },
    loop: {
      count: patternCount,
      translate: {
        x: 0.0,
        y: patternSize,
        z: 0.0,
      },
    },
  },
];
