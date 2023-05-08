import { _decorator, Button, Component, director, find, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import { Configs, GameMode, GameMusicDisplay, GameSoundDisplay } from '../utils/Configs';
import { GameData } from '../utils/GameData';
import { AudioController } from './AudioController';
import { PlayerSave } from '../utils/PlayerSave';
import { ResourceUtils } from '../utils/ResourceUtils';
const { ccclass, property } = _decorator;

enum IndexSFSingleMode {
    UNSELECTED = 0,
    SELECTED = 1,
}

enum IndexSFMultiMode {
    UNSELECTED = 0,
    SELECTED = 1,
    LOCKED = 2
}

@ccclass('MenuController')
export class MenuController extends Component {
    @property({
        type: Node,
        tooltip: "setting Node"
    })
    settingNode: Node = null;

    @property({
        type: Node,
        tooltip: "triangle select mode button"
    })
    triangleSelectModeBtn: Node = null;

    @property({
        type: Node,
        tooltip: "label under multi mode button"
    })
    labelUnderMultiMode: Node = null;

    @property({
        type: Button,
        tooltip: "single mode button"
    })
    singleModeBtn: Button = null;

    @property({
        type: Button,
        tooltip: "multi mode button"
    })
    multiModeBtn: Button = null;

    @property({
        type: Button,
        tooltip: "coming soon button"
    })
    comingSoonBtn: Button = null;

    @property({
        type: SpriteFrame,
        tooltip: "list SF of single mode. 0 is unselected, 1 is selected",
    })
    singleModeSF: SpriteFrame[] = [];

    @property({
        type: SpriteFrame,
        tooltip: "list SF of multi mode. 0 is unselected, 1 is selected, 2 is locked",
    })
    multiModeSF: SpriteFrame[] = [];

    onLoad() {
        this.settingNode.on(Node.EventType.TOUCH_START, this.onButtonSetting, this);
    }

    start() {
        if (GameData.instance.GameMode === GameMode.SINGLE) {
            let heightNode = this.singleModeBtn.node.getComponent(UITransform).height;

            this.triangleSelectModeBtn.worldPosition = new Vec3(this.singleModeBtn.node.worldPosition.x, this.singleModeBtn.node.worldPosition.y + heightNode / 2 + 30, this.singleModeBtn.node.worldPosition.z);

            //set sf
            this.singleModeBtn.node.getComponent(Sprite).spriteFrame = this.singleModeSF[IndexSFSingleMode.SELECTED];
            this.multiModeBtn.node.getComponent(Sprite).spriteFrame = this.multiModeSF[IndexSFSingleMode.UNSELECTED];
        }

        if (GameData.instance.GameMode === GameMode.MULTI) {
            //off label
            this.labelUnderMultiMode.active = false;

            let heightNode = this.multiModeBtn.node.getComponent(UITransform).height;

            this.triangleSelectModeBtn.worldPosition = new Vec3(this.multiModeBtn.node.worldPosition.x, this.multiModeBtn.node.worldPosition.y + heightNode / 2 + 30, this.multiModeBtn.node.worldPosition.z);

            //set sf
            this.multiModeBtn.node.getComponent(Sprite).spriteFrame = this.multiModeSF[IndexSFMultiMode.SELECTED];
            this.singleModeBtn.node.getComponent(Sprite).spriteFrame = this.singleModeSF[IndexSFMultiMode.UNSELECTED];
        }

        // //check if player cant unlock multimode
        // if (Number(PlayerSave.getDataStorage(Configs.KEY_STORAGE_CURRENT_LEVEL_MODE_SINGLE) ?? 1) < 6) {
        //     this.labelUnderMultiMode.active = true;
        //     //set sf for multimodeButton
        //     this.multiModeBtn.node.getComponent(Sprite).spriteFrame = this.multiModeSF[IndexSFMultiMode.LOCKED];
        // }
    }

    onEnable() {
        this.start();
    }

    onButtonSetting() {
        //play sound
        AudioController.instance.onPLaySound(GameSoundDisplay.BUTTON);

        this.settingNode.off(Node.EventType.TOUCH_START, this.onButtonSetting, this);

        ResourceUtils.loadPrefab("prefabs/UI/SettingUI", (prefab: Prefab) => {
            let settingUI = instantiate(prefab);
            this.node.addChild(settingUI);
            this.settingNode.on(Node.EventType.TOUCH_START, this.onButtonSetting, this);
        });
    }

    onTapToPlay() {
        //play audio
        AudioController.instance.onPLaySound(GameSoundDisplay.BUTTON);

        //enable home button
        find("Canvas/GameUI/HomeButton").active = true;

        //sent event to LevelController not to show hand
        director.emit(Configs.EVENT_TAP_TO_PLAY);

        this.node.active = false;
    }

    onClickSingleMode() {
        //play audio
        AudioController.instance.onPLaySound(GameSoundDisplay.BUTTON);

        if (GameData.instance.GameMode === GameMode.SINGLE) return;

        GameData.instance.GameMode = GameMode.SINGLE;

        //set current level
        GameData.instance.currentReachLevel = Number(PlayerSave.getDataStorage(Configs.KEY_STORAGE_CURRENT_LEVEL_MODE_SINGLE) ?? 1);
        GameData.instance.playingLevel = GameData.instance.currentReachLevel + 0.1;

        director.loadScene(Configs.GAME_SCENE_NAME);

        // //send event to gameController to reset level
        // director.emit(Configs.EVENT_RESET_LEVEL);
    }

    onClickMultiMode() {
        //play audio
        AudioController.instance.onPLaySound(GameSoundDisplay.BUTTON);

        if (GameData.instance.GameMode === GameMode.MULTI) return;

        //if (Number(PlayerSave.getDataStorage(Configs.KEY_STORAGE_CURRENT_LEVEL_MODE_SINGLE) ?? 1) < 6) return;

        GameData.instance.GameMode = GameMode.MULTI;

        //set current level
        GameData.instance.currentReachLevel = Number(PlayerSave.getDataStorage(Configs.KEY_STORAGE_CURRENT_LEVEL_MODE_MULTI) ?? 1);
        GameData.instance.playingLevel = GameData.instance.currentReachLevel + 0.1;

        director.loadScene(Configs.GAME_SCENE_NAME);

        // //send event to gameController to reset level
        // director.emit(Configs.EVENT_RESET_LEVEL);
    }

    onClickSkin(event: Event) {
        //play audio
        AudioController.instance.onPLaySound(GameSoundDisplay.BUTTON);

        ResourceUtils.loadPrefab("prefabs/UI/Shop", (prefab: Prefab) => {
            let shop = instantiate(prefab);

            find("Canvas").addChild(shop);
        });

        let buttonNode = event.target as any as Node;
        buttonNode.getComponent(Button).clickEvents = [];
    }

    //from GameUIController
    onClickHome() {
        find("bg", this.node).active = true;
        find("bg2", this.node).active = false;

        this.triangleSelectModeBtn.active = true;
        find("GroupSelectMode", this.node).active = true;
    }

    //from LoseUIController
    onLose() {
        find("bg", this.node).active = false;
        find("bg2", this.node).active = true;

        this.triangleSelectModeBtn.active = false;
        find("GroupSelectMode", this.node).active = false;
    }
}