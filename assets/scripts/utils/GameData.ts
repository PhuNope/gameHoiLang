import { _decorator, Component, director, Node, SpriteFrame, sys } from 'cc';
import { PlayerSave } from './PlayerSave';
import { Configs, GameMode, GameMusicStatus, GameSoundStatus, StatusItem } from './Configs';
const { ccclass, property } = _decorator;

@ccclass('GameData')
export class GameData extends Component {
    public static instance: GameData;

    public currentReachLevel: number = 1;
    public playingLevel: number = 1.1;
    public maxLevel: number = 5;

    public musicStatus: GameMusicStatus = GameMusicStatus.ON;
    public soundStatus: GameSoundStatus = GameSoundStatus.ON;

    public GameMode: GameMode = GameMode.SINGLE;

    public fbAvatarSpriteFrame: SpriteFrame;

    public money: number = 0;

    public BoySkin: string = "NAM";
    public GirlSkin: string = "NU";

    public SkinData = Configs.SkinData;

    start() {
        //sys.localStorage.clear();

        if (GameData.instance == null) {
            GameData.instance = this;
            director.addPersistRootNode(this.node);
        }

        //get save level data
        if (PlayerSave.getDataStorage(Configs.KEY_STORAGE_CURRENT_LEVEL_MODE_SINGLE)) {
            this.currentReachLevel = Number(PlayerSave.getDataStorage(Configs.KEY_STORAGE_CURRENT_LEVEL_MODE_SINGLE));
            this.playingLevel = this.currentReachLevel + 0.1;
        }

        //get max level
        if (PlayerSave.getDataStorage(Configs.KEY_STORAGE_MAX_LEVEL_MODE_SINGLE)) {
            this.maxLevel = Number(PlayerSave.getDataStorage(Configs.KEY_STORAGE_MAX_LEVEL_MODE_SINGLE));
        }

        //get sound status
        if (PlayerSave.getDataStorage(Configs.KEY_STORAGE_SOUND_STATUS)) {
            this.soundStatus = PlayerSave.getDataStorage(Configs.KEY_STORAGE_SOUND_STATUS) == GameSoundStatus.ON.toString() ? GameSoundStatus.ON : GameSoundStatus.OFF;
        }

        //get music status
        if (PlayerSave.getDataStorage(Configs.KEY_STORAGE_MUSIC_STATUS)) {
            this.musicStatus = PlayerSave.getDataStorage(Configs.KEY_STORAGE_MUSIC_STATUS) == GameMusicStatus.ON.toString() ? GameMusicStatus.ON : GameMusicStatus.OFF;
        }

        //get money
        if (PlayerSave.getDataStorage(Configs.KEY_STORAGE_MONEY)) {
            this.money = Number(PlayerSave.getDataStorage(Configs.KEY_STORAGE_MONEY));
        }

        //get skin data
        if (PlayerSave.getDataStorage(Configs.KEY_STORAGE_SKIN_DATA)) {
            this.SkinData = JSON.parse(PlayerSave.getDataStorage(Configs.KEY_STORAGE_SKIN_DATA));

            this.BoySkin = this.SkinData.find(value => {
                return value.status == StatusItem.SELECTED.toString() && value.type == "Boy";
            }).name;

            this.GirlSkin = this.SkinData.find(value => {
                return value.status == StatusItem.SELECTED.toString() && value.type == "Girl";
            }).name;
        }
    }
}