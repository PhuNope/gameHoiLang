import { _decorator, Component, Node, director, SpriteFrame, find, Sprite, Prefab, instantiate, resources, UITransform, tween, Vec2, Vec3, Label, Button } from 'cc';
import { Configs, GameMode, GameSoundDisplay } from '../utils/Configs';
import { ResourceUtils } from '../utils/ResourceUtils';
import { GameData } from '../utils/GameData';
import { AudioController } from '../controllers/AudioController';
import { PlayerSave } from '../utils/PlayerSave';
import { MenuController } from '../controllers/MenuController';
const { ccclass, property } = _decorator;

enum StatusLevelProgressNode {
    NOT_DONE = 0,
    PLAYING = 1,
    DONE = 2
}

@ccclass('GameUIController')
export class GameUIController extends Component {
    @property({
        type: SpriteFrame,
        tooltip: "list SF of progress level. 0 is not done, 1 is done",
    })
    progressLevelSF: SpriteFrame[] = [];

    @property({
        type: Node,
        tooltip: "home button node"
    })
    homeNode: Node = null;

    @property({
        type: Label,
        tooltip: "number of money"
    })
    moneyLabel: Label = null;

    onLoad() {
        /**
         * Sender: LevelController
         * Purpose: to update progress level bar when boy go in toilet
         */
        director.on(Configs.EVENT_UPDATE_PROGRESS_LEVEL, (count: number) => { this.setProgressLevel(count); }, this);

        /**
         * Sender: LevelController
         * Purpose: update progress level reward when boy go in toilet
         */
        director.on(Configs.EVENT_UPDATE_PROGRESS_REWARD_LEVEL, () => { this.setProgressReward(); }, this);
    }

    start() {
        this.moneyLabel.string = GameData.instance.money.toString();
    }

    setProgressLevel(count: number) {
        for (let i = 1; i <= 3; i++) {
            find("Canvas/GameUI/progress level/bar " + i).getComponent(Sprite).spriteFrame = this.progressLevelSF[0];
        }

        for (let i = 1; i <= count; i++) {
            find("Canvas/GameUI/progress level/bar " + i).getComponent(Sprite).spriteFrame = this.progressLevelSF[1];
        }
    }

    onClickHome() {
        //audio
        AudioController.instance.onPLaySound(GameSoundDisplay.BUTTON);

        this.homeNode.active = false;

        this.unscheduleAllCallbacks();

        find("Canvas/Menu").active = true;

        find("Canvas/Menu").getComponent(MenuController).onClickHome();

        //send event to GameController to reset level
        director.emit(Configs.EVENT_RESET_LEVEL);
    }

    setProgressRewardDefault() {
        // let devide = GameData.instance.currentReachLevel % 5;

        // if (devide === 0) {
        //     let goalReward = find("progress to reward/Goal reward", this.node);
        //     ResourceUtils.loadSprite("textures/UI/reward level", (spriteFrame: SpriteFrame) => {
        //         goalReward.getComponent(Sprite).spriteFrame = spriteFrame;
        //     });

        //     for (let i = 1; i <= 4; i++) {
        //         let roundNode = find(`progress to reward/Progress Node ${i}/round node`, this.node);
        //         let yellowBar = roundNode.parent.getChildByName("yellow bar");

        //         roundNode.getComponent(Sprite).spriteFrame = this.progressLevelRewardSF[StatusLevelProgressNode.DONE];
        //         yellowBar.scale = new Vec3(9, 1, 1);
        //     }
        // }

        // if (devide >= 1 && devide <= 4) {
        //     for (let i = 1; i < devide; i++) {
        //         let roundNode = find(`progress to reward/Progress Node ${i}/round node`, this.node);
        //         let yellowBar = roundNode.parent.getChildByName("yellow bar");

        //         roundNode.getComponent(Sprite).spriteFrame = this.progressLevelRewardSF[StatusLevelProgressNode.DONE];
        //         yellowBar.scale = new Vec3(9, 1, 1);
        //     }

        //     let roundNode = find(`progress to reward/Progress Node ${devide}/round node`, this.node);
        //     let yellowBar = roundNode.parent.getChildByName("yellow bar");

        //     roundNode.getComponent(Sprite).spriteFrame = this.progressLevelRewardSF[StatusLevelProgressNode.PLAYING];
        //     yellowBar.scale = new Vec3(1, 1, 1);
        // }
    }

    setProgressReward() {
        // if (Math.round(GameData.instance.playingLevel) === GameData.instance.currentReachLevel
        //     && (GameData.instance.playingLevel % 1).toFixed(1) === "0.3") {

        //     let devide = GameData.instance.currentReachLevel % 5;

        //     if (devide === 0) {
        //         let goalReward = find("progress to reward/Goal reward", this.node);
        //         ResourceUtils.loadSprite("textures/UI/reward level done", (spriteFrame: SpriteFrame) => {
        //             goalReward.getComponent(Sprite).spriteFrame = spriteFrame;
        //         });

        //         //send event to gameController to show winUI
        //         this.scheduleOnce(() => {
        //             director.emit(Configs.EVENT_WIN_LEVEL);

        //             ResourceUtils.loadPrefab("prefabs/UI/RewardUI", (prefab: Prefab) => {
        //                 let rewardUI = instantiate(prefab);
        //                 find("Canvas").addChild(rewardUI);
        //             });

        //             //reset progress reward
        //             let roundNode = find("progress to reward/Progress Node 1/round node", this.node);
        //             let yellowBar = roundNode.parent.getChildByName("yellow bar");

        //             roundNode.getComponent(Sprite).spriteFrame = this.progressLevelRewardSF[StatusLevelProgressNode.PLAYING];
        //             yellowBar.scale = new Vec3(1, 1, 1);

        //             for (let i = 2; i <= 4; i++) {
        //                 let roundNodeTemp = find(`progress to reward/Progress Node ${i}/round node`, this.node);
        //                 let yellowBarTemp = roundNodeTemp.parent.getChildByName("yellow bar");

        //                 roundNodeTemp.getComponent(Sprite).spriteFrame = this.progressLevelRewardSF[StatusLevelProgressNode.NOT_DONE];
        //                 yellowBarTemp.scale = new Vec3(1, 1, 1);
        //             }

        //             ResourceUtils.loadSprite("textures/UI/reward level", (spriteFrame: SpriteFrame) => {
        //                 goalReward.getComponent(Sprite).spriteFrame = spriteFrame;
        //             });

        //         }, 0.5);
        //     }

        //     if (devide >= 1 && devide < 4) {
        //         let roundNode = find(`progress to reward/Progress Node ${devide}/round node`, this.node);
        //         let yellowBar = roundNode.parent.getChildByName("yellow bar");
        //         let roundNodeNext = find(`progress to reward/Progress Node ${devide + 1}/round node`, this.node);

        //         tween(yellowBar.scale)
        //             .call(() => {
        //                 roundNode.getComponent(Sprite).spriteFrame = this.progressLevelRewardSF[StatusLevelProgressNode.DONE];
        //             })

        //             .to(1, new Vec3(9, 1, 1), {
        //                 onUpdate(target: Vec3, ratio) {
        //                     yellowBar.scale = target;
        //                 }
        //             })

        //             .call(() => {
        //                 roundNodeNext.getComponent(Sprite).spriteFrame = this.progressLevelRewardSF[StatusLevelProgressNode.PLAYING];

        //                 //send event to gameController to show winUI
        //                 this.scheduleOnce(() => {
        //                     director.emit(Configs.EVENT_WIN_LEVEL);
        //                 }, 0.5);
        //             })

        //             .start();
        //     }

        //     if (devide === 4) {
        //         let roundNode = find(`progress to reward/Progress Node ${devide}/round node`, this.node);
        //         let yellowBar = roundNode.parent.getChildByName("yellow bar");

        //         tween(yellowBar.scale)
        //             .call(() => {
        //                 roundNode.getComponent(Sprite).spriteFrame = this.progressLevelRewardSF[StatusLevelProgressNode.DONE];
        //             })

        //             .to(1, new Vec3(9, 1, 1), {
        //                 onUpdate(target: Vec3, ratio) {
        //                     yellowBar.scale = target;
        //                 }
        //             })

        //             .call(() => {
        //                 let goalReward = find("progress to reward/Goal reward", this.node);
        //                 ResourceUtils.loadSprite("textures/UI/reward level", (spriteFrame: SpriteFrame) => {
        //                     goalReward.getComponent(Sprite).spriteFrame = spriteFrame;
        //                 });

        //                 //send event to gameController to show winUI
        //                 this.scheduleOnce(() => {
        //                     director.emit(Configs.EVENT_WIN_LEVEL);
        //                 }, 0.5);
        //             })

        //             .start();
        //     }
        // }

        // else {
        //     //send event to gameController to show winUI
        //     this.scheduleOnce(() => {
        //         director.emit(Configs.EVENT_WIN_LEVEL);
        //     }, 1);

        //     return;
        // }

        this.homeNode.active = false;

        //send event to gameController to show winUI
        this.scheduleOnce(() => {
            director.emit(Configs.EVENT_WIN_LEVEL);
        }, 1);
    }

    addMoneyAndChangeLabel() {
        GameData.instance.money++;
        this.moneyLabel.string = GameData.instance.money.toString();

        //save
        PlayerSave.saveDataStorage(Configs.KEY_STORAGE_MONEY, GameData.instance.money);
    }
}