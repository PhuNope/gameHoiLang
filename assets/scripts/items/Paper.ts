import { _decorator, Camera, Component, find, Label, Node, Tween, tween, UITransform, Vec3 } from 'cc';
import { GameData } from '../utils/GameData';
import { PlayerSave } from '../utils/PlayerSave';
import { Configs, GameMode, GameSoundDisplay } from '../utils/Configs';
import { AudioController } from '../controllers/AudioController';
const { ccclass, property } = _decorator;

@ccclass('Paper')
export class Paper extends Component {
    _groupCharactor: Node[] = [];

    _moneyLabel: Label = null;

    _check: boolean = true;

    onLoad() {
        this._moneyLabel = find("Canvas/GameUI/Money/Label").getComponent(Label);
    }

    update(deltaTime: number) {
        if (!this._check) return;

        this._groupCharactor = [];

        this.node.parent.children.map(child => {
            let myRegex = new RegExp(/^(Boy|Girl)/g);

            if (myRegex.test(child.name)) {
                this._groupCharactor.push(child);
            }
        });

        this._groupCharactor.map(charactor => {
            let boundChar = charactor.getComponent(UITransform).getBoundingBox();

            if (boundChar.intersects(this.node.getComponent(UITransform).getBoundingBox())) {
                let wpos = find("MarkPaper", this.node.parent).worldPosition;

                //play sound
                AudioController.instance.onPLaySound(GameSoundDisplay.PAPER);

                tween(this.node)

                    .to(1, { worldPosition: wpos }, { easing: 'quintInOut' })

                    .call(() => {
                        GameData.instance.money++;
                        PlayerSave.saveDataStorage(Configs.KEY_STORAGE_MONEY, GameData.instance.money);

                        this._moneyLabel.string = GameData.instance.money.toString();

                        Tween.stopAllByTarget(this.node);

                        this.node.destroy();
                    })
                    .start();

                this._check = false;
            }
        });
    }
}

