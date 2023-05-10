
import React, { useEffect, useState } from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import { useLiveQuery } from 'dexie-react-hooks';

import { assignDCM, dicomDB } from '../database/dexie.db';

interface RenderTree {
  section: string;
  name: string;
  children?: RenderTree[];
}

async function getTreeData(sections: assignDCM[] | undefined) {
  const treeData: RenderTree[] = [];

  if (sections === undefined) {
    return treeData;
  }

  for (const section of sections) {
    const children: RenderTree[] = [];
    const dcmNames = await dicomDB.dcmStore
      .where('section')
      .equals(section.section)
      .toArray();
    for (const dcmName of dcmNames) {
      children.push({ section: section.section, name: dcmName.dcmName });
    }
    treeData.push({
      section: section.section,
      name: section.section,
      children: children,
    });
  }
  return treeData;
}

const renderTree = (nodes: RenderTree) => (
  <TreeItem key={nodes.section} nodeId={nodes.section} label={nodes.name}>
    {Array.isArray(nodes.children)
      ? nodes.children.map((node) => renderTree(node))
      : null}
  </TreeItem>
);

const DBTreeView: React.FC = () => {
  const sections = useLiveQuery(() => dicomDB.dcmStore.toArray());

  const [treeData, setTreeData] = useState<RenderTree[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getTreeData(sections);
      setTreeData(data);
      console.log(`treeData: ${treeData}`);
    })();
  }, [sections]);

  return (
    <div>
      <TreeView
        aria-label="controlled"
        defaultCollapseIcon={
          <span className="MuiIcon-root MuiIcon-fontSizeSmall">-</span>
        }
        defaultExpandIcon={
          <span className="MuiIcon-root MuiIcon-fontSizeSmall">+</span>
        }
      >
        {treeData.map((node) => renderTree(node))}
      </TreeView>
    </div>
  );
};

export default DBTreeView;