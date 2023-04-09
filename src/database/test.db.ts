import dicomParser from 'dicom-parser';
import { ImageStructure } from '../model/imageProcessor';
//テスト用のDICOM databaseオブジェクトを定義

interface ImgServer {
    dicom: dicomParser.DataSet[];
    imageStructure: ImageStructure[];
}

export const testDB: ImgServer = {
    dicom: [],
    imageStructure: [],
};
