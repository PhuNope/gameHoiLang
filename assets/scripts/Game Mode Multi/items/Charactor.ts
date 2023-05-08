import { _decorator, Component, find, Graphics, sp, Vec2, Node, EventTouch, Camera, Tween, Vec3, UITransform, director, tween, Collider2D, IPhysics2DContact, Contact2DType, RigidBody2D, ERigidBody2DType, DistanceJoint2D } from 'cc';
import { Configs, DisplayAnimation, GameSoundDisplay } from '../../utils/Configs';
import { AudioController } from '../../controllers/AudioController';
import { Door } from './Door';
import { Toilet } from '../../items/Toilet';
import { GameData } from '../../utils/GameData';
const { ccclass, property } = _decorator;

enum SkinName {
    BOY = "skin 1",
    GIRL = "skin 2"
}

@ccclass('Charactor')
export class Charactor extends Component {
    @property({
        type: sp.Skeleton,
        tooltip: "skeleton of charactor"
    })
    characterSkeleton: sp.Skeleton = null;

    @property({
        type: Collider2D,
        tooltip: "collider of charactor"
    })
    characterCollider: Collider2D = null;

    //graphics
    _Graphics: Graphics = null;

    //move list
    _moveList: Vec2[] = [];

    //list of door
    _doorGroup: Node = null;

    //ray cast
    _camera: Camera = new Camera();

    //tween list
    _tweenList: Tween<Readonly<Vec3>> = null;

    touchWall: boolean = false;

    _chooseDoor: Node = null;

    _touchArea: Node = null;

    _isFinishMove: boolean = false;

    _rigidBodyCharactor: RigidBody2D = null;

    _isTouchArea: boolean = false;

    _NodeFollow: Node = null;

    _isDrawing: boolean = false;

    onLoad() {
        this._Graphics = find(`Graphics${this.node.name}`, this.node.parent).getComponent(Graphics);
        this._doorGroup = find("DoorGroup", this.node.parent);
        this._camera = find("Canvas/Camera").getComponent(Camera);
        this._touchArea = this.node.getChildByName("TouchArea");
        this._NodeFollow = this._touchArea.getChildByName("NodeFollow");
        this._rigidBodyCharactor = this.node.getComponent(RigidBody2D);

        /**
         * Sender: LevelController
         * Purpose: event move to target if all character is finished touch
         */
        director.on(Configs.EVENT_MOVE_TO_TARGET, () => { this.moveToTarget(); }, this);

        //event collider
        this.characterCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    start() {
        //set default skin
        if (this.node.name.includes("Boy")) {
            this.characterSkeleton.setSkin(GameData.instance.BoySkin);
        }

        if (this.node.name.includes("Girl")) {
            this.characterSkeleton.setSkin(GameData.instance.GirlSkin);
        }

        //set default rigidbody to static
        this._rigidBodyCharactor.enabled = false;
        //this._NodeFollow.getComponent(RigidBody2D).type = ERigidBody2DType.Static;

        //on event touch
        this._touchArea.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this._touchArea.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this._touchArea.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this._touchArea.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);

        //set parent touch area
        // this._touchArea.parent = this.node.parent;
        // this._touchArea.scale = this.node.scale;
        // this._touchArea.worldPosition = this.node.worldPosition;
    }

    onTouchStart(event: EventTouch) {
        //check tutorial
        if (find("tutorial", this.node)) {
            find("tutorial", this.node).active = false;
        }

        this._isDrawing = true;

        //let point = new Vec2(event.getUILocation().x - Configs.HALF_WIDTH, event.getUILocation().y - Configs.HALF_HEIGHT);
        let point = new Vec3();

        this._moveList = [];

        this._moveList.push(new Vec2(this.node.position.x, this.node.position.y));

        //graphics
        this._Graphics.moveTo(this.node.position.x, this.node.position.y);

        //set node follow
        this._touchArea.getComponent(DistanceJoint2D).enabled = false;

        this._camera.screenToWorld(new Vec3(event.getLocation().x, event.getLocation().y, 0), point);

        this._NodeFollow.worldPosition = point;

        let anchor = this._touchArea.getComponent(UITransform).convertToNodeSpaceAR(point);

        this._touchArea.getComponent(DistanceJoint2D).connectedAnchor = new Vec2(anchor.x * -1 * this.node.scale.x, anchor.y * -1 * this.node.scale.y);

        this._touchArea.getComponent(DistanceJoint2D).enabled = true;

        // this._Graphics.lineTo(point.x, point.y);
        // this._Graphics.stroke();
        // this._Graphics.moveTo(point.x, point.y);

        // this._moveList.push(point);
    }

    _isTouchCorrectDoor: boolean = false;

    onTouchMove(event: EventTouch) {
        if (!this._isTouchCorrectDoor) {
            this._isTouchArea = true;
        }

        //set collider of wall
        if (find("Wall", this.node.parent)) {
            find("Wall", this.node.parent).getComponents(Collider2D).map(collider => {
                collider.enabled = true;
            });
        }

        if (this._isDrawing) {
            //audio
            AudioController.instance.onPLaySound(GameSoundDisplay.DRAWING);

            this._isDrawing = false;
        }
    }

    onTouchEnd(event: EventTouch) {
        //stop sound
        AudioController.instance.stopSound();

        //set collider of wall
        if (find("Wall", this.node.parent)) {
            find("Wall", this.node.parent).getComponents(Collider2D).map(collider => {
                collider.enabled = false;
            });
        }

        //
        //let point = new Vec3(event.getUILocation().x - Configs.HALF_WIDTH, event.getUILocation().y - Configs.HALF_HEIGHT, 0);

        this._isTouchArea = false;

        this._touchArea.getComponent(RigidBody2D).type = ERigidBody2DType.Static;
        this._NodeFollow.getComponent(RigidBody2D).type = ERigidBody2DType.Static;

        if (this._chooseDoor) {
            this._chooseDoor.scale = new Vec3(1, 1, 1);

            //turn off event
            this.offEventTouch();

            //send event to LevelController to count touch
            director.emit(Configs.EVENT_CHOOSE_DOOR);
        }
        else {
            this._Graphics.clear();

            this._NodeFollow.getComponent(RigidBody2D).type = ERigidBody2DType.Dynamic;

            this._touchArea.position = Vec3.ZERO;
            //this._touchArea.position = this.node.position;
            //this._NodeFollow.position = this.node.position;
            //this._touchArea.getComponent(RigidBody2D).enabled = true;
            this._touchArea.getComponent(RigidBody2D).type = ERigidBody2DType.Dynamic;
        }

        // this._doorGroup.children.map(child => {
        //     if (child.name.includes(this.node.name.split("-")[0])) {
        //         //let world = this.node.parent.getComponent(UITransform).convertToWorldSpaceAR(point);
        //         let local = this._doorGroup.getComponent(UITransform).convertToNodeSpaceAR(this._touchArea.worldPosition);

        //         if (child.getComponent(UITransform).getBoundingBox().contains(new Vec2(local.x, local.y))) {
        //             if (!child.getComponent(Door)._isChooseDoor) {
        //                 this._chooseDoor = child;
        //                 child.getComponent(Door)._isChooseDoor = true;

        //                 //turn off event
        //                 this.offEventTouch();

        //                 //send event to LevelController to count touch
        //                 director.emit(Configs.EVENT_CHOOSE_DOOR);
        //                 return;
        //             }
        //             else {
        //                 this._Graphics.clear();

        //                 return;
        //             }
        //         }
        //     }
        // });

        // if (!this._chooseDoor) {
        //     this._Graphics.clear();

        //     this._touchArea.position = this.node.position;
        //     //this._touchArea.getComponent(RigidBody2D).enabled = true;
        //     this._touchArea.getComponent(RigidBody2D).type = ERigidBody2DType.Dynamic;
        // }
    }

    offEventTouch() {
        this._touchArea.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this._touchArea.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this._touchArea.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this._touchArea.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onEventStopCharactor(displayAnimation: DisplayAnimation) {
        this._tweenList.stop();

        //stop sound
        AudioController.instance._soundBackground.stop();
        AudioController.instance._soundBackground.clip = null;

        //play animation
        switch (displayAnimation) {
            case DisplayAnimation.DIE:
                this.die();
                break;

            case DisplayAnimation.DIE_BY_THORN:
                this.dieByThorn();
                break;
        }
    }

    moveToTarget() {
        //change rigidboy
        this._rigidBodyCharactor.enabled = true;

        //animation
        this.run();

        let listTween: Tween<Readonly<Vec3>>[] = [];

        for (let i = 1; i < this._moveList.length; i++) {
            let loc: Vec2 = new Vec2();
            Vec2.subtract(loc, this._moveList[i], this._moveList[i - 1]);

            let length = loc.length();
            let speed: number = Configs.SPEED * this.node.scale.y * 2;

            let time: number = length / speed;

            let t = tween(this.node.position)
                //xoay huong nhan vat
                .call(() => {
                    if (this._moveList[i].x < this._moveList[i - 1].x) {
                        this.node.scale = new Vec3(Math.abs(this.node.scale.x), this.node.scale.y, this.node.scale.z);
                    }
                    if (this._moveList[i].x > this._moveList[i - 1].x) {
                        this.node.scale = new Vec3(-Math.abs(this.node.scale.x), this.node.scale.y, this.node.scale.z);
                    }
                })
                .to(time, new Vec3(this._moveList[i].x, this._moveList[i].y, 0), {
                    onUpdate: (target: Vec3, ratio: number) => {
                        this.node.position = target;
                    }
                });

            listTween.push(t);
        }

        //play move
        this._tweenList = tween(this.node.position)
            .sequence(...listTween)
            .call(() => {
                this._isFinishMove = true;

                this.node.scale = new Vec3(Math.abs(this.node.scale.x), this.node.scale.y, this.node.scale.z);

                //add charactor to door
                this._chooseDoor.addChild(this.node);

                //disable door to show toilet
                this._chooseDoor.getChildByName("display").active = false;
                this._chooseDoor.getChildByName("Toilet").active = true;
                this._chooseDoor.getChildByName("Toilet").getComponent(Toilet).sitOn();

                //set position for boy sit on toilet
                this.node.worldPosition = find("Toilet/SitPoint", this._chooseDoor).worldPosition;

                //animation
                this.crouch();

                //send event to LevelController to count finish move
                director.emit(Configs.EVENT_MOVE_FINISH);

                //off event
                this.characterCollider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

                //change rigidboy
                this._rigidBodyCharactor.enabled = false;
            });

        this._tweenList.start();
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.node.name.includes("Boy")
            || otherCollider.node.name.includes("Girl")
            || otherCollider.node.name.includes("Bee")
            || otherCollider.node.name.includes("EnemyPurple")
            || otherCollider.node.name.includes("Enemy3Display")) {

            //play sound
            AudioController.instance.onPLaySound(GameSoundDisplay.HIT_ENEMY);

            //change rigidboy
            this._rigidBodyCharactor.enabled = false;

            //off event
            this.characterCollider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

            contact.disabled = true;

            //stop charactor
            this.onEventStopCharactor(DisplayAnimation.DIE);

            //send event to LevelController to show lose UI
            director.emit(Configs.EVENT_HIT_TO_OTHER);
        }
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
        this.characterSkeleton.setAnimation(0, DisplayAnimation.DIE_BY_THORN, false);
    }

    crouch() {
        this.characterSkeleton.setAnimation(0, DisplayAnimation.CROUCH, true);
    }

    update(dt: number) {
        //graphics
        if (this._isTouchArea) {
            let pos = this._camera.convertToUINode(this._NodeFollow.worldPosition, this.node.parent);

            if (Vec2.distance(this._moveList[this._moveList.length - 1], new Vec2(pos.x, pos.y)) > 20) {
                this._Graphics.lineTo(pos.x, pos.y);
                this._Graphics.stroke();
                this._Graphics.moveTo(pos.x, pos.y);
                this._moveList.push(new Vec2(pos.x, pos.y));
            }

            // this._Graphics.lineTo(this._touchArea.position.x, this._touchArea.position.y);
            // this._Graphics.stroke();
            // this._Graphics.moveTo(this._touchArea.position.x, this._touchArea.position.y);
            // this._moveList.push(new Vec2(this._touchArea.position.x, this._touchArea.position.y));

            //scale correct door
            this._doorGroup.children.map(child => {
                if (child.name.includes(this.node.name.split("-")[0])) {
                    let local = this._doorGroup.getComponent(UITransform).convertToNodeSpaceAR(this._NodeFollow.worldPosition);

                    if (child.getComponent(UITransform).getBoundingBox().contains(new Vec2(local.x, local.y))
                        && !child.getComponent(Door)._isChooseDoor) {
                        child.scale = new Vec3(1.2, 1.2, 1.2);

                        this._isTouchArea = false;
                        this._isTouchCorrectDoor = true;

                        this._chooseDoor = child;
                        child.getComponent(Door)._isChooseDoor = true;

                        //stop sound
                        AudioController.instance.stopSound();
                    }
                }
            });
        }

        //check lose game
        let check: Node[] = [];
        this._doorGroup.children.map(child => {
            if (child.name.includes(this.node.name.split("-")[0]) && !child.getComponent(Door)._isChooseDoor) {
                check.push(child);
            }
        });
        if (!this._chooseDoor && check.length == 0) {
            //stop charactor
            this.die();

            //send event to LevelController to show lose UI
            director.emit(Configs.EVENT_HIT_TO_OTHER);

            this.update = () => { };
        }

        //some one has taken the toilet 
        if (!this._isFinishMove && this._chooseDoor?.children.length > 2) {
            //stop charactor
            this.onEventStopCharactor(DisplayAnimation.DIE);

            //send event to LevelController to show lose UI
            director.emit(Configs.EVENT_HIT_TO_OTHER);

            this.update = () => { };
        }
    }

    onDestroy() {
        Tween.stopAll();
        this.unscheduleAllCallbacks();
    }
}

