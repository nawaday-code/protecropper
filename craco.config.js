//craco.config.jsでwebpackの設定を上書きする
//resolveのところを以下のように書き換える
/*
resolve: {
  fallback: { 'path': require.resolve('path-browserify') },
  extensions: ['.jsx', '.js', '.tsx', '.ts'],
}
*/
//Node.jsではファイルパスを扱うためのpathモジュールが用意されている
//しかし、ブラウザではpathモジュールがないため、path-browserifyを使う

//以下の記載のブラウザ版はfallbackのところに書いてある
// const path = require('path');

//utilモジュールはNode.jsのモジュールで、Node.jsのコアモジュールの一つ
//コンパイルするときにエラーが出るので、utilモジュールをインストールした


module.exports = {
  //pathモジュールの代わりにpath-browserifyを使うように、aliasを設定する 
  webpack: {
    alias: {
      path: "path-browserify",
    },  
  },

  reactScriptsVersion: "react-scripts",
  style: {
    css: {
      loaderOptions: () => {
        return {
          url: false,
        };
      },
    },
  },
};