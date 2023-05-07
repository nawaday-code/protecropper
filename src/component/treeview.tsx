//databaseの中身をtreeviewで表示するtsx componentを作成
import React, { useEffect, useState } from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import {useLiveQuery} from 'dexie-react-hooks';

import { assignDCM, dicomDB } from '../database/dexie.db';


interface renderTree{
    id: string;
    name: string;
    children?: renderTree[];
}


const DBTreeView : React.FC = () => {

    const data = useLiveQuery(() => dicomDB.dcmStore.toArray());

    //databaseには、{section: string, dicom: string}の形式で保存されている
    //このobjectを、treeviewで表示するために、renderTreeの形式に変換する
    async function getTreeData() {
        
        
    }
    
    return (
        <div>
            
        </div>
    )
}
export default DBTreeView