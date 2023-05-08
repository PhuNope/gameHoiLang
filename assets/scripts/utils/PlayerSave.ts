import { _decorator, Component, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerSave')
export class PlayerSave extends Component {
    public static GAME_ID = "PeeMasterv1";

    public static saveDataStorage(key: string, value: any) {
        sys.localStorage.setItem(key + PlayerSave.GAME_ID, value);
    }

    public static getDataStorage(key: string) {
        const data = sys.localStorage.getItem(key + PlayerSave.GAME_ID);

        return data;
    }
}