[
  {
    type: "BoxToBuild.fromCenterAndSize",
    comment: "底板を描画する",
    props: {
      size: {
        widthX: maxX * 2,
        widthZ: maxZ * 2,
      },
      height: slabDepth,
    },
  },
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "仕切りを描画する",
    props: {
      floorRect: {
        x1: -slabDepth / 2,
        z1: -maxZ,
        x2: slabDepth / 2,
        z2: maxZ,
      },
      height: maxY,
    },
  },
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "仕切りを描画する",
    props: {
      floorRect: {
        x1: maxX,
        z1: -maxZ,
        x2: maxX - slabDepth,
        z2: maxZ,
      },
      height: maxY,
    },
  },
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "仕切りを描画する",
    props: {
      floorRect: {
        x1: -maxX,
        z1: -maxZ,
        x2: -maxX + slabDepth,
        z2: maxZ,
      },
      height: maxY,
    },
  },
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "底板を描画する",
    props: {
      floorRect: {
        x1: -maxX,
        z1: -maxZ,
        x2: maxX,
        z2: -maxZ + slabDepth,
      },
      height: maxY,
    },
  },
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "引き出し板を描画する",
    props: {
      floorRect: {
        x1: -maxX + slabDepth / 2,
        z1: -maxZ,
        x2: maxX - slabDepth / 2,
        z2: -maxZ + slabDepth,
      },
      height: maxY + slabDepth,
    },
  },
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "小天板を描画する",
    props: {
      floorRect: {
        x1: -maxX + slabDepth / 2,
        z1: -maxZ,
        x2: maxX - slabDepth / 2,
        z2: -maxZ + 0.6,
      },
      height: thinSlabDepth,
      floorLevel: maxY,
    },
  },
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "目盛りの右側部分を描画する",
    props: {
      floorRect: {
        x1: 1.0,
        z1: -(maxZ - 0.5),
        x2: 1.0 + thinSlabDepth,
        z2: -(maxZ - 0.1),
      },
      height: thinSlabDepth,
      floorLevel: maxY + thinSlabDepth / 2,
    },
    loop: {
      count: numberList[0],
      translate: {
        x: 0.2,
        y: 0.0,
        z: 0.0,
      },
    },
  },
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "目盛りの左側部分を描画する",
    props: {
      floorRect: {
        x1: -1.0,
        z1: -(maxZ - 0.5),
        x2: -1.0 + thinSlabDepth,
        z2: -(maxZ - 0.1),
      },
      height: thinSlabDepth,
      floorLevel: maxY + thinSlabDepth / 2,
    },
    loop: {
      count: numberList[1],
      translate: {
        x: -0.2,
        y: 0.0,
        z: 0.0,
      },
    },
  },
];
