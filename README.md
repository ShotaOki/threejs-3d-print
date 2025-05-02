# 3Dプリントのためのthree.js

## 環境構築

このREADMEのあるディレクトリで、以下のコマンドを実行します

```bash
npm i
```

## ブラウザで実行する

以下のコマンドを実行すると、Webブラウザで動作します

```bash
npm run dev
```

実行後、ブラウザでhttp://localhost:5173を開きます

## CLI上で実行する

以下のコマンドを実行すると、CLIで動作します

```bash
npm run cli -- export --data ${データファイルのパス} --context ${コンテキストファイルのパス} --export ${出力するSTLファイル}
```

データファイルのパスは、例えば`public\shape-card-case\case.js`です。  
JSON（JEXL形式）のデータで、図形の座標を指定します。  
※JEXLはJSONと同じ形式ですが、数式をJSONの中に書くことで数値の計算ができます。また、変数の利用ができます

コンテキストファイルのパスは、例えば`public\shape-card-case\case-context.js`です。
JSON（JEXL形式）のデータで、データファイルで利用する変数を定義します

引数に`--workingDirectory`を指定すると、データファイルから参照するSVGファイルのルートディレクトリを変更できます。  
未指定の場合はこのプロジェクトのpublicディレクトリがルートディレクトリに指定されます

**YAMLを利用する場合**

また、JEXLの他、YAMLファイルを利用することもできます  
YAMLファイルの場合はcontentsをルートにして定義します

```yaml
contents:
# 床面を描画する
- type: "BoxToBuild.fromFloorRect" 
  props:
    floorRect:
      x1: -10.0
      ...
```

YAMLファイルのサンプルは、yaml-sampleディレクトリにあります。  
次のように実行します。

```bash
npm run cli -- export --data yaml-sample\box.yaml --export ..\box.stl
```

# リソース

SVGデータの参照元  
https://ja.pattern.monster/

SVGデータの参照元  
https://fonts.google.com/icons
