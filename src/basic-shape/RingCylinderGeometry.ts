import { BufferGeometry, Vector3, Float32BufferAttribute } from "three";

interface RingCylinderGeometryParameters {
  innerRadius: number;
  outerRadius: number;
  thetaSegments: number;
  thetaStart: number;
  thetaLength: number;
  height: number;
  isDrawEndFace: boolean;
}

/**
 * A class for generating a two-dimensional ring geometry.
 *
 * ```js
 * const geometry = new THREE.RingGeometry( 1, 5, 32 );
 * const material = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
 * const mesh = new THREE.Mesh( geometry, material );
 * scene.add( mesh );
 * ```
 *
 * @augments BufferGeometry
 */
class RingCylinderGeometry extends BufferGeometry {
  parameters: RingCylinderGeometryParameters;

  /**
   * Constructs a new ring geometry.
   *
   * @param {number} [innerRadius=0.5] - The inner radius of the ring.
   * @param {number} [outerRadius=1] - The outer radius of the ring.
   * @param {number} [thetaSegments=32] - Number of segments. A higher number means the ring will be more round. Minimum is `3`.
   * @param {number} [phiSegments=1] - Number of segments per ring segment. Minimum is `1`.
   * @param {number} [thetaStart=0] - Starting angle in radians.
   * @param {number} [thetaLength=Math.PI*2] - Central angle in radians.
   */
  constructor(
    innerRadius = 0.5,
    outerRadius = 1,
    thetaSegments = 32,
    thetaStart = 0,
    thetaLength = Math.PI * 2,
    height = 1,
    isDrawEndFace = true
  ) {
    super();

    //@ts-ignore
    this.type = "RingCylinderGeometry";

    /**
     * Holds the constructor parameters that have been
     * used to generate the geometry. Any modification
     * after instantiation does not change the geometry.
     *
     * @type {Object}
     */
    this.parameters = {
      innerRadius: innerRadius,
      outerRadius: outerRadius,
      thetaSegments: thetaSegments,
      thetaStart: thetaStart,
      thetaLength: thetaLength,
      height: height,
      isDrawEndFace: isDrawEndFace,
    };

    thetaSegments = Math.max(3, thetaSegments);

    // buffers

    const indices = [];
    const vertices = [];

    // some helper variables

    const vertex = new Vector3();

    // generate vertices, normals and uvs

    for (let i = 0; i <= thetaSegments; i++) {
      // values are generate from the inside of the ring to the outside

      const p = i * 4;
      const segment = thetaStart + (i / thetaSegments) * thetaLength;

      // vertex

      vertex.x = (innerRadius / 2) * Math.cos(segment);
      vertex.y = (innerRadius / 2) * Math.sin(segment);

      vertices.push(vertex.x, 0, vertex.y);
      vertices.push(vertex.x, height, vertex.y);

      // vertex

      vertex.x = (outerRadius / 2) * Math.cos(segment);
      vertex.y = (outerRadius / 2) * Math.sin(segment);

      vertices.push(vertex.x, 0, vertex.y);
      vertices.push(vertex.x, height, vertex.y);

      if (i != 0) {
        // 直前の線の開始点
        const bp = p - 4;

        const p1 = p; // 内周底面
        const p2 = p + 1; // 内周上面
        const p3 = p + 2; // 外周底面
        const p4 = p + 3; // 外周上面
        const bp1 = bp; // 直前の内周底面
        const bp2 = bp + 1; // 直前の内周上面
        const bp3 = bp + 2; // 直前の外周底面
        const bp4 = bp + 3; // 直前の外周上面

        // 四角形を描画する
        // 底面
        indices.push(p1, bp1, bp3);
        indices.push(p1, bp3, p3);
        // 上面（上方向に面を向ける）
        indices.push(p2, bp4, bp2);
        indices.push(p4, bp4, p2);
        // 内周部側面
        indices.push(bp2, bp1, p2);
        indices.push(bp1, p1, p2);
        // 外周部側面
        indices.push(bp3, bp4, p4);
        indices.push(bp3, p4, p3);
      }
    }

    if (isDrawEndFace) {
      // 端面を描画する
      {
        const p = 0; // 最初の線の開始点
        const p1 = p; // 内周底面
        const p2 = p + 1; // 内周上面
        const p3 = p + 2; // 外周底面
        const p4 = p + 3; // 外周上面

        // 端面
        indices.push(p1, p2, p3);
        indices.push(p2, p4, p3);
      }
      // 終端面を描画する
      {
        const p = thetaSegments * 4; // 最後の線の開始点
        const p1 = p; // 内周底面
        const p2 = p + 1; // 内周上面
        const p3 = p + 2; // 外周底面
        const p4 = p + 3; // 外周上面

        // 端面
        indices.push(p1, p3, p2);
        indices.push(p2, p3, p4);
      }
    }

    // build geometry

    this.setIndex(indices);
    this.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    this.computeVertexNormals();
  }

  copy(source: any) {
    super.copy(source);

    this.parameters = Object.assign({}, source.parameters);

    return this;
  }

  /**
   * Factory method for creating an instance of this class from the given
   * JSON object.
   *
   * @param {Object} data - A JSON object representing the serialized geometry.
   * @return {RingGeometry} A new instance.
   */
  static fromJSON(data: RingCylinderGeometryParameters) {
    return new RingCylinderGeometry(
      data.innerRadius,
      data.outerRadius,
      data.thetaSegments,
      data.thetaStart,
      data.thetaLength,
      data.height,
      data.isDrawEndFace
    );
  }
}

export { RingCylinderGeometry };
