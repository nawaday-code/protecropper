//databaseの中身をtreeviewで表示するtsx componentを作成
import React, { useEffect, useState } from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import {useLiveQuery} from 'dexie-react-hooks';

import { assignDCM, dicomDB } from '../database/dexie.db';

interface RenderTree{
    id: string;
    name: string;
    children?: RenderTree[];
}



//再帰的にtreeviewを作成する
const renderTree = (nodes: RenderTree) =>{
    return(
    <TreeItem 
        key={nodes.id}
        nodeId={nodes.id}
        label={nodes.name}
        >
        {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>
)
};

const DBTreeView : React.FC = () => {

    //sectionの一覧を取得する
    const sections = useLiveQuery(() => dicomDB.dcmStore.orderBy("section").uniqueKeys(), []);
    const dbItems = useLiveQuery(() => dicomDB.dcmStore.toArray(), []);

    // treeDataから、treeviewに表示するデータを作成する
    //databaseには、{section: string, dcmName: string}の形式で保存されている
    //このobjectを、treeviewで表示するために、renderTreeの形式に変換する

    return (
        <TreeView
            aria-label="controlled"
            defaultCollapseIcon={
              <span className="MuiIcon-root MuiIcon-fontSizeSmall">-</span>
            }
            defaultExpandIcon={
              <span className="MuiIcon-root MuiIcon-fontSizeSmall">+</span>
            }
        >
            {
                sections?.map((section) => {
                    const children = dbItems?.filter((item) => item.section === section);
                    const treeData: RenderTree = {
                        id: section.toString(),
                        name:section.toString(), 
                        children: children?.map((child) => {
                            return {
                                id: child.dcmName,
                                name: child.dcmName
                            }
                        })
                    }
                    return renderTree(treeData);
                })
            }
        </TreeView>
    )
}
export default DBTreeView