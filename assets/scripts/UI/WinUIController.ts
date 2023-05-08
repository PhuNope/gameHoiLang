import { _decorator, assetManager, Component, find, ImageAsset, Label, Node, Sprite, SpriteFrame, Texture2D, Tween, tween, Vec3 } from 'cc';
import { GameData } from '../utils/GameData';
import { Configs, GameMode, GameMusicDisplay } from '../utils/Configs';
import { Fbsdk } from '../utils/Fbsdk';
import { PlayerSave } from '../utils/PlayerSave';
import { AudioController } from '../controllers/AudioController';
const { ccclass, property } = _decorator;

@ccclass('WinUIController')
export class WinUIController extends Component {
    @property({
        type: Node,
        tooltip: "red hand"
    })
    redHand: Node = null;

    @property({
        type: Sprite,
        tooltip: "Sprite of avatar user"
    })
    avatarUser: Sprite = null;

    @property({
        type: SpriteFrame,
        tooltip: "SpriteFrame of single picture"
    })
    singlePicture: SpriteFrame = null;

    @property({
        type: SpriteFrame,
        tooltip: "SpriteFrame of multi picture"
    })
    multiPicture: SpriteFrame = null;

    @property({
        type: Sprite,
        tooltip: "Sprite of picture"
    })
    picture: Sprite = null;

    start() {
        //audio
        AudioController.instance.onPlayMusic(GameMusicDisplay.WINLEVEL);

        //animation red hand
        tween(this.redHand)
            .to(0.5, { scale: new Vec3(1, 1, 1) }, { easing: 'bounceOut' })
            .start();

        //get avatar user
        let that = this;
        const setAvatar = (sp) => {
            if (this.avatarUser) {
                that.avatarUser.spriteFrame = sp;
            }

        };
        if (GameData.instance.fbAvatarSpriteFrame) {
            setAvatar(GameData.instance.fbAvatarSpriteFrame);
        } else {
            assetManager.loadRemote<ImageAsset>(Fbsdk.instance.dataFb.photoURL, { ext: '.png' }, function (err, imageAsset) {
                const spriteFrame = new SpriteFrame();
                const texture = new Texture2D();
                texture.image = imageAsset;
                spriteFrame.texture = texture;
                GameData.instance.fbAvatarSpriteFrame = spriteFrame;
                setAvatar(GameData.instance.fbAvatarSpriteFrame);

            });
        }

        //add current level and save
        if (Math.round(GameData.instance.playingLevel) == GameData.instance.currentReachLevel
            && (GameData.instance.playingLevel % 1).toFixed(1) === "0.3") {
            GameData.instance.currentReachLevel++;

            //save
            if (GameData.instance.GameMode === GameMode.SINGLE) {
                PlayerSave.saveDataStorage(Configs.KEY_STORAGE_CURRENT_LEVEL_MODE_SINGLE, GameData.instance.currentReachLevel);
            }
            if (GameData.instance.GameMode === GameMode.MULTI) {
                PlayerSave.saveDataStorage(Configs.KEY_STORAGE_CURRENT_LEVEL_MODE_MULTI, GameData.instance.currentReachLevel);
            }
        }

        if (GameData.instance.GameMode == GameMode.SINGLE) {
            this.picture.spriteFrame = this.singlePicture;
        }

        if (GameData.instance.GameMode == GameMode.MULTI) {
            this.picture.spriteFrame = this.multiPicture;
        }
    }

    onNextLevelButton() {
        if ((GameData.instance.playingLevel % 1).toFixed(1) == "0.3") {
            GameData.instance.playingLevel = Math.round(GameData.instance.playingLevel) + 1.1;
        }
        else {
            GameData.instance.playingLevel += 0.1;
        }

        //sent event to game controller to init new level
        this.node.emit(Configs.EVENT_NEXT_LEVEL);

        //show home button
        find("Canvas/GameUI/HomeButton").active = true;

        this.node.destroy();
    }

    onDestroy() {
        Tween.stopAll();
    }
}