[
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "フレーム付き: ケースの底面を描画する",
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
    comment: "フレーム付き: ケースの前面背板を描画する",
    props: {
      floorRect: {
        x1: -(maxX + slabDepth / 2),
        z1: -maxZ,
        x2: -maxX,
        z2: maxZ,
      },
      height: maxY - 1.0,
    },
  },
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "フレーム付き: ケースの前面横縁を描画する",
    props: {
      floorRect: {
        x1: -(maxX + slabDepth),
        z1: -(maxZ + slabDepth),
        x2: -(maxX + slabDepth + 0.1),
        z2: -2.3,
      },
      height: maxY - 1.0,
    },
  },
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "フレーム付き: ケースの前面横縁を描画する",
    props: {
      floorRect: {
        x1: -(maxX + slabDepth),
        z1: 0 + 2.3,
        x2: -(maxX + slabDepth + 0.1),
        z2: maxZ + slabDepth,
      },
      height: maxY - 1.0,
    },
  },
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "フレーム付き: ケースの前面下縁を描画する",
    props: {
      floorRect: {
        x1: -(maxX + slabDepth + 0.1),
        z1: -maxZ,
        x2: -maxX,
        z2: maxZ,
      },
      height: 0.2,
    },
  },
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "フレーム付き: ケースの前面上縁を描画する",
    props: {
      floorRect: {
        x1: -(maxX + slabDepth + 0.1),
        z1: -maxZ,
        x2: -maxX,
        z2: maxZ,
      },
      height: 0.6,
      floorLevel: maxY - 1.0 - 0.2,
    },
  },
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "フレーム付き: ケースの背板を描画する",
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
    comment: "フレーム付き: ケースの右側面板を描画する",
    props: {
      floorRect: {
        x1: maxX + slabDepth,
        z1: maxZ,
        x2: -maxX - slabDepth - 0.1,
        z2: maxZ + slabDepth,
      },
      height: maxY,
    },
  },
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "フレーム付き: ケースの左側面板を描画する",
    props: {
      floorRect: {
        x1: maxX + slabDepth,
        z1: -maxZ,
        x2: -maxX - slabDepth - 0.1,
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
      svgFilePath: rootDirectory + "svg-pattern/pattern.svg",
      faceDirection: "x-front",
      floorRect: {
        x1: -(maxX + slabDepth + 0.1) - slabDepth / 2,
        z1: 2.3,
        x2: -(maxX + slabDepth + 0.1),
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
      svgFilePath: rootDirectory + "svg-pattern/pattern.svg",
      faceDirection: "x-front",
      floorRect: {
        x1: -(maxX + slabDepth + 0.1) - slabDepth / 2,
        z1: -2.3,
        x2: -(maxX + slabDepth + 0.1),
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
