import { default as yargs } from "yargs";
import { hideBin } from "yargs/helpers";
import { ThreeJsBaseModule } from "./three-js-base-module";
import { SelectBox } from "./select-box/select-box";

/**
 * yargsを使用してコマンドライン引数を解析および処理します。
 *
 * 以下のコマンドとオプションがサポートされています:
 *
 * ### コマンド:
 * - `export`: STLファイルをエクスポートします。
 *
 * ### オプション:
 * - `--data`, `-d` (string, 必須): データファイルのパスを指定します。
 * - `--context`, `-c` (string, 必須): コンテキストファイルのパスを指定します。
 * - `--export`, `-e` (string, 任意): エクスポートファイルのパスを指定します。
 *
 * @constant
 */
const args = yargs(hideBin(process.argv))
  .command("export", "STLファイルをエクスポートします")
  .option("data", {
    requiresArg: true,
    alias: "d",
    type: "string",
    description: "データファイルのパス",
  })
  .option("context", {
    requiresArg: true,
    alias: "c",
    type: "string",
    description: "コンテキストファイルのパス",
  })
  .option("export", {
    alias: "e",
    type: "string",
    description: "エクスポートファイルのパス",
  })
  .option("workingDirectory", {
    alias: "w",
    type: "string",
    description: "ワーキングディレクトリのパス。省略時はpublicディレクトリとする。",
  })
  .parseSync();

/**
 * コマンドライン引数を解析し、STLファイルをエクスポートするメイン関数です。
 */
function cliMain() {
  const item = new ThreeJsBaseModule({
    isBrowser: false,
  });
  // ルートディレクトリをPublicに指定する
  const parameter = JSON.parse(JSON.stringify(SelectBox.CASE_PARAMETER));
  if (args.workingDirectory === undefined) {
    parameter.rootDirectory = process.cwd() + "\\public\\";
  } else {
    parameter.rootDirectory = args.workingDirectory;
  }
  // ポリフィルを設定する
  setupNodeEnvironmentPolyfill();
  // メッシュをシーンに登録する
  item
    .updateMesh({
      contextUrl: args.context ?? "",
      modelUrl: args.data ?? "",
      data: parameter,
    })
    .then(() => {
      // STLをエクスポートする
      console.log("Exported");
      item.export({
        exportFileName: args.export ?? "object.stl",
      });
    });
}

function setupNodeEnvironmentPolyfill() {
  import("jsdom").then((jsdom) => {
    const { JSDOM } = jsdom
    global.DOMParser = new JSDOM().window.DOMParser
  })
}

cliMain();
