import * as THREE from "three";
import { LatheGeometry, CylinderGeometry } from "three";
import { RingCylinderGeometry } from "../basic-shape/RingCylinderGeometry";

/**
 * 回転体を定義する
 */
namespace RotateShape {
  interface ShapePoint {
    x: number;
    y: number;
  }

  /**
   * ポイントをZ軸を中心に回転させて、回転体を作成する
   */
  export function fromPoints(props: {
    points: ShapePoint[];
    center: {
      x: number;
      z: number;
    };
  }): THREE.BufferGeometry {
    const { x, z } = props.center;
    const geometry = new LatheGeometry(
      props.points.map((point) => new THREE.Vector2(point.x, point.y)),
      128,
      0,
      Math.PI * 2
    );
    geometry.translate(x, 0, z);
    return geometry;
  }

  /**
   * 半径から円柱を作成する
   */
  export async function fromRadius(props: {
    floorRect: {
      centerX: number;
      centerZ: number;
      radius: number;
    };
    height: number;
    floorLevel?: number;
  }): Promise<THREE.BufferGeometry> {
    const { floorRect, height } = props;
    const { centerX, centerZ, radius } = floorRect;
    const geometry = new CylinderGeometry(radius, radius, height, 128);
    geometry.translate(centerX, height / 2 + (props.floorLevel ?? 0), centerZ);
    return geometry;
  }

  /**
   * 内側の半径と外側の半径から、円弧状の円柱を作成する
   */
  export async function fromRadiusArc(props: {
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    center: {
      x: number;
      z: number;
    };
    height: number;
    floorLevel?: number;
    isDrawEndFace?: boolean;
  }): Promise<THREE.BufferGeometry> {
    const {
      innerRadius,
      outerRadius,
      height,
      startAngle,
      endAngle,
      center,
      floorLevel,
      isDrawEndFace,
    } = props;

    const geometry = new RingCylinderGeometry(
      innerRadius,
      outerRadius,
      256,
      startAngle,
      endAngle - startAngle,
      height,
      isDrawEndFace ?? true
    );
    geometry.translate(center.x, floorLevel ?? 0, center.z);
    return geometry;
  }
}

export default RotateShape;
