import { _decorator, CCFloat, Component, director, find, Node, sp, tween, Tween, UITransform, Vec2, Vec3 } from 'cc';
import { Configs, DisplayAnimation, DisplayAnimationEnemyPurple } from '../../utils/Configs';
import { Charactor } from './Charactor';
const { ccclass, property } = _decorator;

@ccclass('EnemyPurple')
export class EnemyPurple extends Component {
    @property({
        type: sp.Skeleton,
        tooltip: "skeleton of charactor"
    })
    characterSkeleton: sp.Skeleton = null;

    @property({
        type: CCFloat,
        tooltip: "speed of charactor"
    })
    speed = 100;

    _chooseDoor: Node = null;

    _listMarkMove: Node[] = [];

    //tween list
    _tweenList: Tween<Readonly<Vec3>> = null;

    onLoad() {
        this._listMarkMove = this.node.getChildByName("ListMarkMove").children;

        /**
         * Sender: LevelController
         * Purpose: event move to target if all character is finished touch
         */
        director.on(Configs.EVENT_MOVE_TO_TARGET, () => { this.moveToTarget(); }, this);
    }


    start() {
        let doorGroup = find("DoorGroup", this.node.parent);
        doorGroup.children.map(child => {
            if (child.getComponent(UITransform).getBoundingBoxToWorld().contains(new Vec2(this._listMarkMove[this._listMarkMove.length - 1].worldPosition.x, this._listMarkMove[this._listMarkMove.length - 1].worldPosition.y))) {

                this._chooseDoor = child;

                return;
            }
        });
    }

    moveToTarget() {
        //animation
        this.run();

        let tweenListTemp: Tween<Readonly<Vec3>>[] = [];

        let loc: Vec3 = new Vec3();
        Vec3.subtract(loc, this.node.worldPosition, this._listMarkMove[0].worldPosition);

        let length = loc.length();

        let time: number = length / this.speed;

        let that = this;

        let t1 = tween(this.node.worldPosition)
            //xoay huong nhan vat
            .call(() => {
                if (this.node.worldPosition.x < this._listMarkMove[0].worldPosition.x) {
                    this.node.scale = new Vec3(-Math.abs(this.node.scale.x), this.node.scale.y, this.node.scale.z);
                }
                if (this.node.worldPosition.x > this._listMarkMove[0].worldPosition.x) {
                    this.node.scale = new Vec3(Math.abs(this.node.scale.x), this.node.scale.y, this.node.scale.z);
                }
            })

            .to(time, this._listMarkMove[0].worldPosition, {
                onUpdate(target: Vec3, ratio) {
                    that.node.worldPosition = target;
                }
            });

        tweenListTemp.push(t1);

        for (let i = 1; i < this._listMarkMove.length; i++) {
            let locTemp: Vec3 = new Vec3();
            Vec3.subtract(locTemp, this._listMarkMove[i].worldPosition, this._listMarkMove[i - 1].worldPosition);

            let lengthTemp = locTemp.length();

            let timeTemp: number = lengthTemp / this.speed;

            let t = tween(this.node.worldPosition)
                //xoay huong nhan vat
                .call(() => {
                    if (this._listMarkMove[i].worldPosition.x < this._listMarkMove[i - 1].worldPosition.x) {
                        this.node.scale = new Vec3(Math.abs(this.node.scale.x), this.node.scale.y, this.node.scale.z);
                    }
                    if (this._listMarkMove[i].worldPosition.x > this._listMarkMove[i - 1].worldPosition.x) {
                        this.node.scale = new Vec3(-Math.abs(this.node.scale.x), this.node.scale.y, this.node.scale.z);
                    }
                })

                .to(timeTemp, this._listMarkMove[i].worldPosition, {
                    onUpdate(target: Vec3, ratio) {
                        that.node.worldPosition = target;
                    }
                });

            tweenListTemp.push(t);
        }

        //play move
        this._tweenList = tween(this.node.worldPosition)
            .sequence(...tweenListTemp)

            .call(() => {
                this.node.scale = new Vec3(-Math.abs(this.node.scale.x), this.node.scale.y, this.node.scale.z);

                //add charactor to door
                this._chooseDoor.addChild(this.node);
                this.node.worldPosition = this._chooseDoor.worldPosition;

                //disable door to show toilet
                this._chooseDoor.getChildByName("display").active = false;
                this._chooseDoor.getChildByName("toilet").active = true;

                //animation
                this.crouch();
            });

        this._tweenList.start();
    }

    run() {
        this.characterSkeleton.setAnimation(0, DisplayAnimationEnemyPurple.RUN, true);
    }

    idle() {
        this.characterSkeleton.setAnimation(0, DisplayAnimationEnemyPurple.STAND, true);
    }

    die() {
        this.characterSkeleton.setAnimation(0, DisplayAnimationEnemyPurple.DIE, false);
    }

    crouch() {

    }

    update(dt: number) {
        this._chooseDoor.children.map(child => {
            if (child.name.includes("Boy") || child.name.includes("Girl")) {
                this._tweenList.stop();
                this.die();

                this.update = () => { };
            }
        });
    }

    onDestroy() {
        Tween.stopAll();
        this.unscheduleAllCallbacks();
    }
}

