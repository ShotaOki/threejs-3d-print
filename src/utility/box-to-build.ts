import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils.js";

/**
 * ボックスを作成する
 */
namespace BoxToBuild {
  function _create(props: {
    centerX: number;
    centerZ: number;
    widthX: number;
    widthZ: number;
    height: number;
    floorLevel: number;
  }) {
    const { centerX, centerZ, widthX, widthZ, height, floorLevel } = props;
    const box = new THREE.BoxGeometry(widthX, height, widthZ);
    box.translate(centerX, height / 2 + floorLevel, centerZ);
    return box;
  }

  function _createRadius(props: {
    centerX: number;
    centerZ: number;
    widthX: number;
    widthZ: number;
    radius: number;
    height: number;
    floorLevel: number;
  }) {
    const { centerX, centerZ, widthX, widthZ, height, floorLevel, radius } =
      props;
    const minX = -widthX / 2;
    const maxX = widthX / 2;
    const minZ = -widthZ / 2;
    const maxZ = widthZ / 2;

    const shape = new THREE.Shape();
    shape.moveTo(minX, minZ + radius);
    shape.lineTo(minX, maxZ - radius);
    shape.quadraticCurveTo(minX, maxZ, minX + radius, maxZ);
    shape.lineTo(maxX - radius, maxZ);
    shape.quadraticCurveTo(maxX, maxZ, maxX, maxZ - radius);
    shape.lineTo(maxX, minZ + radius);
    shape.quadraticCurveTo(maxX, minZ, maxX - radius, minZ);
    shape.lineTo(minX + radius, minZ);
    shape.quadraticCurveTo(minX, minZ, minX, minZ + radius);
    shape.closePath();

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: true,
      bevelThickness: 0,
      bevelSize: 0,
    });
    geometry.rotateX(degToRad(90));
    geometry.translate(centerX, height + floorLevel, centerZ);
    return geometry;
  }

  /**
   * 中心とサイズからボックスを作成する
   *
   * @param center 中心座標
   * @param size サイズ
   * @param height 高さ
   * @param floorLevel 床のレベル
   */
  export async function fromCenterAndSize(props: {
    center?: {
      x: number;
      z: number;
    };
    size: {
      widthX: number;
      widthZ: number;
    };
    height: number;
    floorLevel?: number;
  }) {
    const { center, size, height, floorLevel } = props;
    const { x, z } = center ?? { x: 0, z: 0 };
    const { widthX, widthZ } = size;
    return _create({
      centerX: x,
      centerZ: z,
      widthX,
      widthZ,
      height,
      floorLevel: floorLevel ?? 0,
    });
  }

  /**
   * 床になる長方形の情報からボックスを作成する
   *
   * @param floorRect 床の長方形の情報
   * @param height 高さ
   * @param floorLevel 床のレベル
   */
  export async function fromFloorRect(props: {
    floorRect: {
      x1: number;
      z1: number;
      x2: number;
      z2: number;
    };
    radius?: number;
    height: number;
    floorLevel?: number;
  }) {
    const { floorRect, height, floorLevel } = props;
    const { x1, z1, x2, z2 } = floorRect;
    if (props.radius !== undefined) {
      return _createRadius({
        centerX: (x1 + x2) / 2,
        centerZ: (z1 + z2) / 2,
        widthX: Math.abs(x1 - x2),
        widthZ: Math.abs(z1 - z2),
        radius: props.radius,
        height,
        floorLevel: floorLevel ?? 0,
      });
    } else {
      return _create({
        centerX: (x1 + x2) / 2,
        centerZ: (z1 + z2) / 2,
        widthX: Math.abs(x1 - x2),
        widthZ: Math.abs(z1 - z2),
        height,
        floorLevel: floorLevel ?? 0,
      });
    }
  }
}

export default BoxToBuild;
