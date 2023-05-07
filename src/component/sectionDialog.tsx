import React, { useState, useEffect } from 'react';
//dialogを用いるために、@muiをimport
import { Dialog,
   DialogTitle, 
   DialogContent, 
   DialogActions, 
   DialogContentText, 
   TextField,
    Button,
  } from '@mui/material';

import { dicomDB } from '../database/dexie.db';

interface props{
    isOpen: boolean;
    whenClosed: () => void;
    selectSection : string;
}

//dialogを表示するtsx componentを作成. propsとして、isOpenを受け取る
const SectionDialog : React.FC<props> = (props: {isOpen: boolean , whenClosed: ()=> void, selectSection:string}) => {
    const {isOpen, whenClosed, selectSection} = props;//propsからisOpenを受け取る これはアンパッキングが必要
    const [postSection, setPostSection] = useState('');
    const [open, setOpen] = useState(false);
   
    //isOpenがtrueになったら、dialogを開く そのために、useEffectを使う
    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    const handleClose = () => {
        whenClosed();
        setOpen(false);
    };

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        setOpen(false);
        whenClosed();

        await dicomDB.renameSection(selectSection, postSection);
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>セクション名の変更</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        変更前のセクション名
                    </DialogContentText>
                        <h2>{selectSection}</h2>
                    <DialogContentText>
                        変更後のセクション名を入力してください
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="post-section"
                        label="変更後セクション"
                        type="text"
                        fullWidth
                        onChange={(e) => setPostSection(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>キャンセル</Button>
                    <Button onClick={handleSubmit}>OK</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default SectionDialog;