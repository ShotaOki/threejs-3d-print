import { default as yargs } from "yargs";
import { hideBin } from "yargs/helpers";
import { ThreeJsBaseModule } from "./three-js-base-module";
import { SelectBox } from "./select-box/select-box";

const args = yargs(hideBin(process.argv))
  .command("export", "Export a stl file")
  .option("data", {
    requiresArg: true,
    alias: "d",
    type: "string",
    description: "Path to the data file",
  })
  .option("context", {
    requiresArg: true,
    alias: "c",
    type: "string",
    description: "Path to the context file",
  })
  .option("export", {
    alias: "e",
    type: "string",
    description: "Path to the export file",
  })
  .parseSync();

function cliMain() {
  const item = new ThreeJsBaseModule({
    isBrowser: false,
  });
  item
    .updateMesh({
      contextUrl: args.context ?? "",
      modelUrl: args.data ?? "",
      data: SelectBox.CASE_PARAMETER,
    })
    .then(() => {
      console.log("Exported");
      item.export({
        exportFileName: args.export ?? "object.stl",
      });
    });
}

cliMain();
