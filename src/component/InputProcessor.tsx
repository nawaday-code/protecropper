//clientからのinputを受け取る
//inputはdrag&dropと参照ボタンの2つ
//drag&dropはreact-dndを使用
//参照ボタンはinput type="file"を使用

import React, { useRef, useCallback } from 'react';
import { useDrop, DropTargetMonitor } from 'react-dnd';
//nativeTypesをimport
import { NativeTypes } from 'react-dnd-html5-backend';
import homeStyle from '../views/homeStyle.module.css';
//SingleDICOMをimport
import { SingleDICOM } from '../model/DICOMProcessor';


const MAX_FILE_SIZE_BYTES = 5000000;

export type InputType = ArrayBuffer | string | null;

const singleDICOM = new SingleDICOM();

// inputされたファイルをbyteとして読み込む
const readAndProcessFile = async (file: File) => {
    // ファイルサイズのフィルタリングを行う
    if (file.size > MAX_FILE_SIZE_BYTES) {
        return;
    }

    // ファイルをbyteとして読む
    const arrayBuffer = await readFileAsArrayBuffer(file);
    if (!arrayBuffer) {
      return;
    }
  
    // SingleDICOMスクリプトのreadDICOMへarrayBufferを渡し、dicomデータを受け取る
    const dicom = singleDICOM.readDICOM(arrayBuffer);
    if (!dicom) {
      return;
    }
  
    // dicomをDBへ保存する
    singleDICOM.sendDICOMtoDB(dicom)
    
    console.log("success: readAndProcessFile")
};

// 非同期でファイルをbyteとして読み込む
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer | undefined> => {
return new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = () => resolve(reader.result as ArrayBuffer);
  reader.onerror = () => {
    console.log("error");
    reject();
  };
});
};

const readAsByteArray = async (files:FileList) => {
    // ファイルリストを配列に変換
    const filesArray = Array.from(files);

    // 非同期で各ファイルの処理を実行
    await Promise.all(filesArray.map((file) => readAndProcessFile(file)));
};

interface DropCollectedProps {
  isOver: boolean;
  canDrop: boolean;
  }

interface props{
  onUploadComplete: () => void;
}
  
// databaseへのアップロードが完了したら、onUploadCompleteを呼び出す
export const InputProcessor: React.FC<props> = ({onUploadComplete}) => {
    
  const inputRef = useRef<HTMLInputElement>(null);
  
  const uploadData = useCallback(async (files: FileList) => {
    await readAsByteArray(files);
    onUploadComplete();

  }, [onUploadComplete]);
  
  
    // react-dndのドロップゾーンを設定
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: NativeTypes.FILE,
    drop: (item: { files: FileList }, monitor: DropTargetMonitor) => uploadData(item.files),
    collect: (monitor: DropTargetMonitor): DropCollectedProps => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
  
  //ファイルを開くをクリックしたときの処理
  const handleFileOpen = () => {
      inputRef.current?.click();
  };
  
  // ファイルが選択された後の処理は、ondropHandlerと同じ
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
          uploadData(e.target.files);
      }
  };
 
  const isActive = isOver && canDrop;

  // ドロップゾーンの描画
  return (
    <form ref={drop}
        // ドラッグ中は背景色を変える
        style={{ backgroundColor: isActive ? '#87bac9' : "#4796ad" }}

        className={homeStyle['container1']}>
        <span className={homeStyle['text02']}>
          <span>
            <span>ここにDICOMを</span>
            <br></br>
            <span>drop</span>
            <br></br>
            <span>または</span>
          </span>
        </span>
        <span onClick={handleFileOpen} style={{'cursor': 'pointer'}} className={homeStyle['text09']}>
          <span>ファイルを開く</span>
        </span>
        <input
          type="file"
          id="file"
          accept=".dcm"
          ref={inputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
      </form>
  );
  
};
export default InputProcessor;
