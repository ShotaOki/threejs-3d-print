import * as THREE from "three";

export default class Material {
  /**
   * 3Dプリント用の材質を作成する
   */
  static standard() {
    return new THREE.MeshStandardMaterial({
      color: "#7444ff",
      flatShading: true,
      side: THREE.DoubleSide,
    });
  }
}
