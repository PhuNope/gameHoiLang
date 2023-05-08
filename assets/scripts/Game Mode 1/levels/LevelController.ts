import { _decorator, Camera, Component, EventTouch, geometry, Graphics, Input, Node, PhysicsSystem2D, tween, Tween, UITransform, Vec2, Vec3, director, Collider2D, find, EPhysics2DDrawFlags, ERaycast2DType, CCFloat, screen, RigidBody2D } from 'cc';
import { Configs, GameMusicDisplay, GameSoundDisplay } from '../../utils/Configs';
import { AudioController } from '../../controllers/AudioController';
import { GameData } from '../../utils/GameData';
import { Character } from '../items/Character';
import { Toilet } from '../../items/Toilet';
import { CameraLevel } from '../../controllers/CameraLevel';
const { ccclass, property } = _decorator;

@ccclass('LevelController')
export class LevelController extends Component {
    @property(Node)
    boyNode: Node = null;

    @property(Node)
    boyToilet: Node = null;

    boyMove: Vec2[] = [];

    //graphics
    @property(Graphics)
    boyGraphics: Graphics = null;

    //walls
    @property(Node)
    Wall: Node = null;

    //hand
    @property({
        type: Node,
        tooltip: "hand"
    })
    hand: Node = null;

    @property({
        type: CCFloat,
        tooltip: "ortho height of view camera"
    })
    orthorHeight = 790;

    touchWall: boolean = false;

    //ray cast
    _camera: Camera = new Camera();
    _ray: geometry.Ray = new geometry.Ray();

    //tween boy
    _boyTween: Tween<Readonly<Vec3>> = null;

    //body display of boy
    _boyBody: Node = null;

    _touchArea: Node = null;

    _isTouchArea: boolean = false;

    _touchAreaLeft: number = 0;

    _isTouchCorrectToilet: boolean = false;

    _positionBoyToPut: Vec3 = new Vec3();

    _checkAnimationToPlayFinish: boolean = false;

    _isDrawing: boolean = false;

    onLoad() {
        this._boyBody = this.boyNode.getChildByName("body");

        this._touchArea = this.boyNode.getChildByName("TouchArea");

        //play animation
        this.boyNode.getComponent(Character).idle();

        //event move to target
        this.node.on(Configs.EVENT_MOVE_TO_TARGET, () => {
            //play animation
            this.boyNode.getComponent(Character).run();

            //play sound
            AudioController.instance.onPLaySound(GameSoundDisplay.MOVE);

            //boy move
            this.moveToTarget();
        }, this);

        //receive event from GameMenuController not to show tutorial
        director.on(Configs.EVENT_TAP_TO_PLAY, () => { this.animationToPlay(); }, this);

        /**
         * sender: Cart, Trap
         * Purpose: receive event to stop Boy
         */
        director.on(Configs.EVENT_STOP_PLAYER, () => { this.onEventStopBoy(); }, this);

        /**
         * Sender: Trap
         * Purpose: when boy touch trap, off event touch
         */
        director.on(Configs.EVENT_OFF_EVENT_TOUCH, () => { this.offEventTouch(); }, this);

        //set fov camera
        this._camera = find("CameraLevel", this.node.parent).getComponent(Camera);
        this._camera.getComponent(CameraLevel).setOrthoHeightCamera(this.orthorHeight);
    }

    start() {
        //debug
        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
        //     EPhysics2DDrawFlags.Pair |
        //     EPhysics2DDrawFlags.CenterOfMass |
        //     EPhysics2DDrawFlags.Joint |
        //     EPhysics2DDrawFlags.Shape;
        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.All;
    }

    setupLevel() {
        Vec3.add(this._positionBoyToPut, this.boyNode.worldPosition, Vec3.ZERO);

        // this._boyBody.on(Input.EventType.TOUCH_START, this.onBoyStart, this);
        // this._boyBody.on(Input.EventType.TOUCH_MOVE, this.onBoyMove, this);
        // this._boyBody.on(Input.EventType.TOUCH_CANCEL, this.onBoyEnd, this);
        // this._boyBody.on(Input.EventType.TOUCH_END, this.onBoyEnd, this);

        // this._touchArea.on(Input.EventType.TOUCH_START, this.onBoyStart, this);
        // this._touchArea.on(Input.EventType.TOUCH_MOVE, this.onBoyMove, this);
        // this._touchArea.on(Input.EventType.TOUCH_CANCEL, this.onBoyEnd, this);
        // this._touchArea.on(Input.EventType.TOUCH_END, this.onBoyEnd, this);

        this.node.insertChild(this._touchArea, this.boyNode.getSiblingIndex() + 1);
        this._touchArea.scale = this.boyNode.scale;
        this._touchArea.position = this.boyNode.position;
        this._touchAreaLeft = this._touchArea.getComponent(UITransform).anchorX;

        this.boyNode.getComponent(Collider2D).enabled = false;
        this.boyNode.getComponent(RigidBody2D).enabled = false;

        let outpos = this._camera.worldToScreen(this.boyNode.worldPosition);
        outpos = new Vec3(outpos.x, screen.windowSize.height + 500, outpos.z);
        outpos = this._camera.screenToWorld(outpos);

        this.boyNode.worldPosition = outpos;

        //check first in game to disable tutorial
        if (find("tutorial", this.node)) {
            find("tutorial", this.node).active = false;
        }

        if (!find("Canvas/Menu").active) {
            this.animationToPlay();
        }
    }

    update(dt: number): void {
        if (!this._checkAnimationToPlayFinish) return;

        if (this._isTouchArea) {
            let loc: Vec3 = this._touchArea.worldPosition;
            let preloc: Vec3 = new Vec3();

            this.node.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(this.boyMove[this.boyMove.length - 1].x, this.boyMove[this.boyMove.length - 1].y, 0), preloc);

            let results1 = PhysicsSystem2D.instance.raycast(new Vec2(preloc.x, preloc.y), new Vec2(loc.x, loc.y), ERaycast2DType.All);

            // this.touchWall = false;
            // results.map(result => {
            //     if (result.collider.node.name.includes("Wall")) {
            //         this.touchWall = true;
            //         return;
            //     }
            // });        

            this.touchWall = false;

            results1.map(result => {
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

                    //stop sound
                    AudioController.instance.stopSound();
                }
            }
        }

        //check win
        let toiletBound = this.boyToilet.getComponent(UITransform).getBoundingBox();

        if (toiletBound.intersects(this.boyNode.getComponent(UITransform).getBoundingBox())) {
            //off event touch
            // this._boyBody.off(Input.EventType.TOUCH_START, this.onBoyStart, this);
            // this._boyBody.off(Input.EventType.TOUCH_MOVE, this.onBoyMove, this);
            // this._boyBody.off(Input.EventType.TOUCH_CANCEL, this.onBoyEnd, this);
            // this._boyBody.off(Input.EventType.TOUCH_END, this.onBoyEnd, this);

            this._touchArea.off(Input.EventType.TOUCH_START, this.onBoyStart, this);
            this._touchArea.off(Input.EventType.TOUCH_MOVE, this.onBoyMove, this);
            this._touchArea.off(Input.EventType.TOUCH_CANCEL, this.onBoyEnd, this);
            this._touchArea.off(Input.EventType.TOUCH_END, this.onBoyEnd, this);

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

            //play music
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

                    this.showTutorial();
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

    moveToTarget() {
        let listTween: Tween<Readonly<Vec3>>[] = [];

        //arr have 2 items
        if (this.boyMove.length === 2) {
            let loc: Vec2 = new Vec2();
            Vec2.subtract(loc, this.boyMove[1], this.boyMove[0]);

            let length = loc.length();
            let speed: number = Configs.SPEED * this.boyNode.scale.y * 2;

            let time: number = length / speed;

            let t = tween(this.boyNode.position)
                //xoay huong nhan vat
                .call(() => {
                    //turn left
                    if (this.boyMove[1].x < this.boyMove[0].x) {
                        this.boyNode.scale = new Vec3(Math.abs(this.boyNode.scale.x), this.boyNode.scale.y, this.boyNode.scale.z);

                        this._touchArea.getComponent(UITransform).anchorX = this._touchAreaLeft;
                    }
                    //turn right
                    if (this.boyMove[1].x > this.boyMove[0].x) {
                        this.boyNode.scale = new Vec3(-Math.abs(this.boyNode.scale.x), this.boyNode.scale.y, this.boyNode.scale.z);

                        this._touchArea.getComponent(UITransform).anchorX = 1 - this._touchAreaLeft;
                    }
                })
                .to(time, new Vec3(this.boyMove[1].x, this.boyMove[1].y, 0), {
                    onUpdate: (target: Vec3, ratio: number) => {
                        this.boyNode.position = target;
                    }
                });

            listTween.push(t);
        }

        //arr have more than 2 items
        for (let i = 1; i < this.boyMove.length; i++) {
            let loc: Vec2 = new Vec2();
            Vec2.subtract(loc, this.boyMove[i], this.boyMove[i - 1]);

            let length = loc.length();
            let speed: number = Configs.SPEED * this.boyNode.scale.y * 2;

            let time: number = length / speed;

            let t = tween(this.boyNode.position)
                //xoay huong nhan vat
                .call(() => {
                    //turn left
                    if (this.boyMove[i].x < this.boyMove[i - 1].x) {
                        this.boyNode.scale = new Vec3(Math.abs(this.boyNode.scale.x), this.boyNode.scale.y, this.boyNode.scale.z);

                        this._touchArea.getComponent(UITransform).anchorX = this._touchAreaLeft;
                    }
                    //turn right
                    if (this.boyMove[i].x > this.boyMove[i - 1].x) {
                        this.boyNode.scale = new Vec3(-Math.abs(this.boyNode.scale.x), this.boyNode.scale.y, this.boyNode.scale.z);

                        this._touchArea.getComponent(UITransform).anchorX = 1 - this._touchAreaLeft;
                    }
                })
                .to(time, new Vec3(this.boyMove[i].x, this.boyMove[i].y, 0), {
                    onUpdate: (target: Vec3, ratio: number) => {
                        this.boyNode.position = target;
                    }
                });

            listTween.push(t);
        }

        //play move
        this._boyTween = tween(this.boyNode.position)
            .sequence(...listTween)
            .call(() => {
                //stop sound
                AudioController.instance._soundBackground.stop();
                AudioController.instance._soundBackground.clip = null;

                //reset list move
                this.boyMove = [];

                //animation
                this.boyNode.getComponent(Character).idle();

                this._touchArea.position = this.boyNode.position;

                //on event touch
                // this._boyBody.on(Input.EventType.TOUCH_START, this.onBoyStart, this);
                // this._boyBody.on(Input.EventType.TOUCH_MOVE, this.onBoyMove, this);
                // this._boyBody.on(Input.EventType.TOUCH_CANCEL, this.onBoyEnd, this);
                // this._boyBody.on(Input.EventType.TOUCH_END, this.onBoyEnd, this);

                this._touchArea.on(Input.EventType.TOUCH_START, this.onBoyStart, this);
                this._touchArea.on(Input.EventType.TOUCH_MOVE, this.onBoyMove, this);
                this._touchArea.on(Input.EventType.TOUCH_CANCEL, this.onBoyEnd, this);
                this._touchArea.on(Input.EventType.TOUCH_END, this.onBoyEnd, this);

                //clear graphics
                this.boyGraphics.clear();
                this.boyGraphics.moveTo(this.boyNode.position.x, this.boyNode.position.y);
            });

        this._boyTween.start();
    }

    onBoyStart(event: EventTouch) {
        //check tutorial
        if (find("tutorial", this.node)) {
            find("tutorial", this.node).active = false;
        }

        this.boyMove = [];

        //let point = new Vec2(event.getUILocation().x - Configs.HALF_WIDTH, event.getUILocation().y - Configs.HALF_HEIGHT);

        this.boyMove.push(new Vec2(this.boyNode.position.x, this.boyNode.position.y));

        //graphics
        this.boyGraphics.moveTo(this.boyNode.position.x, this.boyNode.position.y);

        // let loc: Vec3 = new Vec3();

        // this._camera.screenToWorld(new Vec3(event.getLocationX(), event.getLocationY(), 0), loc);

        // //line cut collider
        // if (PhysicsSystem2D.instance.raycast(new Vec2(this.boyNode.worldPosition.x, this.boyNode.worldPosition.y), new Vec2(loc.x, loc.y)).length != 0) {
        //     let results = PhysicsSystem2D.instance.raycast(new Vec2(this.boyNode.worldPosition.x, this.boyNode.worldPosition.y), new Vec2(loc.x, loc.y));

        //     if (results[0].collider.node.name == "Wall") {
        //         this.touchWall = true;
        //     }
        // }
        // else {
        //     if (Vec2.distance(this.boyMove[this.boyMove.length - 1], point) === 0) return;

        //     this.boyMove.push(point);

        //     //graphics
        //     this.boyGraphics.lineTo(point.x, point.y);
        //     this.boyGraphics.stroke();
        //     this.boyGraphics.moveTo(point.x, point.y);
        // }

        this._isTouchCorrectToilet = false;

        this._isDrawing = true;
    }

    onBoyMove(event: EventTouch) {
        //off event touch
        //this._boyBody.off(Input.EventType.TOUCH_START, this.onBoyStart, this);

        //let point = new Vec2(event.getUILocation().x - Configs.HALF_WIDTH, event.getUILocation().y - Configs.HALF_HEIGHT);

        let point = new Vec3();

        this._camera.screenToWorld(new Vec3(event.getLocationX(), event.getLocationY(), 0), point);

        // let loc: Vec3 = new Vec3();
        // let preloc: Vec3 = new Vec3();

        // this._camera.screenToWorld(new Vec3(event.getLocationX(), event.getLocationY(), 0), loc);
        // this.node.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(this.boyMove[this.boyMove.length - 1].x, this.boyMove[this.boyMove.length - 1].y, 0), preloc);

        // let results = PhysicsSystem2D.instance.raycast(new Vec2(preloc.x, preloc.y), new Vec2(loc.x, loc.y), ERaycast2DType.All);

        // this.touchWall = false;
        // results.map(result => {
        //     console.log(result.collider.node.name);
        //     if (result.collider.node.name.includes("Wall")) {
        //         this.touchWall = true;
        //         return;
        //     }
        // });

        // //line out collider
        // if (!this.touchWall) {
        //     if (Vec2.distance(this.boyMove[this.boyMove.length - 1], point) < 20) return;

        //     this.boyGraphics.lineTo(point.x, point.y);
        //     this.boyGraphics.stroke();
        //     this.boyGraphics.moveTo(point.x, point.y);
        //     this.boyMove.push(point);
        // }

        this._touchArea.worldPosition = new Vec3(point.x, point.y, 0);

        if (!this._isTouchCorrectToilet) {
            this._isTouchArea = true;
        }

        if (this._isDrawing) {
            //audio
            AudioController.instance.onPLaySound(GameSoundDisplay.DRAWING);

            this._isDrawing = false;
        }
    }

    onBoyEnd(event: EventTouch) {
        //audio
        AudioController.instance.stopSound();

        this._isTouchArea = false;

        this._touchArea.position = this.boyNode.position;

        //scale off toilet
        if (this._isTouchCorrectToilet) {
            this.boyToilet.scale = this.boyToilet.scale.multiplyScalar(1 / 1.2);
        }

        //send event to Cart to enable rigidboby cart
        director.emit(Configs.EVENT_ENABLE_RIGIDBODY_CART);

        //off event touch
        // this._boyBody.off(Input.EventType.TOUCH_START, this.onBoyStart, this);
        // this._boyBody.off(Input.EventType.TOUCH_MOVE, this.onBoyMove, this);

        this._touchArea.off(Input.EventType.TOUCH_START, this.onBoyStart, this);
        this._touchArea.off(Input.EventType.TOUCH_MOVE, this.onBoyMove, this);

        if (this.boyMove.length < 2) {
            this.boyGraphics.clear();
            this.touchWall = false;

            //on event touch
            // this._boyBody.on(Input.EventType.TOUCH_START, this.onBoyStart, this);
            // this._boyBody.on(Input.EventType.TOUCH_MOVE, this.onBoyMove, this);
            // this._boyBody.on(Input.EventType.TOUCH_CANCEL, this.onBoyEnd, this);
            // this._boyBody.on(Input.EventType.TOUCH_END, this.onBoyEnd, this);

            this._touchArea.on(Input.EventType.TOUCH_START, this.onBoyStart, this);
            this._touchArea.on(Input.EventType.TOUCH_MOVE, this.onBoyMove, this);
            this._touchArea.on(Input.EventType.TOUCH_CANCEL, this.onBoyEnd, this);
            this._touchArea.on(Input.EventType.TOUCH_END, this.onBoyEnd, this);
            return;
        }
        else {
            //off event touch
            // this._boyBody.off(Input.EventType.TOUCH_START, this.onBoyStart, this);
            // this._boyBody.off(Input.EventType.TOUCH_MOVE, this.onBoyMove, this);
            // this._boyBody.off(Input.EventType.TOUCH_CANCEL, this.onBoyEnd, this);
            // this._boyBody.off(Input.EventType.TOUCH_END, this.onBoyEnd, this);

            this._touchArea.off(Input.EventType.TOUCH_START, this.onBoyStart, this);
            this._touchArea.off(Input.EventType.TOUCH_MOVE, this.onBoyMove, this);
            this._touchArea.off(Input.EventType.TOUCH_CANCEL, this.onBoyEnd, this);
            this._touchArea.off(Input.EventType.TOUCH_END, this.onBoyEnd, this);

            //send event to this to move node to target
            this.node.emit(Configs.EVENT_MOVE_TO_TARGET);
        }
    }

    // unActiveHand() {
    //     this.hand.active = false;
    // }

    onEventStopBoy() {
        this._boyTween.stop();

        //stop sound
        AudioController.instance._soundBackground.stop();
        AudioController.instance._soundBackground.clip = null;

        //reset list move
        this.boyMove = [];

        // tween(this.boyNode)
        //     .call(() => {
        //         this._touchArea.position = this.boyNode.position;
        //     })
        //     .start();

        this._touchArea.position = this.boyNode.position;

        //on event touch
        // this._boyBody.on(Input.EventType.TOUCH_START, this.onBoyStart, this);
        // this._boyBody.on(Input.EventType.TOUCH_MOVE, this.onBoyMove, this);
        // this._boyBody.on(Input.EventType.TOUCH_CANCEL, this.onBoyEnd, this);
        // this._boyBody.on(Input.EventType.TOUCH_END, this.onBoyEnd, this);

        this._touchArea.on(Input.EventType.TOUCH_START, this.onBoyStart, this);
        this._touchArea.on(Input.EventType.TOUCH_MOVE, this.onBoyMove, this);
        this._touchArea.on(Input.EventType.TOUCH_CANCEL, this.onBoyEnd, this);
        this._touchArea.on(Input.EventType.TOUCH_END, this.onBoyEnd, this);

        //clear graphics
        this.boyGraphics.clear();
    }

    offEventTouch() {
        //on event touch
        // this._boyBody.off(Input.EventType.TOUCH_START, this.onBoyStart, this);
        // this._boyBody.off(Input.EventType.TOUCH_MOVE, this.onBoyMove, this);
        // this._boyBody.off(Input.EventType.TOUCH_CANCEL, this.onBoyEnd, this);
        // this._boyBody.off(Input.EventType.TOUCH_END, this.onBoyEnd, this);

        this._touchArea.off(Input.EventType.TOUCH_START, this.onBoyStart, this);
        this._touchArea.off(Input.EventType.TOUCH_MOVE, this.onBoyMove, this);
        this._touchArea.off(Input.EventType.TOUCH_CANCEL, this.onBoyEnd, this);
        this._touchArea.off(Input.EventType.TOUCH_END, this.onBoyEnd, this);
    }

    onDestroy() {
        Tween.stopAll();
        this.unscheduleAllCallbacks();
    }

    showTutorial() {
        if (find("tutorial", this.node)) {
            find("tutorial", this.node).active = true;
        }
    }
}