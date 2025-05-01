import * as THREE from "three";
import { ExtrudeGeometry, Vector3 } from "three";
import {
  BufferGeometryUtils,
  SVGLoader,
  SVGResult,
} from "three/examples/jsm/Addons.js";
import { degToRad } from "three/src/math/MathUtils.js";
// @ts-ignore
import { default as _TextToSVG } from "../oss-extends/TextToSVG.js";
import { default as TextToSVG, type Anchor } from "text-to-svg";

type FaceDirection =
  | "top"
  | "top-0"
  | "top-90"
  | "top-180"
  | "top-270"
  | "bottom"
  | "bottom-0"
  | "bottom-90"
  | "bottom-180"
  | "bottom-270"
  | "x-front"
  | "z-front"
  | "x-back"
  | "z-back";

/**
 * 掃引体を定義する
 */
namespace SweepShape {
  /**
   * 座標情報から掃引体を作成する
   */
  export async function fromPoints(props: {
    points: THREE.Vector2[];
    center: {
      x: number;
      z: number;
    };
    height: number;
  }): Promise<THREE.BufferGeometry> {
    const { x, z } = props.center;
    const geometry = new ExtrudeGeometry(new THREE.Shape(props.points), {
      depth: props.height,
      bevelEnabled: false,
    });
    geometry.translate(x, 0, z); // Translate to the center of the world
    return geometry;
  }

  /**
   * テキストから掃引体を作成する
   */
  export async function fromText(props: {
    text: string;
    faceDirection: FaceDirection;
    floorRect: {
      x1: number;
      z1: number;
      x2: number;
      z2: number;
    };
    height: number;
    floorLevel?: number;
    fontSize?: number | "auto";
  }) {
    const converter = await new Promise<TextToSVG>((resolve: any) => {
      _TextToSVG.load(
        "/font/NotoSansJP-Regular.ttf",
        (_err: any, converter: TextToSVG) => {
          resolve(converter);
        }
      );
    });
    const fontSize = props.fontSize ?? "auto";
    const FIXED_FONT_SIZE = 12;
    const writingProperty: TextToSVG.GenerationOptions = {
      x: 0,
      y: 0,
      fontSize: FIXED_FONT_SIZE,
      anchor: "right|bottom" as Anchor,
      attributes: { fill: "black" },
    };
    const contents = converter.getSVG(props.text, writingProperty);
    const metrics = converter.getMetrics(props.text, writingProperty);
    let directScale: number | undefined = undefined;
    if (fontSize !== "auto") {
      // フォントサイズを元に、拡大縮小スケールを指定する
      const actualZHeight = converter.getMetrics("Z", writingProperty).height;
      directScale = fontSize / actualZHeight;
    }
    const geometry = await fromSVG({
      svgFilePath: {
        contents,
      },
      actualSize: {
        width: metrics.width,
        height: metrics.height,
      },
      directScale,
      faceDirection: props.faceDirection,
      floorRect: props.floorRect,
      height: props.height,
      floorLevel: props.floorLevel,
      xFlip: true,
      yFlip: true,
    });
    return geometry;
  }

  /**
   * SVGのファイルオブジェクトから掃引体を作成する
   */
  export async function fromSVG(props: {
    svgFilePath: string | { contents: string };
    faceDirection: FaceDirection;
    floorRect: {
      x1: number;
      z1: number;
      x2: number;
      z2: number;
    };
    actualSize?: {
      width: number;
      height: number;
    };
    directScale?: number;
    height: number;
    floorLevel?: number;
    xFlip?: boolean;
    yFlip?: boolean;
    xFlipTranslate?: boolean;
    yFlipTranslate?: boolean;
  }): Promise<THREE.BufferGeometry> {
    const { svgFilePath } = props;
    const { x1, z1, x2, z2 } = props.floorRect;
    const height = props.height;
    const floorLevel = props.floorLevel ?? 0;
    const { faceDirection } = props;
    const cubeSize = {
      x: Math.abs(x1 - x2),
      y: height,
      z: Math.abs(z1 - z2),
    };
    let svgWidth = 1,
      svgHeight = 1,
      svgDepth = 1;
    const rotateMapping: Record<FaceDirection, Vector3> = {
      ["top"]: new Vector3(degToRad(90), degToRad(270), degToRad(180)),
      ["top-0"]: new Vector3(degToRad(90), degToRad(270), degToRad(180)),
      ["top-90"]: new Vector3(degToRad(90), degToRad(0), degToRad(180)),
      ["top-180"]: new Vector3(degToRad(90), degToRad(90), degToRad(180)),
      ["top-270"]: new Vector3(degToRad(90), degToRad(180), degToRad(180)),
      ["bottom"]: new Vector3(degToRad(270), degToRad(90), degToRad(180)),
      ["bottom-0"]: new Vector3(degToRad(90), degToRad(90), degToRad(0)),
      ["bottom-90"]: new Vector3(degToRad(90), degToRad(180), degToRad(0)),
      ["bottom-180"]: new Vector3(degToRad(90), degToRad(-90), degToRad(0)),
      ["bottom-270"]: new Vector3(degToRad(90), degToRad(0), degToRad(0)),
      ["x-front"]: new Vector3(0, degToRad(270), 0),
      ["x-back"]: new Vector3(0, degToRad(90), 0),
      ["z-front"]: new Vector3(0, degToRad(180), 0),
      ["z-back"]: new Vector3(0, 0, 0),
    };
    const translateMapping: Record<FaceDirection, Vector3> = {
      ["top"]: new Vector3(Math.min(x1, x2), floorLevel, Math.min(z1, z2)),
      ["top-0"]: new Vector3(Math.min(x1, x2), floorLevel, Math.min(z1, z2)),
      ["top-90"]: new Vector3(
        Math.min(x1, x2) + cubeSize.x,
        floorLevel,
        Math.min(z1, z2)
      ),
      ["top-180"]: new Vector3(
        Math.min(x1, x2) + cubeSize.x,
        floorLevel,
        Math.min(z1, z2) + cubeSize.z
      ),
      ["top-270"]: new Vector3(
        Math.min(x1, x2),
        floorLevel,
        Math.min(z1, z2) + cubeSize.z
      ),
      ["bottom"]: new Vector3(
        Math.min(x1, x2),
        floorLevel + cubeSize.y,
        Math.min(z1, z2) + cubeSize.z
      ),
      ["bottom-0"]: new Vector3(
        Math.min(x1, x2),
        floorLevel + cubeSize.y,
        Math.min(z1, z2) + cubeSize.z
      ),
      ["bottom-90"]: new Vector3(
        Math.min(x1, x2) + cubeSize.x,
        floorLevel + cubeSize.y,
        Math.min(z1, z2) + cubeSize.z
      ),
      ["bottom-180"]: new Vector3(
        Math.min(x1, x2) + cubeSize.x,
        floorLevel + cubeSize.y,
        Math.min(z1, z2)
      ),
      ["bottom-270"]: new Vector3(
        Math.min(x1, x2),
        floorLevel + cubeSize.y,
        Math.min(z1, z2)
      ),
      ["x-front"]: new Vector3(
        Math.min(x1, x2) + cubeSize.x,
        floorLevel,
        Math.min(z1, z2)
      ),
      ["x-back"]: new Vector3(
        Math.min(x1, x2),
        floorLevel,
        Math.min(z1, z2) + cubeSize.z
      ),
      ["z-front"]: new Vector3(
        Math.min(x1, x2) + cubeSize.x,
        floorLevel,
        Math.min(z1, z2) + cubeSize.z
      ),
      ["z-back"]: new Vector3(Math.min(x1, x2), floorLevel, Math.min(z1, z2)),
    };
    const rotate = rotateMapping[faceDirection];
    const translate = translateMapping[faceDirection];
    if (faceDirection.startsWith("top") || faceDirection.startsWith("bottom")) {
      svgWidth = cubeSize.x;
      svgHeight = cubeSize.z;
      svgDepth = cubeSize.y;
    } else if (faceDirection == "x-front" || faceDirection == "x-back") {
      svgWidth = cubeSize.z;
      svgHeight = cubeSize.y;
      svgDepth = cubeSize.x;
    } else if (faceDirection == "z-front" || faceDirection == "z-back") {
      svgWidth = cubeSize.x;
      svgHeight = cubeSize.y;
      svgDepth = cubeSize.z;
    }
    return await _createObjectWithSvg({
      svgFilePath,
      size: {
        width: svgWidth,
        height: svgHeight,
      },
      actualSize: props.actualSize,
      directScale: props.directScale,
      height: svgDepth,
      rotate: {
        x: rotate.x,
        y: rotate.y,
        z: rotate.z,
      },
      translate: {
        x: translate.x,
        y: translate.y,
        z: translate.z,
      },
      xFlip: props.xFlip,
      yFlip: props.yFlip,
      xFlipTranslate: props.xFlipTranslate,
      yFlipTranslate: props.yFlipTranslate,
    });
  }

  /**
   * SVGのパスから掃引体を作成する
   */
  async function _createObjectWithSvg(props: {
    svgFilePath: string | { contents: string };
    height: number;
    size?: {
      width: number;
      height: number;
    };
    actualSize?: {
      width: number;
      height: number;
    };
    directScale?: number;
    rotate?: {
      x: number;
      y: number;
      z: number;
    };
    translate?: {
      x: number;
      y: number;
      z: number;
    };
    xFlip?: boolean;
    yFlip?: boolean;
    xFlipTranslate?: boolean;
    yFlipTranslate?: boolean;
  }): Promise<THREE.BufferGeometry> {
    const { width, height } = props.size ?? { width: 0, height: 0 };
    const { x, y, z } = props.translate ?? { x: 0, y: 0, z: 0 };
    const { x: rx, y: ry, z: rz } = props.rotate ?? { x: 0, y: 0, z: 0 };
    const xFlip = props.xFlip ?? false;
    const yFlip = props.yFlip ?? false;
    const xFlipTranslate = props.xFlipTranslate ?? false;
    const yFlipTranslate = props.yFlipTranslate ?? false;
    const directScale = props.directScale ?? 1.0;

    let svgData: SVGResult;
    if (props.svgFilePath && typeof props.svgFilePath === "string") {
      const svgResult = await fetch(props.svgFilePath);
      const svgText = await svgResult.text();
      svgData = new SVGLoader().parse(svgText);
    } else if (props.svgFilePath && typeof props.svgFilePath === "object") {
      svgData = new SVGLoader().parse(props.svgFilePath.contents);
    } else {
      throw new Error("Invalid SVG file path or contents.");
    }
    const geometries: THREE.BufferGeometry[] = [];
    const shouldCalculateFromSize =
      props.size !== undefined &&
      props.actualSize === undefined &&
      props.directScale === undefined;
    let drawBoxMin = {
      x: 99999,
      y: 99999,
      z: 99999,
    };
    let drawBoxMax = {
      x: -99999,
      y: -99999,
      z: -99999,
    };
    svgData.paths.forEach((path) => {
      const shapes = SVGLoader.createShapes(path);
      const geometry = new ExtrudeGeometry(shapes, {
        depth: props.height,
        bevelSize: 0.0,
        bevelThickness: 0.0,
      });
      geometry.computeVertexNormals();
      geometry.deleteAttribute("uv");
      if (shouldCalculateFromSize) {
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        if (boundingBox) {
          drawBoxMin.x = Math.min(drawBoxMin.x, boundingBox.min.x);
          drawBoxMin.y = Math.min(drawBoxMin.y, boundingBox.min.y);
          drawBoxMin.z = Math.min(drawBoxMin.z, boundingBox.min.z);
          drawBoxMax.x = Math.max(drawBoxMax.x, boundingBox.max.x);
          drawBoxMax.y = Math.max(drawBoxMax.y, boundingBox.max.y);
          drawBoxMax.z = Math.max(drawBoxMax.z, boundingBox.max.z);
        }
      }
      geometries.push(geometry);
    });
    let applyScale = 1.0;
    let depthScale = 1.0;
    if (props.directScale !== undefined) {
      // 直接サイズの指定を受けている場合
      // 指定されたスケールを適用する
      depthScale = directScale;
      applyScale = directScale;
    } else if (shouldCalculateFromSize) {
      // 引数のボックスの大きさを元に、表示スケールを指定する
      const drawWidth = Math.max(drawBoxMax.x - drawBoxMin.x, 0.1);
      const drawOffsetX = drawBoxMin.x * 2;
      const drawHeight = Math.max(drawBoxMax.y - drawBoxMin.y, 0.1);
      const drawOffsetY = drawBoxMin.y * 2;
      const drawDepth = Math.max(drawBoxMax.z - drawBoxMin.z, 0.1);
      const scaleX = width / (drawWidth + drawOffsetX);
      const scaleY = height / (drawHeight + drawOffsetY);
      depthScale = props.height / drawDepth;
      applyScale = Math.min(scaleX, scaleY);
    } else if (props.actualSize !== undefined) {
      // ボックスのサイズ指定がない場合
      // 実際のコンテンツサイズの大きさを元に、表示スケールを指定する
      const drawWidth = props.actualSize.width;
      const drawHeight = props.actualSize.height;
      const drawDepth = props.height;
      const scaleX = width / drawWidth;
      const scaleY = height / drawHeight;
      depthScale = props.height / drawDepth;
      applyScale = Math.min(scaleX, scaleY);
    }
    geometries.forEach((geometry) => {
      geometry.scale(
        applyScale * (xFlip ? -1.0 : 1.0),
        applyScale * (yFlip ? -1.0 : 1.0),
        depthScale
      );
      geometry.rotateX(rx);
      geometry.rotateY(ry);
      geometry.rotateZ(rz);
      geometry.translate(x, y, z);
      // フリップに伴うX方向の移動が必要なら、オブジェクトを移動させる
      if (xFlipTranslate) {
        geometry.translate(-width, 0, 0);
      }
      // フリップに伴うY方向の移動が必要なら、オブジェクトを移動させる
      if (yFlipTranslate) {
        geometry.translate(0, height, 0);
      }
    });
    const mergedGeometry = BufferGeometryUtils.mergeGeometries(
      geometries,
      false
    );
    return mergedGeometry;
  }
}

export default SweepShape;
