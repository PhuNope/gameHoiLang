import { _decorator, Component, Node, Label, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameModel')
export class GameModel extends Component {
    @property(Prefab)
    WinUI: Prefab | null = null;

    @property(Prefab)
    LoseUI: Prefab | null = null;

    @property(Node)
    GameUI: Node | null = null;

    @property(Node)
    gamePlayGround: Node | null = null;

    // @property(Node)
    // resetButton: Node | null = null;

    start() {

    }
}


