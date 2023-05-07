import React, {useEffect, useState} from 'react'

import homeStyle from './homeStyle.module.css'
import InputProcessor from '../component/InputProcessor'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import SectionDialog from '../component/sectionDialog'
import DBTreeView from '../component/treeview'



const Home = ():React.ReactElement => {
  const [updateComplete, setUpdateComplete] = useState(false); //アップロードが完了したらtrueになる
  const [sectionDialogOpen, setSectionDialogOpen] =useState(false);    

  const handleUploadComplete = () => {
    console.log('upload complete')
    setUpdateComplete(true);
  }
  
  // upload が完了したら、section の指定を行う dialog を表示する
  // 並行して、drop area をtreeview に変更する
  useEffect(() => {
    if (updateComplete) {
      setSectionDialogOpen(true);
    }
  }, [updateComplete])

  const sectionCloseHandler = () => {
    setSectionDialogOpen(false);
  }

  return (
    <div className={homeStyle['container']}>
      <header data-role="Header" className={homeStyle['header']}>
        <img
          alt="logo"
          src="https://presentation-website-assets.teleporthq.io/logos/logo.png"
          className={homeStyle['image']}
        />
      </header>
      <div className={homeStyle['desktop']}>
        <div className={homeStyle['sidebar']}>
          <span className={homeStyle['text']}>
            <span>Database</span>
          </span>
          <DndProvider backend={HTML5Backend}>
            {updateComplete ?
             <DBTreeView /> : 
             <InputProcessor onUploadComplete={handleUploadComplete}/>
            }
          </DndProvider>
          <SectionDialog isOpen={sectionDialogOpen} whenClosed={sectionCloseHandler} selectSection={'temp'}/>
        </div>
        <div className={homeStyle['main-view']}>
          <div className={homeStyle['input-setting']}>
            <figure className={homeStyle['preview']}>
              <span className={homeStyle['text11']}>
                <span>
                  <span>ここにプレビュー画像</span>
                  <br></br>
                  <span>が表示されます</span>
                </span>
              </span>
            </figure>
            <button
              id="crop"
              type="button"
              disabled
              className={`${homeStyle['button']}`}
            >
              <svg viewBox="0 0 1024 1024" className={homeStyle['icon']}>
                <path d="M810 128h128v42l-298 300-86-86zM512 534q22 0 22-22t-22-22-22 22 22 22zM256 854q34 0 60-25t26-61-26-61-60-25-60 25-26 61 26 61 60 25zM256 342q34 0 60-25t26-61-26-61-60-25-60 25-26 61 26 61 60 25zM412 326l526 528v42h-128l-298-298-100 100q14 30 14 70 0 70-50 120t-120 50-120-50-50-120 50-120 120-50q40 0 70 14l100-100-100-100q-30 14-70 14-70 0-120-50t-50-120 50-120 120-50 120 50 50 120q0 40-14 70z"></path>
              </svg>
              <span className={homeStyle['text16']}>
                <span>Crop Start</span>
              </span>
            </button>
          </div>
          <div className={homeStyle['result']}>
            <figure className={homeStyle['preview1']}>
              <span className={homeStyle['text18']}>
                <span>ここに切り取り結果が</span>
                <br></br>
                <span>表示されます</span>
              </span>
            </figure>
            <button
              id="save"
              type="button"
              disabled
              className={`${homeStyle['button1']}`}
            >
              <svg
                viewBox="0 0 877.7142857142857 1024"
                className={homeStyle['icon2']}
              >
                <path d="M219.429 877.714h438.857v-219.429h-438.857v219.429zM731.429 877.714h73.143v-512c0-10.857-9.714-34.286-17.143-41.714l-160.571-160.571c-8-8-30.286-17.143-41.714-17.143v237.714c0 30.286-24.571 54.857-54.857 54.857h-329.143c-30.286 0-54.857-24.571-54.857-54.857v-237.714h-73.143v731.429h73.143v-237.714c0-30.286 24.571-54.857 54.857-54.857h475.429c30.286 0 54.857 24.571 54.857 54.857v237.714zM512 347.429v-182.857c0-9.714-8.571-18.286-18.286-18.286h-109.714c-9.714 0-18.286 8.571-18.286 18.286v182.857c0 9.714 8.571 18.286 18.286 18.286h109.714c9.714 0 18.286-8.571 18.286-18.286zM877.714 365.714v530.286c0 30.286-24.571 54.857-54.857 54.857h-768c-30.286 0-54.857-24.571-54.857-54.857v-768c0-30.286 24.571-54.857 54.857-54.857h530.286c30.286 0 72 17.143 93.714 38.857l160 160c21.714 21.714 38.857 63.429 38.857 93.714z"></path>
              </svg>
              <span className={homeStyle['text22']}>
                <span>Save</span>
                <br></br>
              </span>
            </button>
          </div>
        </div>
        <div className={homeStyle['sidebar1']}>
          <span className={homeStyle['text25']}>
            <span>Options</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Home
