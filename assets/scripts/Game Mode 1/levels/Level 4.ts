import { _decorator, CCFloat, Component, director, ERaycast2DType, find, Input, Label, Node, PhysicsSystem2D, Tween, UITransform, Vec2, Vec3, screen, tween, Collider2D, RigidBody2D } from 'cc';
import { LevelController } from './LevelController';
import { Configs, GameMusicDisplay, GameSoundDisplay } from '../../utils/Configs';
import { AudioController } from '../../controllers/AudioController';
import { GameData } from '../../utils/GameData';
import { Character } from '../items/Character';
import { Toilet } from '../../items/Toilet';
const { ccclass, property } = _decorator;

@ccclass('Level_4')
export class Level_4 extends LevelController {
    @property({
        type: Label,
        tooltip: "label time top"
    })
    labelTimeTop: Label = null;

    @property({
        type: Label,
        tooltip: "label time player"
    })
    labelTimePlayer: Label = null;

    @property({
        type: CCFloat,
        tooltip: "time to lose"
    })
    time = 20;

    //body of boy
    _boyBody: Node = null;

    //count time to lose
    _countTime;

    start() {
        this.setLabel(this.time);
        this.labelTimePlayer.node.active = false;

        super.start();
    }

    countDownToLose() {
        this._countTime = setInterval(() => {
            this.setLabel(this.time);

            if (this.time == 0) {
                this.LoseGame();
                clearInterval(this._countTime);

                return;
            }

            this.time--;
        }, 1000);
    }

    animationToPlay() {
        let outpos = this._camera.worldToScreen(this.boyNode.worldPosition);
        outpos = new Vec3(outpos.x, screen.windowSize.height + 50, outpos.z);
        outpos = this._camera.screenToWorld(outpos);

        this.boyNode.worldPosition = outpos;
        let that = this;

        this.scheduleOnce(() => {
            tween(this.boyNode)
                .to(1, { worldPosition: this._positionBoyToPut }, { easing: "cubicInOut" })

                .call(() => {
                    //play sound
                    AudioController.instance.onPLaySound(GameSoundDisplay.LETS_GO);

                    //on event touch
                    this._touchArea.on(Input.EventType.TOUCH_START, this.onBoyStart, this);
                    this._touchArea.on(Input.EventType.TOUCH_MOVE, this.onBoyMove, this);
                    this._touchArea.on(Input.EventType.TOUCH_CANCEL, this.onBoyEnd, this);
                    this._touchArea.on(Input.EventType.TOUCH_END, this.onBoyEnd, this);

                    this.boyNode.getComponent(Collider2D).enabled = true;
                    this.boyNode.getComponent(RigidBody2D).enabled = true;

                    this._checkAnimationToPlayFinish = true;

                    let boyBodyUI = this._boyBody.getComponent(UITransform);
                    //set position label time player
                    this.labelTimePlayer.node.worldPosition = new Vec3(this.boyNode.worldPosition.x, this.boyNode.worldPosition.y + boyBodyUI.height * this.boyNode.scale.y * (1 - boyBodyUI.anchorY), 0);

                    this.labelTimePlayer.node.active = true;

                    this._checkAnimationToPlayFinish = true;

                    this.countDownToLose();
                })

                .start();

            tween(this.hand.worldPosition)
                .delay(1)

                .to(1, outpos, {
                    onUpdate(target: Vec3, ratio) {
                        that.hand.worldPosition = target;
                    },
                    easing: "cubicInOut"
                })

                .call(() => {
                    this.hand.destroy();
                })

                .start();
        }, 0.1);
    }

    setLabel(time: number) {
        this.labelTimeTop.string = this.formatTime(time);
        this.labelTimePlayer.string = `${time}S`;
    }

    formatTime(second: number): string {
        let date = new Date(0);
        date.setSeconds(second);
        let minutes = date.getUTCMinutes().toString();
        let paddedMinutes = minutes.length === 1 ? '0' + minutes : minutes;
        let seconds = date.getUTCSeconds().toString();
        let paddedSeconds = seconds.length === 1 ? '0' + seconds : seconds;

        return `${paddedMinutes}:${paddedSeconds}`;
    }

    LoseGame() {
        //off event touch
        this.boyNode.off(Input.EventType.TOUCH_START, this.onBoyStart, this);
        this.boyNode.off(Input.EventType.TOUCH_MOVE, this.onBoyMove, this);
        this.boyNode.off(Input.EventType.TOUCH_CANCEL, this.onBoyEnd, this);
        this.boyNode.off(Input.EventType.TOUCH_END, this.onBoyEnd, this);

        //stop all tween
        if (this._boyTween) {
            this._boyTween.stop();
        }

        //animation
        this.boyNode.getComponent(Character).die();

        //send event to gamecontroller to show lose UI
        this.node.emit(Configs.EVENT_LOSE_LEVEL);
    }

    update(dt: number): void {
        if (!this._checkAnimationToPlayFinish) return;

        if (this._isTouchArea) {
            let loc: Vec3 = this._touchArea.worldPosition;
            let preloc: Vec3 = new Vec3();

            this.node.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(this.boyMove[this.boyMove.length - 1].x, this.boyMove[this.boyMove.length - 1].y, 0), preloc);

            let results = PhysicsSystem2D.instance.raycast(new Vec2(preloc.x, preloc.y), new Vec2(loc.x, loc.y), ERaycast2DType.All);

            this.touchWall = false;
            results.map(result => {
                if (result.collider.node.name.includes("Wall")) {
                    this.touchWall = true;
                    return;
                }
            });

            //line out collider
            if (!this.touchWall) {
                if (Vec2.distance(this.boyMove[this.boyMove.length - 1], new Vec2(this._touchArea.position.x, this._touchArea.position.y)) < 10) return;

                this.boyGraphics.lineTo(this._touchArea.position.x, this._touchArea.position.y);
                this.boyGraphics.stroke();
                this.boyGraphics.moveTo(this._touchArea.position.x, this._touchArea.position.y);
                this.boyMove.push(new Vec2(this._touchArea.position.x, this._touchArea.position.y));

                //moving hit the toilet
                if (this.boyToilet.getComponent(UITransform).getBoundingBox().contains(new Vec2(this._touchArea.position.x, this._touchArea.position.y))) {
                    this._isTouchArea = false;
                    this._isTouchCorrectToilet = true;

                    this.boyToilet.scale = this.boyToilet.scale.multiplyScalar(1.2);
                }
            }
        }

        let boyBodyUI = this._boyBody.getComponent(UITransform);
        //set position label time player
        this.labelTimePlayer.node.worldPosition = new Vec3(this.boyNode.worldPosition.x, this.boyNode.worldPosition.y + boyBodyUI.height * this.boyNode.scale.y * (1 - boyBodyUI.anchorY), 0);

        //check win
        let toiletBound = this.boyToilet.getComponent(UITransform).getBoundingBox();

        if (toiletBound.intersects(this.boyNode.getComponent(UITransform).getBoundingBox())) {
            //off event touch
            this._boyBody.off(Input.EventType.TOUCH_START, this.onBoyStart, this);
            this._boyBody.off(Input.EventType.TOUCH_MOVE, this.onBoyMove, this);
            this._boyBody.off(Input.EventType.TOUCH_CANCEL, this.onBoyEnd, this);
            this._boyBody.off(Input.EventType.TOUCH_END, this.onBoyEnd, this);

            //stop sound 
            AudioController.instance._soundBackground.stop();
            AudioController.instance._soundBackground.clip = null;

            //stop tween
            this._boyTween.stop();

            this.boyNode.scale = new Vec3(Math.abs(this.boyNode.scale.x), this.boyNode.scale.y, this.boyNode.scale.z);
            this.boyNode.setWorldPosition(this.boyToilet.getChildByName("SitPoint").getWorldPosition());

            //set toilet animation
            this.boyToilet.getComponent(Toilet).sitOn();

            //clear graphics
            this.boyGraphics.clear();

            //animation
            this.boyNode.getComponent(Character).crouch();

            //stop interval count time
            clearInterval(this._countTime);

            //delete label time player
            this.labelTimePlayer.node.destroy();

            //play sound
            AudioController.instance.onPlayMusic(GameMusicDisplay.FLUSH);

            //
            this.scheduleOnce(() => {
                //send event to GameUIController to update progress level bar
                let count: number = Math.round((GameData.instance.playingLevel % 1 * 10));
                director.emit(Configs.EVENT_UPDATE_PROGRESS_LEVEL, count);

                //send event to GameUIController to update progress reward and show winUI
                director.emit(Configs.EVENT_UPDATE_PROGRESS_REWARD_LEVEL);
            }, 0.5);

            //set update to default
            this.update = () => { };
        }
    }

    onDestroy(): void {
        super.onDestroy();

        clearInterval(this._countTime);
    }
}