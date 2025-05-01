import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import ShapeBase from "./shapes/shape-base";

/**
 * Three.jsの基本的なモジュールを定義する
 * 実装のベース: https://github.com/SahilK-027/threejs-template
 */
export class ThreeJsBaseModule {
  public scene: THREE.Scene; // シーン
  private sizes: { width: number; height: number }; // 画面サイズ
  private camera: THREE.PerspectiveCamera | null = null; // カメラ
  private renderer: THREE.WebGLRenderer | null = null; // レンダラー
  private canvas: HTMLCanvasElement | null = null; // 出力先のHTML
  private controls: OrbitControls | null = null; // 画面のコントローラ
  private isBrowser: boolean = true; // ブラウザかどうかのフラグ

  constructor(props: {
    isBrowser: boolean; // ブラウザかどうかのフラグ
  }) {
    // シーンを確保、保持する
    this.scene = new THREE.Scene();
    // フラグを保持する
    this.isBrowser = props.isBrowser;
    // 画面サイズの初期値を定義する
    this.sizes = { width: 1, height: 1 };
  }

  /**
   * モジュールをHTMLに接続する
   */
  connectToHTMLCanvas(canvasName: string) {
    // 画面サイズを参照する
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    // カメラを定義する
    this.camera = new THREE.PerspectiveCamera(
      75, // 視野角
      this.sizes.width / this.sizes.height,
      0.1, // 画面手前までの距離
      100 // 画面奥までの距離
    );
    // キャンバスを参照、レンダラーを作成する
    this.canvas = document.querySelector(canvasName);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas!,
      alpha: true,
    });
    // 画面のコントローラを定義する
    this.controls = new OrbitControls(this.camera, this.canvas);

    // カメラの初期化をする
    this.initCamera(this.camera);
    // レンダラーを初期化する
    this.initRenderer(this.renderer);
    // 光源を初期化する
    this.initLights();
    // コントローラを初期化する
    this.initControls(this.controls);
    // イベントリスナーを追加する
    this.addEventListeners();
    // アニメーションを開始する
    this.animate(this.controls, this.camera, this.renderer);
  }

  /**
   * カメラを初期化する
   */
  initCamera(camera: THREE.PerspectiveCamera) {
    camera.position.z = 3;
    this.scene.add(camera);
  }

  /**
   * レンダラーを初期化する
   */
  initRenderer(renderer: THREE.WebGLRenderer) {
    renderer.setSize(this.sizes.width, this.sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  /**
   * 光源を初期化する
   */
  initLights() {
    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    const hemisphereLight = new THREE.HemisphereLight(0x7444ff, 0xff00bb, 0.5);
    const pointLight = new THREE.PointLight(0x7444ff, 1, 100);
    pointLight.position.set(0, 3, 4);

    this.scene.add(ambientLight, directionalLight, hemisphereLight, pointLight);

    const size = 10;
    const divisions = 10;

    const gridHelper = new THREE.GridHelper(size, divisions);
    this.scene.add(gridHelper);
  }

  /**
   * 画面に被写体を読み込む
   */
  async updateMesh(parameter: {
    contextUrl: string;
    modelUrl: string;
    data: any;
  }) {
    return new ShapeBase().withResetScene(this.scene).addObjectToSceneWithUrl(
      this.scene,
      {
        contextUrl: parameter.contextUrl,
        shapeUrl: parameter.modelUrl,
        isBrowser: this.isBrowser,
      },
      parameter.data
    );
  }

  /**
   * コントローラを初期化する
   */
  initControls(controls: OrbitControls) {
    controls.enableDamping = true;
  }

  /**
   * リサイズイベントを登録する
   */
  addEventListeners() {
    window.addEventListener("resize", () => this.onResize());
  }

  /**
   * ウィンドウのリサイズ時の画面更新を定義する
   */
  onResize() {
    // 細心の画面サイズを反映する
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    // カメラのアスペクト比を更新する
    if (this.camera !== null) {
      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();
    }

    // レンダラーの設定を更新する
    if (this.renderer !== null) {
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }

  /**
   * アニメーションを実行する
   * ※コントローラの操作反映もアニメーションに含む
   */
  animate(
    controls: OrbitControls,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) {
    // コントローラの操作を反映する
    controls.update();

    // レンダリングを実行する
    renderer.render(this.scene, camera);

    // 次のアニメーションをリクエストする
    window.requestAnimationFrame(() =>
      this.animate(controls, camera, renderer)
    );
  }

  /**
   * 現在のシーンを元に、STLファイルを出力する
   */
  export(props: { exportFileName: string }) {
    const stl = new STLExporter().parse(this.scene, {
      binary: false,
    });
    if (!this.isBrowser) {
      // Node.js環境での処理
      import("fs").then((fs) => {
        // ファイルを出力する
        fs.writeFileSync(props.exportFileName, stl, "utf8");
      });
    } else {
      // ファイルをブラウザ上でダウンロードする
      const blob = new Blob([stl], { type: "application/octet-stream" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.target = "_blank";
      a.download = props.exportFileName;
      a.click();
    }
  }
}
