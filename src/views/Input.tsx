//client の　Input Area の処理
//データが送られ終わったら、Database　-> imageProcessor -> Previewへと渡す

//react ライブラリのインポート
import React from 'react';

import InputProcessor from '../component/InputProcessor';
import Preview from './preview';

//初期状態はInputProcessorを表示
//InputProcessor -> SingleDICOM -> Databaseへとデータが送られたら、Previewを表示
const Input: React.FC = () => {
    return (
        <div>
            <InputProcessor />
            <Preview />
        </div>
    );
};

export default Input;
