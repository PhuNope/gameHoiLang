import { _decorator, Component, director, Input, instantiate, Label, Node, Prefab, find } from 'cc';
import { GameModel } from '../models/GameModel';
import { ResourceUtils } from '../utils/ResourceUtils';
import { GameData } from '../utils/GameData';
import { Configs, GameMode, GameMusicDisplay, GameSoundDisplay } from '../utils/Configs';
import { AudioController } from './AudioController';
import { LevelController as LevelControllerSingle } from '../Game Mode 1/levels/LevelController';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property(GameModel)
    gameModel: GameModel;

    private gamePlayGround: Node;
    private gamePlayingNode: Node;

    private winUIPre: Prefab;
    private loseUIPre: Prefab;

    onLoad() {
        this.gamePlayGround = this.gameModel.gamePlayGround;

        this.winUIPre = this.gameModel.WinUI;
        this.loseUIPre = this.gameModel.LoseUI;

        //receive event from GameUIController to show WinUI
        director.on(Configs.EVENT_WIN_LEVEL, () => { this.showWinUI(); }, this);

        /**
         * Sender: GameUIController
         * Purpose: Reset level when click home button
         * 
         * Sender: LoseUIController
         * Purpose: Reset level while lose level 
         */
        director.on(Configs.EVENT_RESET_LEVEL, () => { this.reStartLevel(); }, this);
    }

    start() {
        this.gameInit(GameData.instance.playingLevel);
        //this.gameInit(21);
    }

    gameInit(level: number) {
        let selectlevel = GameData.instance.GameMode + level.toFixed(1);

        //send event to GameUIController to update progress level bar
        let count: number = Math.round((GameData.instance.playingLevel % 1 * 10)) - 1;
        director.emit(Configs.EVENT_UPDATE_PROGRESS_LEVEL, count);

        //set level label from GameUI
        find("Canvas/GameUI/LevelLabel").getComponent(Label).string = `Level ${Math.round(level)}-${Math.round(level % 1 * 10)}`;

        ResourceUtils.loadPrefab(selectlevel, (prefab: Prefab) => {
            //play audio
            AudioController.instance.onPlayMusic(GameMusicDisplay.BACKGROUND);

            this.gamePlayingNode = instantiate(prefab);
            this.gamePlayGround.addChild(this.gamePlayingNode);

            if (GameData.instance.GameMode == GameMode.SINGLE) {
                this.gamePlayingNode.getComponent(LevelControllerSingle).setupLevel();
            }

            //listen events from LevelController
            this.gamePlayingNode.on(Configs.EVENT_LOSE_LEVEL, () => { this.showLoseUI(); }, this);
            //this.gamePlayingNode.on(Configs.EVENT_WIN_LEVEL, () => { this.showWinUI(); }, this);

            //pre load
            if ((level % 1).toFixed(1) == "0.3") {
                selectlevel = GameData.instance.GameMode + (Math.round(level) + 1.1).toFixed(1);
                ResourceUtils.loadPrefab(selectlevel, () => { });
            } else {
                selectlevel = GameData.instance.GameMode + (level + 0.1).toFixed(1);
                ResourceUtils.loadPrefab(selectlevel, () => { });
            }

            //load mouse joint
            if (GameData.instance.GameMode == GameMode.MULTI) {
                ResourceUtils.loadPrefab("items/MouseJoint", (prefab: Prefab) => {
                    let mouseJoint = instantiate(prefab);

                    this.gamePlayingNode.addChild(mouseJoint);
                });
            }
        });
    }

    showLoseUI() {
        find("Canvas/GameUI/HomeButton").active = false;

        this.scheduleOnce(() => {
            //play music
            AudioController.instance.onPlayMusic(GameMusicDisplay.FAILLEVEL);

            let loseUI = instantiate(this.loseUIPre);
            find('Canvas').addChild(loseUI);
        }, 1);
    }

    showWinUI() {
        //play music
        //AudioController.instance.onPlayMusic(GameMusicDisplay.WINLEVEL);

        let winUI = instantiate(this.winUIPre);
        find('Canvas').addChild(winUI);

        //receive event from WinUIController
        winUI.on(Configs.EVENT_NEXT_LEVEL, () => { this.nextLevel(); }, this);
    }

    reStartLevel() {
        GameData.instance.playingLevel = Math.round(GameData.instance.playingLevel) + 0.1;

        this.gamePlayingNode.destroy();
        this.gameInit(GameData.instance.playingLevel);
    }

    nextLevel() {
        //play sound
        AudioController.instance.onPLaySound(GameSoundDisplay.BUTTON);

        this.gamePlayingNode.destroy();
        this.gameInit(GameData.instance.playingLevel);
    }

    onHomeButton() {
        //play sound
        AudioController.instance.onPLaySound(GameSoundDisplay.BUTTON);

        //set gamemode to default
        GameData.instance.GameMode = GameMode.SINGLE;

        director.loadScene(Configs.MENU_SCENE_NAME);
    }
}