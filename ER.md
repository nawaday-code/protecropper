:::mermaid
sequenceDiagram
    participant User
    participant System
    User->>System: ファイルをドラッグ＆ドロップ or ファイル参照ボタンを押す
    alt 入力がDICOMかどうかを検証
        System->>System: DICOMデータであるか確認する
        alt DICOMデータだった場合
            System->>System: データベースにデータを格納する
            System->>User: 入力エリアにデータのプレビューを表示する
            loop プレビュー画面をクリックすると全てのデータをプレビューするプレビュー専用画面が立ち上がる
                User->>System: プレビュー画面をクリックする
                System-->>User: プレビュー専用画面が表示される
            end
        else DICOMデータではなかった場合
            System-->>User: Alertを表示する
        end
    end
    opt 切り取りボタンを押す
        User->>System: 切り取りボタンを押す
        System->>System: 切り取りfunctionが動作する
        System->>System: 切り取り結果のデータをデータベースに格納する
        System->>User: 切り取り結果のデータを表示する
        loop 切り取り結果プレビュー画面をクリックするとプレビュー専用画面が立ち上がる
            User->>System: 切り取り結果プレビュー画面をクリックする
            System-->>User: プレビュー専用画面が表示される
        end
    end
    opt 保存ボタンを押す
        User->>System: 保存ボタンを押す
        System-->>User: 保存専用の画面が立ち上がる
        opt 保存先と保存ファイル名を編集
            User->>System: 保存先と保存ファイル名を編集する
        end
    end
:::