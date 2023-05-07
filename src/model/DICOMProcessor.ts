//このスクリプトではImageDataを扱わない
//ImageDataを作成する際にカラーかグレーかを判別する必要がある
//そのため、ImageDataはrenderImg.tsの方で作成する

//DICOM処理ライブラリとしてdicom-parserを使用
import dicomParser from 'dicom-parser';

import { InputType } from '../component/InputProcessor';

//tested.indexeddb.tsからDICOMDatabaseをimport
import { dicomDB } from '../database/dexie.db';

// import { ImageStructure } from './imageProcessor';

//dicomから画像を得るために必要な情報を抽出する
//得た画像に名前をつけるためにtagから情報を抽出し、結びつける
//単体のDICOMファイルを処理するクラス
export class SingleDICOM {
  //input.tsxから受け取ったinputを読み込み、dicomParser.Datasetを返す
  readDICOM = (input: InputType): dicomParser.DataSet | void => {
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
      
      

    //dicomDataSetのうち、Transfer Syntax UIDを取得し、再度dicomParserに渡す
    //dicomParserはTransfer Syntax UIDによって、dicomを読み込む方法を変える
    let dicomDataSet = dicomParser.parseDicom(inputUint8Array, { untilTag: 'x00020010' });
    const option = { TransferSyntaxUID: dicomDataSet.string('x00020010') };

    //キャストしたinputUint8ArrayをdicomParserに渡し、dicomを読み込む
    return dicomParser.parseDicom(inputUint8Array, option); 

  };
 
 // //dicomから画像を得るために必要な情報を抽出し、imageStructureを返す
 // getImgInfoFromDICOM(dicom: dicomParser.DataSet): ImageStructure {
 //   // ピクセルデータが格納されたエレメントを取得する
 //   const pixelElement = dicom.elements.x7fe00010!;
   
 //   return {
 //     pixelData: new Uint16Array(dicom.byteArray.buffer, pixelElement.dataOffset, pixelElement.length / 2),
 //     width: dicom.uint16('x00280011')!,
 //     height: dicom.uint16('x00280010')!,
 //     windowWidth: dicom.uint16('x00281050')!,
 //     windowCenter: dicom.uint16('x00281051')!,
 //     rescaleIntercept: dicom.floatString('x00281052')!,
 //     rescaleSlope: dicom.floatString('x00281053')!,
 //   }
 // }
 
  
  //databaseにdicomを格納する
  sendDICOMtoDB = async (dicom: dicomParser.DataSet): Promise<void> => {
    try {
      await dicomDB.dcmStore.add({
        section: 'temp',
        dcmName: dicom.string('x0008103e')!,
        dcmDS: JSON.stringify(dicom)
      })
      console.log('DICOMをDBに格納しました.section:temp')
    }
    catch (error) {
      console.log(error);
    }
  }
}

////このクラスはDICOMHandler複数のDICOMファイルを扱う.そのためにSingleDICOMを継承する
//export class MultiDICOM  extends SingleDICOM {
//  dicom: dicomParser.DataSet[];
//  imageStructure: ImageStructure[];

//  //constructorでinput.tsxから受け取った複数のInputType配列を読み込む
//  constructor(input: InputType[]) {
//    super();
//    this.dicom = [];
//    this.imageStructure = [];

//    //複数のinputを引数に、readDICOMを実行し、dicomParser.Datasetを作成
//    input.forEach((input) => {
//      this.readDICOM(input);
//    });

//    //dicomをdatabaseに保存
//    this.sendDICOMtoDB();

//    //複数のdicomを引数に、getImgInfoFromDICOMを実行し、imageStructureを作成
//    this.dicom.forEach((dicom) => {
//      this.imageStructure.push(this.getImgInfoFromDICOM(dicom));
//    }
//    );
    
//    //imageStructureをdatabaseに保存
//    this.sendImgInfoToDB();

//  }
  
//  //testDBにdicomをsendする
//  sendDICOMtoDB = (): void => {
//    if (this.dicom.length === 0) return;
//    testDB.dicom.push(...this.dicom);
//  };

//  //imageStructureをDataBaseに格納する
//  sendImgInfoToDB = (): void => {
//    if (this.imageStructure.length === 0) return;
//    testDB.imageStructure.push(...this.imageStructure);
//  }

//}
