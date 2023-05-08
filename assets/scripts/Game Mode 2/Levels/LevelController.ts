import { _decorator, CCFloat, Component, director, EventTouch, Graphics, Node, TiledLayer, Tween, tween, Vec2, Vec3 } from 'cc';
import { Configs, DirectMove, TypeBlocks } from '../../utils/Configs';
const { ccclass, property } = _decorator;

@ccclass('LevelController')
export class LevelController extends Component {
    @property({
        type: TiledLayer,
        tooltip: "TiledLayer of map",
    })
    tiledLayer: TiledLayer = null;

    @property({
        type: Node,
        tooltip: "PLayer Node",
    })
    playerNode: Node = null;

    @property({
        type: Graphics,
        tooltip: "Graphics of player",
    })
    graphics: Graphics = null;

    @property({
        type: CCFloat,
        tooltip: "Current col of player",
    })
    colPlayer: number = 0;

    @property({
        type: CCFloat,
        tooltip: "Current row of player",
    })
    rowPlayer: number = 0;

    //arrow
    @property({
        type: Node,
        tooltip: "Arrow top of player",
    })
    arrowTop: Node = null;
    @property({
        type: Node,
        tooltip: "Arrow bottom of player",
    })
    arrowBottom: Node = null;
    @property({
        type: Node,
        tooltip: "Arrow left of player",
    })
    arrowLeft: Node = null;
    @property({
        type: Node,
        tooltip: "Arrow right of player",
    })
    arrowRight: Node = null;

    //toilet
    @property({
        type: Node,
        tooltip: "Toilet",
    })
    toilet: Node = null;

    _preNode: Node = null;

    _vecStart: Vec2 = null;

    _arrVec3Graph: Vec3[] = [];

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        //receive event from EnemyController
        this.node.on("hit to enemy", () => { this.onEventHitEnemy(); }, this);
    }

    start() {
        Vec3.add(this.playerNode.position, this.tiledLayer.getTiledTileAt(this.colPlayer, this.rowPlayer, true).node.position, new Vec3(50, 50, 0));

        this.graphics.moveTo(this.playerNode.position.x, this.playerNode.position.y);
        this._arrVec3Graph.push(new Vec3(this.playerNode.position.x, this.playerNode.position.y, this.playerNode.position.z));
        //show arrow
        this.checkShowArrow();
    }

    onTouchStart(event: EventTouch) {
        this._vecStart = event.getUILocation();
    }

    onTouchEnd(event: EventTouch) {
        let vecDirect: Vec2 = event.getUILocation().subtract(this._vecStart);

        let directMove = this.checkDirectMove(vecDirect);
        if (this.checkNodeCanMove(directMove)) {
            this._preNode = this.tiledLayer.getTiledTileAt(this.colPlayer, this.rowPlayer, true).node;

            switch (directMove) {
                case DirectMove.LEFT:
                    this.turnLeft();
                    this.makeMove(this.colPlayer - 1, this.rowPlayer);
                    break;

                case DirectMove.RIGHT:
                    this.turnRight();
                    this.makeMove(this.colPlayer + 1, this.rowPlayer);
                    break;

                case DirectMove.TOP:
                    this.makeMove(this.colPlayer, this.rowPlayer - 1);
                    break;

                case DirectMove.BOT:
                    this.makeMove(this.colPlayer, this.rowPlayer + 1);
                    break;
            }
        }
    }

    turnLeft() {
        this.playerNode.scale = new Vec3(Math.abs(this.playerNode.scale.x), this.playerNode.scale.y, this.playerNode.scale.z);
    }

    turnRight() {
        this.playerNode.scale = new Vec3(-Math.abs(this.playerNode.scale.x), this.playerNode.scale.y, this.playerNode.scale.z);
    }

    checkDirectMove(directVec: Vec2): DirectMove {
        if (directVec.x > 0 && Math.abs(directVec.x) > Math.abs(directVec.y)) return DirectMove.RIGHT;

        if (directVec.x < 0 && Math.abs(directVec.x) > Math.abs(directVec.y)) return DirectMove.LEFT;

        if (directVec.y > 0 && Math.abs(directVec.y) > Math.abs(directVec.x)) return DirectMove.TOP;

        if (directVec.y < 0 && Math.abs(directVec.y) > Math.abs(directVec.x)) return DirectMove.BOT;
    }

    checkNodeCanMove(directMove: DirectMove): boolean {
        switch (this.tiledLayer.getTiledTileAt(this.colPlayer, this.rowPlayer, true).grid) {
            case TypeBlocks.LEFT_TOP:
                if (directMove === DirectMove.LEFT || directMove === DirectMove.TOP) return false;
                return true;

            case TypeBlocks.TOP_RIGHT:
                if (directMove === DirectMove.TOP || directMove === DirectMove.RIGHT) return false;
                return true;

            case TypeBlocks.TOP:
                if (directMove === DirectMove.TOP) return false;
                return true;

            case TypeBlocks.LEFT_BOT:
                if (directMove === DirectMove.LEFT || directMove === DirectMove.BOT) return false;
                return true;

            case TypeBlocks.LEFT:
                if (directMove === DirectMove.LEFT) return false;
                return true;

            case TypeBlocks.RIGHT:
                if (directMove === DirectMove.RIGHT) return false;
                return true;

            case TypeBlocks.BOT:
                if (directMove === DirectMove.BOT) return false;
                return true;

            case TypeBlocks.BOT_RIGHT:
                if (directMove === DirectMove.BOT || directMove === DirectMove.RIGHT) return false;
                return true;

            case TypeBlocks.LEFT_BOT_RIGHT:
                if (directMove === DirectMove.LEFT || directMove === DirectMove.BOT || directMove === DirectMove.RIGHT) return false;
                return true;

            case TypeBlocks.TOP_LEFT_BOT:
                if (directMove === DirectMove.TOP || directMove === DirectMove.LEFT || directMove === DirectMove.BOT) return false;
                return true;

            case TypeBlocks.LEFT_TOP_RIGHT:
                if (directMove === DirectMove.LEFT || directMove === DirectMove.TOP || directMove === DirectMove.RIGHT) return false;
                return true;

            case TypeBlocks.TOP_RIGHT_BOT:
                if (directMove === DirectMove.TOP || directMove === DirectMove.RIGHT || directMove === DirectMove.BOT) return false;
                return true;

            case TypeBlocks.EMPTY:
                return true;

            case TypeBlocks.TOP_BOT:
                if (directMove === DirectMove.TOP || directMove === DirectMove.BOT) return false;
                return true;

            case TypeBlocks.LEFT_RIGHT:
                if (directMove === DirectMove.LEFT || directMove === DirectMove.RIGHT) return false;
                return true;
        }
    }

    makeMove(col: number, row: number) {
        //turn off touch
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        //dont show arrow
        this.arrowBottom.active = false;
        this.arrowTop.active = false;
        this.arrowLeft.active = false;
        this.arrowRight.active = false;

        let pos: Vec3 = new Vec3();
        Vec3.add(pos, this.tiledLayer.getTiledTileAt(col, row, true).node.position, new Vec3(50, 50, 0));
        let that = this;

        //graphics
        if (this._arrVec3Graph[this._arrVec3Graph.length - 2]) {
            if (Vec3.strictEquals(this._arrVec3Graph[this._arrVec3Graph.length - 2], pos)) {
                this._arrVec3Graph.pop();
            }
        }

        tween(this.playerNode.position)
            .to(0.3, pos, {
                onUpdate(target: Vec3, ratio) {
                    that.playerNode.position = target;

                    //graphics      
                    that.graphics.clear();
                    that.graphics.moveTo(that._arrVec3Graph[0].x, that._arrVec3Graph[0].y);
                    for (let i = 0; i < that._arrVec3Graph.length; i++) {
                        that.graphics.lineTo(that._arrVec3Graph[i].x, that._arrVec3Graph[i].y);
                        that.graphics.stroke();
                        that.graphics.moveTo(that._arrVec3Graph[i].x, that._arrVec3Graph[i].y);
                    }

                    that.graphics.lineTo(target.x, target.y);
                    that.graphics.stroke();
                }
            })
            .call(() => {
                //graphics
                this.graphics.moveTo(pos.x, pos.y);

                if (!Vec3.strictEquals(this._arrVec3Graph[this._arrVec3Graph.length - 1], pos)) {
                    this._arrVec3Graph.push(new Vec3(pos.x, pos.y, pos.z));
                }

                this.colPlayer = col;
                this.rowPlayer = row;

                if (this.checkWin()) return;

                if (!this.checkContinueMove()) {
                    //turn on touch
                    this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
                    this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
                    this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

                    //show arrow
                    this.checkShowArrow();
                }
            })
            .start();
    }

    checkContinueMove(): boolean {
        let checkNodeLeft: Node = null;
        let checkNodeTop: Node = null;
        let checkNodeRight: Node = null;
        let checkNodeBot: Node = null;

        switch (this.tiledLayer.getTiledTileAt(this.colPlayer, this.rowPlayer, true).grid) {
            case TypeBlocks.LEFT_TOP:
                checkNodeBot = this.tiledLayer.getTiledTileAt(this.colPlayer, this.rowPlayer + 1, true).node;
                if (this._preNode === checkNodeBot) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colPlayer, this.rowPlayer, true).node;
                    //move to right
                    this.turnRight();
                    this.makeMove(this.colPlayer + 1, this.rowPlayer);
                } else {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colPlayer, this.rowPlayer, true).node;
                    //move to bot
                    this.makeMove(this.colPlayer, this.rowPlayer + 1);
                }

                return true;

            case TypeBlocks.TOP_RIGHT:
                checkNodeBot = this.tiledLayer.getTiledTileAt(this.colPlayer, this.rowPlayer + 1, true).node;
                if (this._preNode === checkNodeBot) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colPlayer, this.rowPlayer, true).node;
                    //move to left
                    this.turnLeft();
                    this.makeMove(this.colPlayer - 1, this.rowPlayer);
                } else {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colPlayer, this.rowPlayer, true).node;
                    //move to bot
                    this.makeMove(this.colPlayer, this.rowPlayer + 1);
                }

                return true;

            case TypeBlocks.LEFT_BOT:
                checkNodeRight = this.tiledLayer.getTiledTileAt(this.colPlayer + 1, this.rowPlayer, true).node;
                if (this._preNode === checkNodeRight) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colPlayer, this.rowPlayer, true).node;
                    //move to top
                    this.makeMove(this.colPlayer, this.rowPlayer - 1);
                } else {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colPlayer, this.rowPlayer, true).node;
                    //move to right
                    this.turnRight();
                    this.makeMove(this.colPlayer + 1, this.rowPlayer);
                }

                return true;

            case TypeBlocks.BOT_RIGHT:
                checkNodeLeft = this.tiledLayer.getTiledTileAt(this.colPlayer - 1, this.rowPlayer, true).node;
                if (this._preNode === checkNodeLeft) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colPlayer, this.rowPlayer, true).node;
                    //move to top
                    this.makeMove(this.colPlayer, this.rowPlayer - 1);
                } else {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colPlayer, this.rowPlayer, true).node;
                    //move to left
                    this.turnLeft();
                    this.makeMove(this.colPlayer - 1, this.rowPlayer);
                }

                return true;

            case TypeBlocks.TOP_BOT:
                checkNodeLeft = this.tiledLayer.getTiledTileAt(this.colPlayer - 1, this.rowPlayer, true).node;
                if (this._preNode === checkNodeLeft) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colPlayer, this.rowPlayer, true).node;
                    //move to right
                    this.turnRight();
                    this.makeMove(this.colPlayer + 1, this.rowPlayer);
                } else {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colPlayer, this.rowPlayer, true).node;
                    //move to left
                    this.turnLeft();
                    this.makeMove(this.colPlayer - 1, this.rowPlayer);
                }

                return true;

            case TypeBlocks.LEFT_RIGHT:
                checkNodeTop = this.tiledLayer.getTiledTileAt(this.colPlayer, this.rowPlayer - 1, true).node;
                if (this._preNode === checkNodeTop) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colPlayer, this.rowPlayer, true).node;
                    //move to bot
                    this.makeMove(this.colPlayer, this.rowPlayer + 1);
                } else {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colPlayer, this.rowPlayer, true).node;
                    //move to top
                    this.makeMove(this.colPlayer, this.rowPlayer - 1);
                }

                return true;

            default:
                return false;
        }
    }

    checkShowArrow() {
        switch (this.tiledLayer.getTiledTileAt(this.colPlayer, this.rowPlayer, true).grid) {
            case TypeBlocks.LEFT_TOP:
                this.arrowBottom.active = true;
                this.arrowLeft.active = false;
                this.arrowTop.active = false;
                this.arrowRight.active = false;
                break;

            case TypeBlocks.TOP_RIGHT:
                this.arrowBottom.active = true;
                this.arrowLeft.active = true;
                this.arrowTop.active = false;
                this.arrowRight.active = false;
                break;

            case TypeBlocks.TOP:
                this.arrowBottom.active = true;
                this.arrowLeft.active = true;
                this.arrowTop.active = false;
                this.arrowRight.active = true;
                break;

            case TypeBlocks.LEFT_BOT:
                this.arrowBottom.active = false;
                this.arrowLeft.active = false;
                this.arrowTop.active = true;
                this.arrowRight.active = true;
                break;

            case TypeBlocks.LEFT:
                this.arrowBottom.active = true;
                this.arrowLeft.active = false;
                this.arrowTop.active = true;
                this.arrowRight.active = true;
                break;

            case TypeBlocks.RIGHT:
                this.arrowBottom.active = true;
                this.arrowLeft.active = true;
                this.arrowTop.active = true;
                this.arrowRight.active = false;
                break;

            case TypeBlocks.BOT:
                this.arrowBottom.active = false;
                this.arrowLeft.active = true;
                this.arrowTop.active = true;
                this.arrowRight.active = true;
                break;

            case TypeBlocks.BOT_RIGHT:
                this.arrowBottom.active = false;
                this.arrowLeft.active = true;
                this.arrowTop.active = true;
                this.arrowRight.active = false;
                break;

            case TypeBlocks.LEFT_BOT_RIGHT:
                this.arrowBottom.active = false;
                this.arrowLeft.active = false;
                this.arrowTop.active = true;
                this.arrowRight.active = false;
                break;

            case TypeBlocks.TOP_LEFT_BOT:
                this.arrowBottom.active = false;
                this.arrowLeft.active = false;
                this.arrowTop.active = false;
                this.arrowRight.active = true;
                break;

            case TypeBlocks.LEFT_TOP_RIGHT:
                this.arrowBottom.active = true;
                this.arrowLeft.active = false;
                this.arrowTop.active = false;
                this.arrowRight.active = false;
                break;

            case TypeBlocks.TOP_RIGHT_BOT:
                this.arrowBottom.active = false;
                this.arrowLeft.active = true;
                this.arrowTop.active = false;
                this.arrowRight.active = false;
                break;

            case TypeBlocks.EMPTY:
                this.arrowBottom.active = true;
                this.arrowLeft.active = true;
                this.arrowTop.active = true;
                this.arrowRight.active = true;
                break;

            case TypeBlocks.TOP_BOT:
                this.arrowBottom.active = false;
                this.arrowLeft.active = true;
                this.arrowTop.active = false;
                this.arrowRight.active = true;
                break;

            case TypeBlocks.LEFT_RIGHT:
                this.arrowBottom.active = true;
                this.arrowLeft.active = false;
                this.arrowTop.active = true;
                this.arrowRight.active = false;
                break;
        }
    }

    checkWin() {
        if (Vec3.strictEquals(this.playerNode.position, this.toilet.position)) {
            //dont show arrow
            this.arrowBottom.active = false;
            this.arrowLeft.active = false;
            this.arrowTop.active = false;
            this.arrowRight.active = false;

            //send event to EnemyController to stop
            director.emit(Configs.EVENT_PLAYER_GOAL);

            //send event to GameController to show win UI
            this.scheduleOnce(() => {
                this.node.emit(Configs.EVENT_WIN_LEVEL);
            }, 0.5);

            return true;
        }
        return false;
    }

    onEventHitEnemy() {
        Tween.stopAll();

        //turn off touch
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        //send event to GameController to show lose UI
        this.scheduleOnce(() => {
            this.node.emit(Configs.EVENT_LOSE_LEVEL);
        }, 0.5);
    }

    onDestroy() {
        Tween.stopAll();
        this.unscheduleAllCallbacks();
    }
}