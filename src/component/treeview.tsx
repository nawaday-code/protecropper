//databaseの中身をtreeviewで表示するtsx componentを作成
import React, { useEffect, useState } from 'react';
import { TreeView, TreeItem } from '@mui/lab';

import { dicomDB } from '../database/dexie.db';


interface renderTree{
    id: string;
    name: string;
    children?: renderTree[];
}


const DBTreeView : React.FC = () => {

  
    async function getTreeData() {
        
    }
    
    return (
        <div>
            
        </div>
    )
}
export default DBTreeView