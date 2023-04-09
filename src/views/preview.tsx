//modelのgetDICOMfromDBを呼び出し、画像データを取得
//取得した画像データをcanvasに描画するReact.FCを作成
import React, { useEffect, useRef, useState } from 'react';

//imageProcessorのインポート
import { SingleImgProcessor } from '../model/imageProcessor';

//inputされたDICOMからの画像や、処理後の画像などさまざまな画像を描画する
//画像は基本的にDatabaseから取得する


const Preview: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imageData, setImageData] = useState<ImageData>();

    useEffect(() => {
        const previewCanvas = canvasRef.current;
        if (previewCanvas && imageData) {
            const ctx = previewCanvas.getContext('2d');
            if (ctx) {
                // ImageDataをcanvasに描画
                ctx.putImageData(imageData, 0, 0);
            }
        }
    }, [imageData]);

    //DICOMProcessorがDatabaseにuploadし終わったら、DatabaseからImageStructureを取得する
    useEffect(() => {
        try {
            const singleImgProcessor = new SingleImgProcessor();

        } catch (error) {
        // エラー処理
            console.error(error);
        }
    }, []);

    return (
        // canvasのサイズはhome.cssの#drop_areaのサイズと同じにする
        <canvas ref={canvasRef} id="preview" width="450" height="510" />
    );
};

export default Preview;
