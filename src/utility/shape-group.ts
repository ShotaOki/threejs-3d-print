import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { SUBTRACTION, ADDITION, Brush, Evaluator } from "three-bvh-csg";

/**
 * 図形をグループ化、一つのSTLに変換できるようにする
 */
namespace ShapeGroup {
  export interface ShapeGroupProps {
    base: THREE.BufferGeometry;
    attach: THREE.BufferGeometry[];
  }
  /**
   * 頂点情報を合成する
   */
  export function shapes(shapeList: THREE.BufferGeometry[]) {
    return BufferGeometryUtils.mergeGeometries(shapeList);
  }

  /**
   * オブジェクトを切り抜く
   */
  export async function subtract(props: {
    base: THREE.BufferGeometry;
    attach: THREE.BufferGeometry[];
  }) {
    // もし処理対象のオブジェクトがないのなら、ベースをそのまま返す
    if (props.attach.length === 0) {
      return props.base;
    }
    const evaluator = new Evaluator();

    // 処理対象のオブジェクトを結合する
    // 結合して処理をする理由はサンプルソースの通り
    // https://github.com/gkjohnson/three-bvh-csg/blob/main/examples/geometry.js
    let scurcptBrash = new Brush(props.attach[0]);
    scurcptBrash.updateMatrixWorld();
    if (props.attach.length >= 2) {
      for (let i = 1; i < props.attach.length; i++) {
        // 2番目以降のオブジェクトを、先頭のオブジェクトに結合していく
        const brush = new Brush(props.attach[i]);
        brush.updateMatrixWorld();
        scurcptBrash = evaluator.evaluate(scurcptBrash, brush, ADDITION);
      }
    }

    // ベースになるオブジェクト
    let currentShape = new Brush(props.base);
    currentShape.updateMatrixWorld();

    // 結合したオブジェクトを使って、削る処理を行う
    currentShape = evaluator.evaluate(currentShape, scurcptBrash, SUBTRACTION);

    return currentShape.geometry;
  }
}

export default ShapeGroup;
