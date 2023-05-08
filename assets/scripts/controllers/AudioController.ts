import { _decorator, AudioClip, AudioSource, Component, director, Node, EventTarget } from 'cc';
import { Configs, GameMode, GameMusicDisplay, GameMusicStatus, GameSoundDisplay, GameSoundStatus } from '../utils/Configs';
import { GameData } from '../utils/GameData';
import { ResourceUtils } from '../utils/ResourceUtils';
import { PlayerSave } from '../utils/PlayerSave';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    public static instance: AudioController;

    @property(AudioClip)
    soundList: AudioClip[] = [];

    _musicBackground: AudioSource = null;
    _soundBackground: AudioSource = null;

    onLoad() {
        if (AudioController.instance == null) {
            AudioController.instance = this;
        }

        director.addPersistRootNode(this.node);

        this._musicBackground = this.node.getChildByName("music").getComponent(AudioSource);

        this._soundBackground = this.node.getChildByName("sound").getComponent(AudioSource);
    }

    onPlayMusic(gameSoundDisPlay: GameMusicDisplay) {
        if (GameData.instance.musicStatus == GameMusicStatus.OFF) return;

        this._musicBackground.stop();
        this._musicBackground.clip = null;

        switch (gameSoundDisPlay) {
            case GameMusicDisplay.BACKGROUND:
                if (GameData.instance.GameMode == GameMode.SINGLE) {
                    ResourceUtils.loadSoundAsset(GameMusicDisplay.BACKGROUND_SINGLE, (audioClip: AudioClip) => {
                        this._musicBackground.clip = audioClip;
                        this._musicBackground.loop = true;
                        this._musicBackground.play();
                    });
                    break;
                }

                if (GameData.instance.GameMode == GameMode.MULTI) {
                    ResourceUtils.loadSoundAsset(GameMusicDisplay.BACKGROUND_MULTI, (audioClip: AudioClip) => {
                        this._musicBackground.clip = audioClip;
                        this._musicBackground.loop = true;
                        this._musicBackground.play();
                    });
                    break;
                }

                break;

            default:
                ResourceUtils.loadSoundAsset(gameSoundDisPlay, (audioClip: AudioClip) => {
                    this._musicBackground.clip = audioClip;
                    this._musicBackground.loop = false;
                    this._musicBackground.play();
                });
                break;
        }

        this._musicBackground.volume = 1;
    }

    onPLaySound(gameSoundDisplay: GameSoundDisplay) {
        if (GameData.instance.soundStatus == GameSoundStatus.OFF) return;

        this._soundBackground.stop();
        this._soundBackground.clip = null;

        switch (gameSoundDisplay) {
            case GameSoundDisplay.BUTTON:
                this._soundBackground.playOneShot(this.soundList[gameSoundDisplay], 1);
                break;

            case GameSoundDisplay.HIT_TOILET:
                this._soundBackground.playOneShot(this.soundList[gameSoundDisplay], 1);
                break;

            case GameSoundDisplay.MOVE:
                this._soundBackground.clip = this.soundList[gameSoundDisplay];
                this._soundBackground.loop = true;
                this._soundBackground.play();
                break;

            case GameSoundDisplay.ITEM:
                this._soundBackground.playOneShot(this.soundList[gameSoundDisplay], 1);
                break;

            case GameSoundDisplay.DRAWING:
                this._soundBackground.clip = this.soundList[gameSoundDisplay];
                this._soundBackground.loop = true;
                this._soundBackground.play();
                break;

            case GameSoundDisplay.PAPER:
                //this._soundBackground.playOneShot(this.soundList[gameSoundDisplay], 1);
                break;

            case GameSoundDisplay.CART:
                this._soundBackground.playOneShot(this.soundList[gameSoundDisplay], 1);
                break;

            case GameSoundDisplay.HIT_ENEMY:
                this._soundBackground.playOneShot(this.soundList[gameSoundDisplay], 1);
                break;

            case GameSoundDisplay.LIGHT:
                this._soundBackground.playOneShot(this.soundList[gameSoundDisplay], 1);
                break;

            case GameSoundDisplay.LETS_GO:
                this._soundBackground.playOneShot(this.soundList[gameSoundDisplay], 1);
                break;
        }
    }

    stopMusic() {
        this._musicBackground.stop();
        this._musicBackground.clip = null;
    }

    stopSound() {
        this._soundBackground.stop();
        this._soundBackground.clip = null;
    }
}