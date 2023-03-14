import { _decorator, Component, Node } from 'cc';
import { GameModel } from '../model/GameModel';
import { ResourceUtils } from '../utils/ResourceUtils';
import { Utils } from '../utils/Utils';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property(GameModel)
    gameModel: GameModel;

    start() {

    }

    update(deltaTime: number) {

    }
}


