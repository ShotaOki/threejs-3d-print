import "./style.css";
import { ThreeJsBaseModule } from "./three-js-base-module";
import { SelectBox } from "./select-box/select-box.ts";

// テンプレートをセットアップする
const item = new ThreeJsBaseModule({
  isBrowser: true,
});
item.connectToHTMLCanvas("canvas.webgl");

// セレクトボックスを設定する
const element = SelectBox.createSelectBox();
document.body.appendChild(element);

// エクスポート処理を追加する
document.getElementById("export")?.addEventListener("click", () => {
  item.export({
    exportFileName: "object.stl",
  });
  alert("Exported");
});

// セレクトボックスと表示データを紐づける
const applyElementInfo = (selectedValue: number | string) => {
  const info = SelectBox.convertToSelectedInfo(selectedValue);
  if (info !== undefined) {
    const { contextUrl, modelUrl, parameter } = info;
    item
      .updateMesh({
        contextUrl,
        modelUrl,
        data: parameter,
      })
      .then(() => {});
  }
};
applyElementInfo(1);

// セレクトボックスに設定する
document.getElementById("select")?.addEventListener("change", (e) => {
  const selectedValue = (e.target as HTMLSelectElement).value;
  applyElementInfo(selectedValue);
});
