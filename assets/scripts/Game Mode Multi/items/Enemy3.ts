import { _decorator, CCFloat, Collider2D, Component, Contact2DType, director, ERigidBody2DType, find, IPhysics2DContact, Node, RigidBody2D, sp, tween, Tween, Vec3 } from 'cc';
import { Configs, DisplayAnimationEnemy3 } from '../../utils/Configs';
import { GameData } from '../../utils/GameData';
const { ccclass, property } = _decorator;

@ccclass('Enemy3')
export class Enemy3 extends Component {
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

    _listMarkMove: Node[] = [];

    _display: Node = null;

    onLoad() {
        this._listMarkMove = this.node.getChildByName("ListMarkMove").children;
        this._display = this.node.getChildByName("Enemy3Display");
    }


    start() {
        //check first in game to move charactor
        // if (!GameData.instance.FirstInGame
        //     || !find("tutorial", this.node.parent)) {

        //     this.moveToTarget();
        // }
        // else {
        //     this.idle();
        // }        

        this.scheduleOnce(() => {
            this.moveToTarget();
        }, 0.3);
    }

    moveToTarget() {
        //animation
        this.run();

        let listTween: Tween<Readonly<Vec3>>[] = [];

        let that = this;

        for (let i = 1; i < this._listMarkMove.length; i++) {
            let locTemp: Vec3 = new Vec3();
            Vec3.subtract(locTemp, this._listMarkMove[i - 1].worldPosition, this._listMarkMove[i].worldPosition);

            let lengthTemp = locTemp.length();

            let timeTemp: number = lengthTemp / this.speed;

            let t = tween(this._display.worldPosition)
                //xoay huong nhan vat
                .call(() => {
                    //turn right
                    if (this._listMarkMove[i - 1].worldPosition.x > this._listMarkMove[i].worldPosition.x) {
                        this._display.scale = new Vec3(-Math.abs(this._display.scale.x), this._display.scale.y, this._display.scale.z);
                    }
                    //turn left
                    if (this._listMarkMove[i - 1].worldPosition.x < this._listMarkMove[i].worldPosition.x) {
                        this._display.scale = new Vec3(Math.abs(this._display.scale.x), this._display.scale.y, this._display.scale.z);
                    }
                })

                .to(timeTemp, this._listMarkMove[i].worldPosition, {
                    onUpdate(target: Vec3, ratio) {
                        that._display.worldPosition = target;
                    },
                });

            listTween.push(t);
        }

        let loc: Vec3 = new Vec3();
        Vec3.subtract(loc, this._listMarkMove[this._listMarkMove.length - 1].worldPosition, this._listMarkMove[0].worldPosition);

        let length = loc.length();

        let time: number = length / this.speed;

        let t = tween(this._display.worldPosition)
            //xoay huong nhan vat
            .call(() => {
                //turn right
                if (this._listMarkMove[this._listMarkMove.length - 1].worldPosition.x > this._listMarkMove[0].worldPosition.x) {
                    this._display.scale = new Vec3(-Math.abs(this._display.scale.x), this._display.scale.y, this._display.scale.z);
                }
                //turn left
                if (this._listMarkMove[this._listMarkMove.length - 1].worldPosition.x < this._listMarkMove[0].worldPosition.x) {
                    this._display.scale = new Vec3(Math.abs(this._display.scale.x), this._display.scale.y, this._display.scale.z);
                }
            })

            .to(time, this._listMarkMove[0].worldPosition, {
                onUpdate(target: Vec3, ratio) {
                    that._display.worldPosition = target;
                },
            });

        listTween.push(t);

        tween(this._display.worldPosition)
            .sequence(...listTween)
            .repeatForever()
            .start();
    }

    run() {
        this.characterSkeleton.setAnimation(0, DisplayAnimationEnemy3.RUN, true);
    }

    idle() {
        this.characterSkeleton.setAnimation(0, DisplayAnimationEnemy3.STAND, true);
    }

    //add to tutorial as button
    onClickTutorial() {
        this.moveToTarget();
    }

    onDestroy() {
        Tween.stopAllByTarget(this._display);
        this.unscheduleAllCallbacks();
    }
}

