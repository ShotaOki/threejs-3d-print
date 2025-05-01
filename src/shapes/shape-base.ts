import * as THREE from "three";
import Material from "../materials/material";
import BoxToBuild from "../utility/box-to-build";
import jexl from "jexl";
import ShapeGroup from "../utility/shape-group";
import RotateShape from "../utility/rotate-shape";
import SweepShape from "../utility/sweep-shape";
import { fetchFileContents } from "./fetch-file-contents";

interface ConvertShapeInput {
  type: string;
  props: any;
  loop?: any;
  hidden?: boolean;
}

export default class ShapeBase {
  /**
   * JSON形式の図形情報をGeometryに変換する
   */
  async convertToShape(shape: ConvertShapeInput) {
    const { type, props, loop, hidden } = shape;
    if (hidden) {
      return [];
    }
    // マッピングを定義する
    const constructors: Record<
      string,
      (property: any) => Promise<THREE.BufferGeometry>
    > = {
      "BoxToBuild.fromCenterAndSize": BoxToBuild.fromCenterAndSize,
      "BoxToBuild.fromFloorRect": BoxToBuild.fromFloorRect,
      "RotateShape.fromRadiusArc": RotateShape.fromRadiusArc,
      "SweepShape.fromSVG": SweepShape.fromSVG,
      "SweepShape.fromText": SweepShape.fromText,
      "RotateShape.fromRadius": RotateShape.fromRadius,
      "ShapeGroup.subtract": ShapeGroup.subtract,
    };
    // レスポンスオブジェクトを定義する
    const responseObjects = [];
    // マッピングからコンストラクタを取得する
    const constructor = constructors[type];
    // オブジェクトを作成する
    if (constructor) {
      if (type.startsWith("ShapeGroup.")) {
        const attach = props.attach as ConvertShapeInput[];
        const base = props.base as ConvertShapeInput;
        const baseShape: THREE.BufferGeometry[] = await this.convertToShape(
          base
        );
        const attachShapes: THREE.BufferGeometry[] = [];
        for (const item of attach) {
          const attachShape = await this.convertToShape(item);
          if (attachShape.length > 0) {
            attachShapes.push(...attachShape);
          }
        }
        responseObjects.push(
          await constructor({ base: baseShape[0], attach: attachShapes })
        );
      } else {
        if (loop) {
          const loopCount = loop.count ?? 1;
          const translate = {
            x: loop.translate?.x ?? 0,
            y: loop.translate?.y ?? 0,
            z: loop.translate?.z ?? 0,
          };
          for (let i = 0; i < loopCount; i++) {
            const target = await constructor(props);
            target.translate(translate.x * i, translate.y * i, translate.z * i);
            responseObjects.push(target);
          }
        } else {
          responseObjects.push(await constructor(props));
        }
      }
    }
    return responseObjects;
  }

  /**
   * シーンを初期化する
   */
  withResetScene(scene: THREE.Scene) {
    const removeList: THREE.Mesh[] = [];
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        removeList.push(object);
      }
    });
    scene.remove(...removeList);
    return this;
  }

  /**
   * URLからオブジェクトを取得、シーンに追加する
   */
  async addObjectToSceneWithUrl(
    scene: THREE.Scene,
    props: { contextUrl: string; shapeUrl: string; isBrowser: boolean },
    parameter: any,
    material?: THREE.Material
  ) {
    // 変数を確保する
    const shapeList = [];
    const notMergeObjects = [];
    // 図形パラメータを参照する
    const contextText = await fetchFileContents({
      url: props.contextUrl,
      isBrowser: props.isBrowser,
    });
    // jsファイルでJEXLに変換できないものを文字列から除外する
    // jexlは負の数を処理できないため、"-a"は"0-a"に変換する
    const contextJson = jexl.evalSync(
      contextText.replace(";", "").replace(/:-/g, ":0-").replace(/: -/g, ":0-"),
      parameter
    )[0];

    // 図形情報を参照する
    const shapeText = await fetchFileContents({
      url: props.shapeUrl,
      isBrowser: props.isBrowser,
    });
    // 関数の追加: degreeをRadianに変換する
    jexl.addTransform("degree", (value: number) => {
      return (value * Math.PI) / 180;
    });
    // jsファイルでJEXLに変換できないものを文字列から除外する
    // jexlは負の数を処理できないため、"-a"は"0-a"に変換する
    const shapeData = jexl.evalSync(
      shapeText.replace(";", "").replace(/:-/g, ":0-").replace(/: -/g, ":0-"),
      contextJson
    );
    for (const shape of shapeData) {
      // 図形情報をGeometryに変換する
      const shapeListItem = await this.convertToShape(shape);
      // shapeListItemが空でない場合のみ処理を行う
      if (shapeListItem.length > 0) {
        // indexがnullのものはマージできないため、マージ対象外として扱う
        if (shapeListItem[0].index !== null) {
          shapeList.push(...shapeListItem);
        } else {
          notMergeObjects.push(...shapeListItem);
        }
      }
    }
    // マテリアルを定義する
    const applyMaterial = material ?? Material.standard();
    // マージできるオブジェクトはマージして適用する
    if (shapeList.length > 0) {
      const geometry = ShapeGroup.shapes(shapeList);
      const mesh = new THREE.Mesh(geometry!, applyMaterial);
      scene.add(mesh);
    }
    // マージできないオブジェクトはそのまま適用する
    if (notMergeObjects.length > 0) {
      notMergeObjects.forEach((object) => {
        const mesh = new THREE.Mesh(object, applyMaterial);
        scene.add(mesh);
      });
    }
  }
}
