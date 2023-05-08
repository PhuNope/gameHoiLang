import { _decorator, Component, Node, director, find } from 'cc';
import { GameData } from '../utils/GameData';
import { Configs } from '../utils/Configs';
import { MenuController } from '../controllers/MenuController';
const { ccclass, property } = _decorator;

@ccclass('LoseUIController')
export class LoseUIController extends Component {
    start() {
        //reset level       
        this.scheduleOnce(() => {
            find("Canvas/Menu").active = true;

            find("Canvas/Menu").getComponent(MenuController).onLose();

            //sent event to gameController to init new level
            director.emit(Configs.EVENT_RESET_LEVEL);

            this.node.destroy();
        }, 2);
    }

    update(deltaTime: number) {

    }
}