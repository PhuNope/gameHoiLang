import { _decorator, Component, Node, Skeleton, sp } from 'cc'; import { DisplayAnimation, GameSoundDisplay } from '../../utils/Configs';
import { GameData } from '../../utils/GameData';
import { AudioController } from '../../controllers/AudioController';
;
const { ccclass, property } = _decorator;

enum SkinName {
    BOY = "skin 1",
    GIRL = "skin 2"
}

@ccclass('Character')
export class Character extends Component {
    @property(sp.Skeleton)
    characterSkeleton: sp.Skeleton | null = null;

    start() {
        this.characterSkeleton.setSkin(GameData.instance.BoySkin);
    }

    run() {
        this.characterSkeleton.setAnimation(0, DisplayAnimation.RUN, true);
    }

    idle() {
        this.characterSkeleton.setAnimation(0, DisplayAnimation.STAND, true);
    }

    die() {
        this.characterSkeleton.setAnimation(0, DisplayAnimation.DIE, false);
    }

    dieByThorn() {
        //play sound
        AudioController.instance.onPLaySound(GameSoundDisplay.HIT_ENEMY);

        this.characterSkeleton.setAnimation(0, DisplayAnimation.DIE_BY_THORN, false);
    }

    crouch() {
        this.characterSkeleton.setAnimation(0, DisplayAnimation.CROUCH, true);
    }
}

