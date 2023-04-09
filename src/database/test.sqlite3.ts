//test用のDatabase objectを作成する
//sqlite3への同時書き込みが発生しているため、エラーが起きている？
//@mapbox/node-pre-gyp/lib/utilにfsが無いと言われる
//fsはファイルの読み書きに使われるモジュール
//sqlite3はなかなか上手く行かなそうなのでとりあえず使用しないでおく。


import { Database } from 'sqlite3';

export const testDB = new Database(':memory:');
