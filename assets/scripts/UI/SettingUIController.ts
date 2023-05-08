import { _decorator, Component, EditBox, Input, Label, Node, Sprite, SpriteFrame } from 'cc';
import { GameData } from '../utils/GameData';
import { Configs, GameMusicDisplay, GameMusicStatus, GameSoundDisplay, GameSoundStatus } from '../utils/Configs';
import { AudioController } from '../controllers/AudioController';
import { PlayerSave } from '../utils/PlayerSave';
import { Fbsdk } from '../utils/Fbsdk';
import { trackingEvent } from '../FireBase/FireBaseUtil';
const { ccclass, property } = _decorator;

@ccclass('SettingUIController')
export class SettingUIController extends Component {
    //music
    @property({
        type: SpriteFrame,
        tooltip: "status, 0 is on, 1 is off"
    })
    status: SpriteFrame[] = [];

    @property(Sprite)
    musicSprite: Sprite = null;

    @property(Sprite)
    soundSprite: Sprite = null;

    @property({
        type: Node,
        tooltip: "table content"
    })
    tableContent: Node = null;

    @property({
        type: Node,
        tooltip: "Feed Back"
    })
    feedBack: Node = null;

    @property({
        type: EditBox,
        tooltip: "string of feed back"
    })
    feedBackString: EditBox = null;

    @property({
        type: Node,
        tooltip: "Feed Back success"
    })
    feedBackSuccess: Node = null;

    start() {
        if (GameData.instance.musicStatus == GameMusicStatus.OFF) {
            this.musicSprite.spriteFrame = this.status[GameMusicStatus.OFF];
        } else {
            this.musicSprite.spriteFrame = this.status[GameMusicStatus.ON];;
        }

        if (GameData.instance.soundStatus == GameSoundStatus.OFF) {
            this.soundSprite.spriteFrame = this.status[GameSoundStatus.OFF];
        } else {
            this.soundSprite.spriteFrame = this.status[GameSoundStatus.ON];
        }

        this.feedBack.active = false;
        this.feedBackSuccess.active = false;
    }

    onTouchMusic() {
        //music on
        if (GameData.instance.musicStatus == GameMusicStatus.ON) {
            this.musicSprite.spriteFrame = this.status[GameMusicStatus.OFF];
            GameData.instance.musicStatus = GameMusicStatus.OFF;

            AudioController.instance.stopMusic();
        } else {
            this.musicSprite.spriteFrame = this.status[GameMusicStatus.ON];
            GameData.instance.musicStatus = GameMusicStatus.ON;

            AudioController.instance.onPlayMusic(GameMusicDisplay.BACKGROUND);
        }

        //save
        PlayerSave.saveDataStorage(Configs.KEY_STORAGE_MUSIC_STATUS, GameData.instance.musicStatus);
    }

    onTouchSound() {
        //sound on
        if (GameData.instance.soundStatus == GameSoundStatus.ON) {
            this.soundSprite.spriteFrame = this.status[GameSoundStatus.OFF];
            GameData.instance.soundStatus = GameSoundStatus.OFF;
            AudioController.instance._soundBackground.clip = null;

            AudioController.instance.stopSound();
        } else {
            this.soundSprite.spriteFrame = this.status[GameSoundStatus.ON];
            GameData.instance.soundStatus = GameSoundStatus.ON;
        }

        //save
        PlayerSave.saveDataStorage(Configs.KEY_STORAGE_SOUND_STATUS, GameData.instance.soundStatus);
    }

    onTouchExit() {
        //play audio
        AudioController.instance.onPLaySound(GameSoundDisplay.BUTTON);

        if (this.feedBack.active) {
            console.log(this.feedBackString.string);

            if (this.feedBackString.string) {
                trackingEvent("FeedBack", { content: this.feedBackString.string });

                this.feedBackSuccess.active = true;

                this.scheduleOnce(() => {
                    this.node.destroy();
                }, 3);
            } else {
                this.node.destroy();
            }
        }

        if (!this.feedBack.active) {
            this.node.destroy();
        }
    }

    //add to button
    onButtonPlayWithFriends() {
        //play audio
        AudioController.instance.onPLaySound(GameSoundDisplay.BUTTON);

        Fbsdk.instance.shareGame();
    }

    //add to button
    onButtonFeedBack() {
        //play audio
        AudioController.instance.onPLaySound(GameSoundDisplay.BUTTON);

        this.feedBack.active = true;

        this.tableContent.active = false;
    }

    onClickThanksSubmit() {
        this.node.destroy();
    }

    onDestroy() {
        this.unscheduleAllCallbacks();
    }
}


