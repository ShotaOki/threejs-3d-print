export namespace SelectBox {
  export const CASE_PARAMETER = {
    slabDepth: 0.2, // スラブの厚さ
    thinSlabDepth: 0.05, // 薄いスラブの厚さ
    contentsHeight: 7.0, // 内容物の高さ
    contentsWidth: 2.7, // 内容物の幅
    objectHeight: 0.8, // ケースの高さ
    caseBuffer: 0.1, // ケースのバッファ
    numberList: [3, 6], // ケースに表示する数字のリスト
    rootDirectory: "/", // データファイルから参照するファイルのルートディレクトリ
  };
  /**
   * 指定されたインデックスに基づいて選択情報を返します。
   * 
   * @param index - 選択するオブジェクトを識別するためのインデックス。数値または文字列で指定します。
   * @returns 選択されたオブジェクトの情報を含むオブジェクトを返します。該当するインデックスがない場合は `undefined` を返します。
   * 
   * 選択情報には以下のプロパティが含まれます:
   * - `contextUrl`: 対応するコンテキストファイルのURL。
   * - `modelUrl`: 対応するモデルファイルのURL。
   * - `parameter`: 定義済みのパラメータオブジェクト。
   */
  export function convertToSelectedInfo(index: number | string) {
    if (index == 1) {
      return {
        contextUrl: "shape-card-case/tray-context.js",
        modelUrl: "shape-card-case/tray.js",
        parameter: CASE_PARAMETER,
      };
    }
    if (index == 2) {
      return {
        contextUrl: "shape-card-case/case-with-frame-context.js",
        modelUrl: "shape-card-case/case-with-frame.js",
        parameter: CASE_PARAMETER,
      };
    }
    if (index == 3) {
      return {
        contextUrl: "shape-card-case/case-context.js",
        modelUrl: "shape-card-case/case.js",
        parameter: CASE_PARAMETER,
      };
    }
    if (index == 4) {
      return {
        contextUrl: "name-plate/name-plate-context.js",
        modelUrl: "name-plate/name-plate.js",
        parameter: CASE_PARAMETER,
      };
    }
    if (index == 5) {
      return {
        contextUrl: "name-plate/name-plate-context.js",
        modelUrl: "name-plate/name-plate-message.js",
        parameter: CASE_PARAMETER,
      };
    }
    return undefined;
  }

  /**
   * セレクトボックスを作成する関数です。
   * 
   * この関数は、HTMLのセレクトボックス要素を生成し、指定されたオプションを追加して返します。
   * セレクトボックスは、画面上の特定の位置（左上から50px下）に配置されます。
   * 
   * @returns {HTMLSelectElement} 作成されたセレクトボックス要素
   */
  export function createSelectBox() {
    const selectBox = document.createElement("select");
    selectBox.id = "select";
    selectBox.style.position = "absolute";
    selectBox.style.top = "50px";
    selectBox.style.left = "0";

    const options = [
      { value: 1, text: "ケーストレイ" },
      { value: 2, text: "額縁ケース" },
      { value: 3, text: "無地ケース" },
      { value: 4, text: "キーホルダー" },
      { value: 5, text: "スタンプ" },
    ];
    options.forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option.value.toString();
      opt.textContent = option.text;
      selectBox.appendChild(opt);
    });
    return selectBox;
  }
}
