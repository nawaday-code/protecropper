

import Dexie, {Table} from "dexie";

export interface assignDCM{
    section: string;
    dcmName: string;
    dcmDS: string;
}

//Dexieを継承したDICOMDatabaseを操作するクラス
export class DICOMDatabase extends Dexie {
    dcmStore!: Table<assignDCM>;

    constructor() {
        super("DICOMDatabase");
        this.version(1).stores({
            dcmStore: "++id,*section,dcmName, dcmDS"
        });
    }
     
    public renameSection = async (oldSection: string, newSection: string) => {
        await this.transaction('rw', this.dcmStore, async () => {
            // fromSectionに一致する画像を検索
            const imgsOfOldSection = await this.dcmStore.where('section').equals(oldSection).toArray();
          
            // 取得した画像のsectionフィールドを更新
            for (const image of imgsOfOldSection){
              await this.dcmStore.update(image, { section: newSection });
            }
        });
    }
   
}

export const dicomDB = new DICOMDatabase();
