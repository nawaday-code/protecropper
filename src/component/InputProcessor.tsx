//clientからのinputを受け取る
//inputはdrag&dropと参照ボタンの2つ
//drag&dropはreact-dndを使用
//参照ボタンはinput type="file"を使用

import React, { useState, useCallback } from 'react';
import { useDrop, DropTargetMonitor } from 'react-dnd';
//nativeTypesをimport
import { NativeTypes } from 'react-dnd-html5-backend';


//SingleDICOMProcessorをimport
// import { readDICOM, getImgInfoFromDICOM, sendDICOMtoDB, sendImgInfoToDB } from '../model/SingleDICOMProcessor';

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
  
    // SingleDICOMスクリプトのgetImgInfoFromDICOMへdicomを渡し、imageStructureデータを受け取る
    const imageStructure = singleDICOM.getImgInfoFromDICOM(dicom);
  
    // dicomをDBへ保存する
    singleDICOM.sendDICOMtoDB(dicom);
  
    // imageStructureをDBへ保存する
    singleDICOM.sendImgInfoToDB(imageStructure);
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

//drag&dropの処理
//useDragを使用
//dropされるfileはDICOMファイルを想定
//itemはtypeとidを持つ
//collectはisDraggingを持つ
//isDraggingはドラッグ中かどうかを判定する
//ドラッグ中は背景色を変える
interface DropCollectedProps {
    isOver: boolean;
    canDrop: boolean;
    }

//export default する関数
export const InputProcessor: React.FC = () => {
    
  // ドロップされたファイルを受け取るコールバック
    const onDrop = useCallback((files: FileList) => {
        readAsByteArray(files);
    }, []);

    // react-dndのドロップゾーンを設定
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: NativeTypes.FILE,
    drop: (item: { files: FileList }, monitor: DropTargetMonitor) => onDrop(item.files),
    collect: (monitor: DropTargetMonitor): DropCollectedProps => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
  
  // ファイル参照ボタンが押されたときの処理
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            readAsByteArray(e.target.files as FileList );
        }
    };

  
  const isActive = isOver && canDrop;

  return (
        <form
         ref={drop}
         // ドラッグ中は背景色を変える
        style={{ backgroundColor: isActive ? '#f0f0f0' : '#ffffff' }}
        >
            <span className="home-text01">
                <span>ここにDICOMをドロップ</span>
                <br />
                <span>または</span>
                <br />
            </span>
            <label htmlFor="file_open" className="home-button button">
                ファイルを参照
                <input
                    type="file"
                    id="file_open"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                    multiple
                    accept=".dcm, .dicom"
                />
            </label>    
        </form>
    );
}

export default InputProcessor;
