[
  {
    type: "SweepShape.fromText",
    comment: "テキストを描画する",
    props: {
      text: "勝手に課金する",
      xFlip: true,
      faceDirection: "bottom-180",
      floorRect: {
        x1: -2.4,
        z1: -0.6,
        x2: 0.8,
        z2: 2.6,
      },
      height: 0.04,
      floorLevel: slabDepth,
    },
  },
  {
    type: "SweepShape.fromSVG",
    comment: "SVGイラストを描画する",
    props: {
      svgFilePath: "/svg-pattern/shopping_cart.svg",
      xFlip: true,
      faceDirection: "bottom-180",
      floorRect: {
        x1: 0.6,
        z1: 0.0,
        x2: 2.6,
        z2: 2.0,
      },
      height: slabDepth,
    },
  },
  {
    type: "ShapeGroup.subtract",
    comment: "空洞の空いたプレート",
    props: {
      base: {
        type: "BoxToBuild.fromFloorRect",
        comment: "キーホルダーのふちを描画する",
        props: {
          floorRect: {
            x1: -0.3,
            z1: -0.6,
            x2: 2.6,
            z2: 2.6,
          },
          radius: 0.3,
          height: slabDepth,
        },
      },
      attach: [
        {
          type: "BoxToBuild.fromFloorRect",
          comment: "イラストの周りの溝を描画する",
          props: {
            floorRect: {
              x1: 0.7,
              z1: 0.1,
              x2: 2.4,
              z2: 1.9,
            },
            height: slabDepth,
            floorLevel: slabDepth * 0.5,
          },
        },
        {
          type: "RotateShape.fromRadius",
          comment: "キーチェーンを通す穴をあける",
          props: {
            floorRect: {
              centerX: -0.0,
              centerZ: 1.0,
              radius: 0.15,
            },
            height: 4.0,
            floorLevel: -2.0,
          },
        },
      ],
    },
  },
];
