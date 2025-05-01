export async function fetchFileContents(props: {
  url: string;
  isBrowser: boolean;
}) {
  if (props.isBrowser) {
    return await (await fetch(props.url)).text();
  } else {
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
