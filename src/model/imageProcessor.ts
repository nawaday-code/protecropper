//画像処理を行うクラス



export interface ImageStructure {
  pixelData: Uint16Array;
  width: number;
  height: number;
  windowWidth: number;
  windowCenter: number;
  rescaleIntercept: number;
  rescaleSlope: number;
}

//このクラスは１枚の画像を扱う
export class SingleImgProcessor {
  //ImageDataの作成
  createImageData(imageStructure: ImageStructure): ImageData {
    const pixelDataGray = this.convertToImageData(imageStructure);
    return this.applyDicomLUT(pixelDataGray, imageStructure);
  }

  /**
   * ImageStructureからImageDataを作成する
   *
   * @param image ImageStructure オブジェクト
   * @returns ImageData オブジェクト
   */
  convertToImageData(image: ImageStructure): ImageData {
    // pixelData をグレースケールの値に変換するための一時配列を作成
    const pixelDataGray = new Uint8ClampedArray(image.pixelData.length);
  
    // 表示するPixel Value Rangeを計算
    const maxPixelValue = image.windowCenter + image.windowWidth / 2;
    const minPixelValue = image.windowCenter - image.windowWidth / 2;
  
    // ピクセルデータの長さを取得（最適化用）
    const pixelDataLength = image.pixelData.length;
  
    // ピクセルデータを処理
    for (let i = 0; i < pixelDataLength; i++) {
      // Rescale（データをリスケールして、Hounsfield Units -> Pixel Valuesへの変換を実行）
      image.pixelData[i] = image.pixelData[i] * image.rescaleSlope + image.rescaleIntercept;
  
      // Convert to Gray （ウィンドウ幅を使ってPixel Value Rangeをマッピングし、グレースケールの値に変換）
      pixelDataGray[i] = Math.round(((image.pixelData[i] - minPixelValue) / (maxPixelValue - minPixelValue)) * 255);
    }
  
    // ImageDataオブジェクトを作成して返す
    const imageData = new ImageData(pixelDataGray, image.width, image.height);
    return imageData;
  }
  

  /**
  * 画像データを LUT 変換する関数
  * @param windowWidth ウィンドウ幅
  * @param windowCenter ウィンドウレベル
  */
  public applyLUT(imageData:ImageData, windowWidth: number, windowCenter: number): ImageData {

    //imageDataはDatabaseに格納されているImageStructureから再生成可能
    //そのため、メモリを節約するために、imageDataを上書きする方針で実装する

    const pixelData = imageData.data;
    const byteLen = pixelData.length;
    const uintArr = new Uint32Array(pixelData.buffer);

    const min = windowCenter - windowWidth / 2;
    const scale = 255 / windowWidth;

    for (let i = 0; i < byteLen; i++) {
      const val = pixelData[i];
      const newValue = Math.round((val - min) * scale);
      uintArr[i] = (newValue << 16) | (newValue << 8) | newValue | 0xff000000; // alpha値は255（不透明）で固定する
    }
    
    imageData.data.set(new Uint8ClampedArray(uintArr.buffer), 0); // 書き換えたピクセルデータを this.imageData にセットする

    return imageData;
  }

  /**
   * 自動で LUT 変換を施す関数、すべてのピクセル値の下位1%と上位1%を飽和させる
   */
  public applyAutoLUT(imageData:ImageData): ImageData {

    const pixelData = imageData.data;
    const byteLen = pixelData.length;
    const uintArr = new Uint32Array(pixelData.buffer);

    const min = Math.min(...pixelData);
    const max = Math.max(...pixelData);
    const scale = 255 / (max - min);

    for (let i = 0; i < byteLen; i++) {
      const val = pixelData[i];
      const newValue = Math.round((val - min) * scale);
      uintArr[i] = (newValue << 16) | (newValue << 8) | newValue | 0xff000000; // alpha値は255（不透明）で固定する
    }

    imageData.data.set(new Uint8ClampedArray(uintArr.buffer), 0); // 書き換えたピクセルデータを this.imageData にセットする
    
    return imageData;
  }
  
  //dicomにあるwindowWidthとwindowCenterを用いてLUT変換を行う関数
  public applyDicomLUT(imageData: ImageData, imageStructure: ImageStructure): ImageData {
    return this.applyLUT(imageData, imageStructure.windowWidth, imageStructure.windowCenter);
  }

}

//複数の画像を扱うクラス
//SingleImgProcessorを継承する
//複数の画像に対して画像処理を行う
//処理を行う前後の画像をそれぞれDatabaseに格納する
export class MultiImgProcessor extends SingleImgProcessor {
  
  imgStructures: ImageStructure[];
  
  constructor(imgStructures: ImageStructure[]) {
    super();
    this.imgStructures = imgStructures;
  }


  
}

  