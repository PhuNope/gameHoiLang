import { _decorator, AudioClip, AudioSource, Component, director, Node } from 'cc';
import { MusicName, SoundName } from '../utils/Configs';
import { GameData } from '../utils/GameData';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    public static instance: AudioController;

    @property({
        type: AudioClip,
        tooltip: "this is an array of sounds"
    })
    sounds: AudioClip[] = [];

    @property({
        type: AudioClip,
        tooltip: "this is an array of musics"
    })
    musics: AudioClip[] = [];

    @property({
        type: AudioSource,
        tooltip: "This is music's ground played"
    })
    musicGround: AudioSource = null;

    @property({
        type: AudioSource,
        tooltip: "This is sound's ground played"
    })
    soundGround: AudioSource = null;

    onLoad() {
        if (AudioController.instance == null) {
            AudioController.instance = this;
        }

        director.addPersistRootNode(this.node);
    }

    playSound(soundName: SoundName) {
        //pause current sound
        if (this.soundGround.playing) {
            this.soundGround.stop();
            this.soundGround.clip = null;
        }

        //check sound status
        if (!GameData.instance.SoundStatus) return;

        switch (soundName) {

        }
    }

    playMusic(musicName: MusicName) {
        //pause current music
        if (this.musicGround.playing) {
            this.musicGround.stop();
            this.musicGround.clip = null;
        }

        //check music status
        if (!GameData.instance.MusicStatus) return;

        switch (musicName) {
            case MusicName.BG:
                this.musicGround.clip = this.musics[MusicName.BG];
                this.musicGround.loop = true;
                this.musicGround.play();
                break;
        }

    }
}


