import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameData')
export class GameData extends Component {
    public static instance: GameData;

    public SoundStatus: boolean = true;
    public MusicStatus: boolean = true;

    onLoad() {
        if (GameData.instance == null) {
            GameData.instance = this;
        }

        director.addPersistRootNode(this.node);
    }
}