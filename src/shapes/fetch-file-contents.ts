/**
 * 指定されたURLからファイルの内容を取得する非同期関数です。
 * 実行環境がブラウザかサーバーかによって異なる方法でファイルを読み込みます。
 *
 * @param props.url - ファイルのURLまたはパス。
 * @param props.isBrowser - 実行環境がブラウザである場合は`true`、CLIである場合は`false`。省略した場合は実行環境から取得
 * @returns ファイルの内容を文字列として返します。
 * 
 * @throws ファイルの読み込みに失敗した場合、エラーをスローします。
 */
export async function fetchFileContents(props: {
  url: string;
  isBrowser?: boolean;
}) {
  if ((props.isBrowser !== undefined) ? props.isBrowser : isBrowser()) {
    // ブラウザで実行しているのなら、fetchで値を取得する
    return await (await fetch(props.url)).text();
  } else {
    // CLIで実行しているのなら、fsでローカルファイルから取得する
    const fs = await import("fs");
    const readFileAsync = new Promise<string>((resolve, reject) => {
      fs.readFile(props.url, "utf8", (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }
        resolve(data);
      });
    });
    return await readFileAsync;
  }
}

/**
 * ブラウザで実行しているのならtrueを返す
 */
function isBrowser() {
  return typeof window !== "undefined" && typeof window.document !== "undefined";
}
