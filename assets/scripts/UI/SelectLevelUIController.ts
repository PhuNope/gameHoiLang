import { _decorator, Color, Component, director, Input, instantiate, Label, LabelOutline, Node, Prefab, ScrollView, Sprite, UITransform } from 'cc';
import { GameData } from '../utils/GameData';
import { Configs, GameMode, GameSoundDisplay } from '../utils/Configs';
import { AudioController } from '../controllers/AudioController';
const { ccclass, property } = _decorator;

@ccclass('SelectLevelUIController')
export class SelectLevelUIController extends Component {
    @property(Prefab)
    selectLevelItemprefab: Prefab;

    @property(ScrollView)
    scrollView: ScrollView;

    start() {
        let currentlevel: number = GameData.instance.currentReachLevel;
        let maxlevel: number = GameData.instance.maxLevel;

        for (let i = 1; i <= maxlevel; i++) {
            let newLevelItem: Node = instantiate(this.selectLevelItemprefab);

            this.scrollView.content.addChild(newLevelItem);

            //set string
            newLevelItem.getChildByName("labelLevel").getComponent(Label).string = i.toString();

            //non play level
            if (i > currentlevel) {
                newLevelItem.getChildByName("bg").getComponent(Sprite).color = new Color(59, 53, 53, 255);
                newLevelItem.getChildByName("labelLevel").getComponent(LabelOutline).color = new Color(0, 0, 0, 255);
            } else {
                newLevelItem.on(Input.EventType.TOUCH_START, () => {
                    //play audio
                    AudioController.instance.onPLaySound(GameSoundDisplay.BUTTON);

                    GameData.instance.playingLevel = i;
                    director.loadScene(Configs.GAME_SCENE_NAME);
                }, this);
            }
        }

        let scrollHeight: number = (maxlevel / 5) * (100 + 40);

        this.scrollView.content.getComponent(UITransform).setContentSize(720, scrollHeight);
    }

    onBackButton() {
        //play audio
        AudioController.instance.onPLaySound(GameSoundDisplay.BUTTON);

        //set default game mode
        GameData.instance.GameMode = GameMode.SINGLE;

        this.node.destroy();
    }

    update(deltaTime: number) {

    }
}


