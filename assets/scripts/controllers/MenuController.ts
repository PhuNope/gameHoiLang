import { _decorator, Button, Component, director, Node } from 'cc';
import { Configs, MusicName } from '../utils/Configs';
import { AudioController } from './AudioController';
const { ccclass, property } = _decorator;

@ccclass('MenuController')
export class MenuController extends Component {
    @property({
        type: Button,
        tooltip: "This is Button component of Button Play"
    })
    buttonCom: Button = null;

    onLoad() {
        //play music backgound
        AudioController.instance.playMusic(MusicName.BG);
    }

    start() {
        //pre load scene game
        director.preloadScene(Configs.GAME_SCENE_NAME, () => { });
    }

    onButtonPLay() {
        //play sound
    }
}