//DICOM処理ライブラリとしてdicom-parserを使用
import dicomPerser from 'dicom-parser';

import { InputType } from '../component/InputProcessor';
////databaseのtest.db.tsからtestDBをimport
import { testDB } from '../database/test.db';

import { ImageStructure } from './imageProcessor';


//input.tsxから受け取ったinputを読み込み、dicomParser.Datasetを返す
export function readDICOM(input: InputType): dicomPerser.DataSet | void{
     
    try {
      if (!input) return;
      
      let inputUint8Array: Uint8Array;
      
      if (typeof input === 'string') {
        // string型の場合
          const len = input.length;
          inputUint8Array = new Uint8Array(len);
        
          for (let i = 0; i < len; i++) {
            inputUint8Array[i] = input.charCodeAt(i);
          }
      } else if (input instanceof ArrayBuffer) {
        // ArrayBuffer型の場合
        inputUint8Array = new Uint8Array(input);
      } else {
        throw new Error('Invalid input type');
      }
        
      //キャストしたinputUint8ArrayをdicomParserに渡し、dicomを読み込む
      return dicomPerser.parseDicom(inputUint8Array);

      
    } catch (error) {
      alert('DICOMが読み込めませんでした。¥n 入力したファイルではなく、処理に問題があるようです。');
      console.log(error);
      return
    }
  };
 
  //dicomから画像を得るために必要な情報を抽出し、imageStructureを返す
export function getImgInfoFromDICOM(dicom: dicomPerser.DataSet): ImageStructure {
   // ピクセルデータが格納されたエレメントを取得する
    const pixelElement = dicom.elements.x7fe00010!;
   
    return {
      pixelData: new Uint16Array(dicom.byteArray.buffer, pixelElement.dataOffset, pixelElement.length / 2),
      width: dicom.uint16('x00280011')!,
      height: dicom.uint16('x00280010')!,
      windowWidth: dicom.uint16('x00281050')!,
      windowCenter: dicom.uint16('x00281051')!,
      rescaleIntercept: dicom.floatString('x00281052')!,
      rescaleSlope: dicom.floatString('x00281053')!,
    }
  }
   
  //databaseにdicomを格納する
export function sendDICOMtoDB(dicom: dicomPerser.DataSet): void {
    testDB.dicom.push(dicom);
  }
  
  //databaseにimageStructureを格納する
export function sendImgInfoToDB (imageStructure: ImageStructure): void {
    testDB.imageStructure.push(imageStructure);
  }
 