[
  {
    type: "SweepShape.fromText",
    comment: "神恩感謝の二段目",
    props: {
      text: "謝恩",
      xFlip: true,
      faceDirection: "top",
      floorRect: {
        x1: 0.0,
        z1: 0.0,
        x2: 5.0,
        z2: 5.0,
      },
      height: slabDepth * 0.2,
      floorLevel: slabDepth * 0.5,
    },
  },
  {
    type: "SweepShape.fromText",
    comment: "神恩感謝の一段目",
    props: {
      text: "感神",
      xFlip: true,
      faceDirection: "top",
      floorRect: {
        x1: 2.5,
        z1: 0.0,
        x2: 7.5,
        z2: 5.0,
      },
      height: slabDepth * 0.2,
      floorLevel: slabDepth * 0.5,
    },
  },
  {
    type: "BoxToBuild.fromFloorRect",
    comment: "ケースの底面を描画する",
    props: {
      floorRect: {
        x1: 0,
        z1: 0,
        x2: 5.8,
        z2: 5.0,
      },
      height: slabDepth * 0.5,
    },
  },
];
