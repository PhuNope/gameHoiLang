import { _decorator, CCFloat, Collider2D, Component, director, EPhysics2DDrawFlags, EventTouch, find, Input, input, Node, PhysicsSystem2D, Tween } from 'cc';
import { Configs, GameMusicDisplay, GameSoundDisplay } from '../../utils/Configs';
import { AudioController } from '../../controllers/AudioController';
import { GameData } from '../../utils/GameData';
import { CameraLevel } from '../../controllers/CameraLevel';
const { ccclass, property } = _decorator;

@ccclass('LevelController')
export class LevelController extends Component {
    @property({
        type: CCFloat,
        tooltip: "number of charactor"
    })
    numberOfCharactor = 0;

    @property({
        type: CCFloat,
        tooltip: "ortho height of view camera"
    })
    orthorHeight = 790;

    _countFinishChooseDoor: number = 0;
    _countFinishMove: number = 0;

    _Wall: Node = null;

    onLoad() {
        /**
         * Sender: Charactor
         * Purpose: charactor choose door
         */
        director.on(Configs.EVENT_CHOOSE_DOOR, () => { this.chooseDoor(); }, this);

        /**
         * Sender: Charactor
         * Purpose: charactor move to door
         */
        director.on(Configs.EVENT_MOVE_FINISH, () => { this.countFinishMove(); }, this);

        /**
         * Sender: Charactor
         * Purpose: charactor need to show loseUI
         */
        director.on(Configs.EVENT_HIT_TO_OTHER, () => { this.showLoseUI(); }, this);

        //receive event from GameMenuController not to show tutorial;
        director.on(Configs.EVENT_TAP_TO_PLAY, () => { this.showTutorial(); }, this);

        this._Wall = find("Wall", this.node);

        //set ortho height camera
        //find("Canvas/GamePlay/CameraLevel").getComponent(CameraLevel).setOrthoHeightCamera(this.orthorHeight);
    }

    start() {
        // //debug;
        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
        //     EPhysics2DDrawFlags.Pair |
        //     EPhysics2DDrawFlags.CenterOfMass |
        //     EPhysics2DDrawFlags.Joint |
        //     EPhysics2DDrawFlags.Shape;
        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.All;

        //set collider of wall
        if (this._Wall) {
            this._Wall.getComponents(Collider2D).map(collider => {
                collider.enabled = false;
            });
        }

        //send event to MouseJoint to enable MouseJoint
        director.emit(Configs.EVENT_ENABLE_MOUSE_JOINT);

        if (find("tutorial", this.node)) {
            find("tutorial", this.node).active = false;
        }
    }

    showTutorial() {
        if (find("tutorial", this.node)) {
            find("tutorial", this.node).active = true;
        }
    }

    chooseDoor() {
        this._countFinishChooseDoor++;

        if (this._countFinishChooseDoor == this.numberOfCharactor) {
            ///play audio
            AudioController.instance.onPLaySound(GameSoundDisplay.MOVE);

            /**
             * Receiver: LevelController, EnemyPurple
             * Purpose: make move
             * 
             * Receiver: Enemy3
             * Purpose: change rigidbody to dynamic
             */
            director.emit(Configs.EVENT_MOVE_TO_TARGET);

            //disable mouse joint
            director.emit(Configs.EVENT_DISABLE_MOUSE_JOINT);
        }
    }

    countFinishMove() {
        this._countFinishMove++;

        if (this._countFinishMove == this.numberOfCharactor) {
            //stop sound
            AudioController.instance.stopSound();

            //play music
            AudioController.instance.onPlayMusic(GameMusicDisplay.FLUSH);

            //send event to GameUIController to update progress level bar;
            let count: number = Math.round((GameData.instance.playingLevel % 1 * 10));
            director.emit(Configs.EVENT_UPDATE_PROGRESS_LEVEL, count);

            //send event to GameUIController to update progress reward and show winUI
            director.emit(Configs.EVENT_UPDATE_PROGRESS_REWARD_LEVEL);
        }
    }

    showLoseUI() {
        //send event to GameController to show loseUI
        this.node.emit(Configs.EVENT_LOSE_LEVEL);

        this.showLoseUI = () => { };
    }

    //add to Tutorial button
    onClickTutorial() {
        find("tutorial", this.node).destroy();
    }

    onDestroy() {
        this.unscheduleAllCallbacks();
    }
}

