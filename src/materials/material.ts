import * as THREE from "three";

export default class Material {
  static standard() {
    return new THREE.MeshStandardMaterial({
      color: "#7444ff",
      flatShading: true,
      side: THREE.DoubleSide,
    });
  }
}
