import { _decorator, CCFloat, Component, director, Node, randomRangeInt, TiledLayer, Tween, tween, UITransform, Vec3 } from 'cc';
import { Configs, TypeBlocks } from '../../utils/Configs';
const { ccclass, property } = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {
    @property({
        type: CCFloat,
        tooltip: "Current col of enemy",
    })
    colEnemy: number = 0;
    @property({
        type: CCFloat,
        tooltip: "Current row of enemy",
    })
    rowEnemy: number = 0;

    @property(TiledLayer)
    tiledLayer: TiledLayer = null;

    @property({
        type: UITransform,
        tooltip: "UITransform of player",
    })
    playerUITransform: UITransform = null;

    _preNode: Node = null;

    onLoad() {
        //receive event from GameController when player goal
        director.on(Configs.EVENT_PLAYER_GOAL, () => { Tween.stopAll(); }, this);
    }

    start() {
        Vec3.add(this.node.position, this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node.position, new Vec3(50, 50, 0));

        this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;
        //this.makeMove(this.col, this.row + 1);
        this.scheduleOnce(() => {
            this.checkContinueMove();
        }, 0.1);
    }

    makeMove(col: number, row: number) {
        let pos: Vec3 = new Vec3();
        Vec3.add(pos, this.tiledLayer.getTiledTileAt(col, row, true).node.position, new Vec3(50, 50, 0));
        let that = this;

        tween(this.node.position)
            .to(0.5, pos, {
                onUpdate(target: Vec3, ratio) {
                    that.node.position = target;
                },
            })
            .call(() => {
                this.colEnemy = col;
                this.rowEnemy = row;

                this.checkContinueMove();
            })
            .start();
    }

    checkContinueMove() {
        let checkNodeLeft: Node = null;
        let checkNodeTop: Node = null;
        let checkNodeRight: Node = null;
        let checkNodeBot: Node = null;

        switch (this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).grid) {
            case TypeBlocks.LEFT_TOP:
                checkNodeBot = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy + 1, true).node;
                checkNodeRight = this.tiledLayer.getTiledTileAt(this.colEnemy + 1, this.rowEnemy, true).node;
                if (this._preNode === checkNodeBot) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;
                    //move to right
                    this.makeMove(this.colEnemy + 1, this.rowEnemy);
                    return;
                }

                if (this._preNode === checkNodeRight) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;
                    //move to bot
                    this.makeMove(this.colEnemy, this.rowEnemy + 1);
                    return;
                }

                if (this._preNode === this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node) {
                    let randomLeftTop = randomRangeInt(1, 3);

                    if (randomLeftTop === 1) {
                        //move to right
                        this.makeMove(this.colEnemy + 1, this.rowEnemy);
                    }
                    if (randomLeftTop === 2) {
                        //move to bot
                        this.makeMove(this.colEnemy, this.rowEnemy + 1);
                    }
                }

                break;

            case TypeBlocks.TOP_RIGHT:
                checkNodeBot = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy + 1, true).node;
                checkNodeLeft = this.tiledLayer.getTiledTileAt(this.colEnemy - 1, this.rowEnemy, true).node;
                if (this._preNode === checkNodeBot) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;
                    //move to left
                    this.makeMove(this.colEnemy - 1, this.rowEnemy);
                    return;
                }

                if (this._preNode === checkNodeLeft) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;
                    //move to bot
                    this.makeMove(this.colEnemy, this.rowEnemy + 1);
                    return;
                }

                if (this._preNode === this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node) {
                    let randomTopRight = randomRangeInt(1, 3);

                    if (randomTopRight === 1) {
                        //move to left
                        this.makeMove(this.colEnemy - 1, this.rowEnemy);
                    }
                    if (randomTopRight === 2) {
                        //move to bot
                        this.makeMove(this.colEnemy, this.rowEnemy + 1);
                    }
                }

                break;

            case TypeBlocks.TOP:
                checkNodeBot = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy + 1, true).node;
                checkNodeLeft = this.tiledLayer.getTiledTileAt(this.colEnemy - 1, this.rowEnemy, true).node;
                checkNodeRight = this.tiledLayer.getTiledTileAt(this.colEnemy + 1, this.rowEnemy, true).node;

                if (this._preNode === checkNodeBot) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;

                    let random = randomRangeInt(1, 3);

                    //move to left
                    if (random === 1) {
                        this.makeMove(this.colEnemy - 1, this.rowEnemy);
                    }
                    //move to right
                    if (random === 2) {
                        this.makeMove(this.colEnemy + 1, this.rowEnemy);
                    }
                    return;
                }

                if (this._preNode === checkNodeLeft) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;

                    let random = randomRangeInt(1, 3);

                    //move to bot
                    if (random === 1) {
                        this.makeMove(this.colEnemy, this.rowEnemy + 1);
                    }
                    //move to right
                    if (random === 2) {
                        this.makeMove(this.colEnemy + 1, this.rowEnemy);
                    }
                    return;
                }

                if (this._preNode === checkNodeRight) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;

                    let random = randomRangeInt(1, 3);

                    //move to bot
                    if (random === 1) {
                        this.makeMove(this.colEnemy, this.rowEnemy + 1);
                    }
                    //move to left
                    if (random === 2) {
                        this.makeMove(this.colEnemy - 1, this.rowEnemy);
                    }
                    return;
                }

                if (this._preNode === this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node) {
                    let randomTop = randomRangeInt(1, 4);

                    //move to bot
                    if (randomTop === 1) {
                        this.makeMove(this.colEnemy, this.rowEnemy + 1);
                    }
                    //move to left
                    if (randomTop === 2) {
                        this.makeMove(this.colEnemy - 1, this.rowEnemy);
                    }
                    //move to right
                    if (randomTop === 3) {
                        this.makeMove(this.colEnemy + 1, this.rowEnemy);

                    }
                }

                break;

            case TypeBlocks.LEFT_BOT:
                checkNodeRight = this.tiledLayer.getTiledTileAt(this.colEnemy + 1, this.rowEnemy, true).node;
                checkNodeTop = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy - 1, true).node;
                if (this._preNode === checkNodeRight) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;
                    //move to top
                    this.makeMove(this.colEnemy, this.rowEnemy - 1);
                    return;
                }

                if (this._preNode === checkNodeTop) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;
                    //move to right
                    this.makeMove(this.colEnemy + 1, this.rowEnemy);
                    return;
                }

                if (this._preNode === this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node) {
                    let randomLeftBot = randomRangeInt(1, 3);

                    if (randomLeftBot === 1) {
                        //move to top
                        this.makeMove(this.colEnemy, this.rowEnemy - 1);
                    }
                    if (randomLeftBot === 2) {
                        //move to right
                        this.makeMove(this.colEnemy + 1, this.rowEnemy);
                    }
                }

                break;

            case TypeBlocks.LEFT:
                checkNodeRight = this.tiledLayer.getTiledTileAt(this.colEnemy + 1, this.rowEnemy, true).node;
                checkNodeTop = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy - 1, true).node;
                checkNodeBot = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy + 1, true).node;

                if (this._preNode === checkNodeRight) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;

                    let random = randomRangeInt(1, 3);

                    //move to top
                    if (random === 1) {
                        this.makeMove(this.colEnemy, this.rowEnemy - 1);
                    }
                    //move to bot
                    if (random === 2) {
                        this.makeMove(this.colEnemy, this.rowEnemy + 1);
                    }
                    return;
                }

                if (this._preNode === checkNodeTop) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;

                    let random = randomRangeInt(1, 3);

                    //move to right
                    if (random === 1) {
                        this.makeMove(this.colEnemy + 1, this.rowEnemy);
                    }
                    //move to bot
                    if (random === 2) {
                        this.makeMove(this.colEnemy, this.rowEnemy + 1);
                    }
                    return;
                }

                if (this._preNode === checkNodeBot) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;

                    let random = randomRangeInt(1, 3);

                    //move to right
                    if (random === 1) {
                        this.makeMove(this.colEnemy + 1, this.rowEnemy);
                    }
                    //move to top
                    if (random === 2) {
                        this.makeMove(this.colEnemy, this.rowEnemy - 1);
                    }
                    return;
                }

                if (this._preNode === this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node) {
                    let randomLeft = randomRangeInt(1, 4);

                    //move to top
                    if (randomLeft === 1) {
                        this.makeMove(this.colEnemy, this.rowEnemy - 1);
                    }
                    //move to right
                    if (randomLeft === 2) {
                        this.makeMove(this.colEnemy + 1, this.rowEnemy);
                    }
                    //move to bot
                    if (randomLeft === 3) {
                        this.makeMove(this.colEnemy, this.rowEnemy + 1);
                    }
                }

                break;

            case TypeBlocks.RIGHT:
                checkNodeLeft = this.tiledLayer.getTiledTileAt(this.colEnemy - 1, this.rowEnemy, true).node;
                checkNodeTop = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy - 1, true).node;
                checkNodeBot = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy + 1, true).node;

                if (this._preNode === checkNodeLeft) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;

                    let random = randomRangeInt(1, 3);

                    //move to top
                    if (random === 1) {
                        this.makeMove(this.colEnemy, this.rowEnemy - 1);
                    }
                    //move to bot
                    if (random === 2) {
                        this.makeMove(this.colEnemy, this.rowEnemy + 1);
                    }
                    return;
                }

                if (this._preNode === checkNodeTop) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;

                    let random = randomRangeInt(1, 3);

                    //move to left
                    if (random === 1) {
                        this.makeMove(this.colEnemy - 1, this.rowEnemy);
                    }
                    //move to bot
                    if (random === 2) {
                        this.makeMove(this.colEnemy, this.rowEnemy + 1);
                    }
                    return;
                }

                if (this._preNode === checkNodeBot) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;

                    let random = randomRangeInt(1, 3);

                    //move to left
                    if (random === 1) {
                        this.makeMove(this.colEnemy - 1, this.rowEnemy);
                    }
                    //move to top
                    if (random === 2) {
                        this.makeMove(this.colEnemy, this.rowEnemy - 1);
                    }
                    return;
                }

                if (this._preNode === this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node) {
                    let randomRight = randomRangeInt(1, 4);

                    //move to top
                    if (randomRight === 1) {
                        this.makeMove(this.colEnemy, this.rowEnemy - 1);
                    }
                    //move to left
                    if (randomRight === 2) {
                        this.makeMove(this.colEnemy - 1, this.rowEnemy);
                    }
                    //move to bot
                    if (randomRight === 3) {
                        this.makeMove(this.colEnemy, this.rowEnemy + 1);
                    }
                }

                break;

            case TypeBlocks.BOT:
                checkNodeLeft = this.tiledLayer.getTiledTileAt(this.colEnemy - 1, this.rowEnemy, true).node;
                checkNodeTop = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy - 1, true).node;
                checkNodeRight = this.tiledLayer.getTiledTileAt(this.colEnemy + 1, this.rowEnemy, true).node;

                if (this._preNode === checkNodeLeft) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;

                    let random = randomRangeInt(1, 3);

                    //move to top
                    if (random === 1) {
                        this.makeMove(this.colEnemy, this.rowEnemy - 1);
                    }
                    //move to right
                    if (random === 2) {
                        this.makeMove(this.colEnemy + 1, this.rowEnemy);
                    }
                    return;
                }

                if (this._preNode === checkNodeTop) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;

                    let random = randomRangeInt(1, 3);

                    //move to left
                    if (random === 1) {
                        this.makeMove(this.colEnemy - 1, this.rowEnemy);
                    }
                    //move to right
                    if (random === 2) {
                        this.makeMove(this.colEnemy + 1, this.rowEnemy);
                    }
                    return;
                }

                if (this._preNode === checkNodeRight) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;

                    let random = randomRangeInt(1, 3);

                    //move to left
                    if (random === 1) {
                        this.makeMove(this.colEnemy - 1, this.rowEnemy);
                    }
                    //move to top
                    if (random === 2) {
                        this.makeMove(this.colEnemy, this.rowEnemy - 1);
                    }
                    return;
                }

                if (this._preNode === this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node) {
                    let randomRight = randomRangeInt(1, 4);

                    //move to top
                    if (randomRight === 1) {
                        this.makeMove(this.colEnemy, this.rowEnemy - 1);
                    }
                    //move to left
                    if (randomRight === 2) {
                        this.makeMove(this.colEnemy - 1, this.rowEnemy);
                    }
                    //move to right
                    if (randomRight === 3) {
                        this.makeMove(this.colEnemy + 1, this.rowEnemy);
                    }
                }

                break;

            case TypeBlocks.BOT_RIGHT:
                checkNodeLeft = this.tiledLayer.getTiledTileAt(this.colEnemy - 1, this.rowEnemy, true).node;
                checkNodeTop = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy - 1, true).node;
                if (this._preNode === checkNodeLeft) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;
                    //move to top
                    this.makeMove(this.colEnemy, this.rowEnemy - 1);
                    return;
                }

                if (this._preNode === checkNodeTop) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;
                    //move to left
                    this.makeMove(this.colEnemy - 1, this.rowEnemy);
                    return;
                }

                if (this._preNode === this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node) {
                    let randomBotRight = randomRangeInt(1, 3);

                    if (randomBotRight === 1) {
                        //move to top
                        this.makeMove(this.colEnemy, this.rowEnemy - 1);
                    }
                    if (randomBotRight === 2) {
                        //move to left
                        this.makeMove(this.colEnemy - 1, this.rowEnemy);
                    }
                }

                break;

            case TypeBlocks.LEFT_BOT_RIGHT:
                this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;
                //move to top
                this.makeMove(this.colEnemy, this.rowEnemy - 1);

                break;

            case TypeBlocks.TOP_LEFT_BOT:
                this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;
                //move to right
                this.makeMove(this.colEnemy + 1, this.rowEnemy);

                break;

            case TypeBlocks.LEFT_TOP_RIGHT:
                this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;
                //move to bot
                this.makeMove(this.colEnemy, this.rowEnemy + 1);

                break;

            case TypeBlocks.TOP_RIGHT_BOT:
                this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;
                //move to left
                this.makeMove(this.colEnemy - 1, this.rowEnemy);

                break;

            case TypeBlocks.EMPTY:
                checkNodeLeft = this.tiledLayer.getTiledTileAt(this.colEnemy - 1, this.rowEnemy, true).node;
                checkNodeTop = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy - 1, true).node;
                checkNodeBot = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy + 1, true).node;
                checkNodeRight = this.tiledLayer.getTiledTileAt(this.colEnemy + 1, this.rowEnemy, true).node;

                if (this._preNode === checkNodeLeft) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;

                    let random = randomRangeInt(1, 4);

                    //move to top
                    if (random === 1) {
                        this.makeMove(this.colEnemy, this.rowEnemy - 1);
                    }
                    //move to bot
                    if (random === 2) {
                        this.makeMove(this.colEnemy, this.rowEnemy + 1);
                    }
                    //move to right
                    if (random === 3) {
                        this.makeMove(this.colEnemy + 1, this.rowEnemy);
                    }
                    return;
                }

                if (this._preNode === checkNodeTop) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;

                    let random = randomRangeInt(1, 4);

                    //move to left
                    if (random === 1) {
                        this.makeMove(this.colEnemy - 1, this.rowEnemy);
                    }
                    //move to bot
                    if (random === 2) {
                        this.makeMove(this.colEnemy, this.rowEnemy + 1);
                    }
                    //move to right
                    if (random === 3) {
                        this.makeMove(this.colEnemy + 1, this.rowEnemy);
                    }
                    return;
                }

                if (this._preNode === checkNodeBot) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;

                    let random = randomRangeInt(1, 4);

                    //move to left
                    if (random === 1) {
                        this.makeMove(this.colEnemy - 1, this.rowEnemy);
                    }
                    //move to top
                    if (random === 2) {
                        this.makeMove(this.colEnemy, this.rowEnemy - 1);
                    }
                    //move to right
                    if (random === 3) {
                        this.makeMove(this.colEnemy + 1, this.rowEnemy);
                    }
                    return;
                }

                if (this._preNode === checkNodeRight) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;

                    let random = randomRangeInt(1, 4);

                    //move to left
                    if (random === 1) {
                        this.makeMove(this.colEnemy - 1, this.rowEnemy);
                    }
                    //move to top
                    if (random === 2) {
                        this.makeMove(this.colEnemy, this.rowEnemy - 1);
                    }
                    //move to bot
                    if (random === 3) {
                        this.makeMove(this.colEnemy, this.rowEnemy + 1);
                    }
                    return;
                }

                if (this._preNode === this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node) {
                    let randomRight = randomRangeInt(1, 5);

                    //move to top
                    if (randomRight === 1) {
                        this.makeMove(this.colEnemy, this.rowEnemy - 1);
                    }
                    //move to left
                    if (randomRight === 2) {
                        this.makeMove(this.colEnemy - 1, this.rowEnemy);
                    }
                    //move to bot
                    if (randomRight === 3) {
                        this.makeMove(this.colEnemy, this.rowEnemy + 1);
                    }
                    //move to right
                    if (randomRight === 4) {
                        this.makeMove(this.colEnemy + 1, this.rowEnemy);
                    }
                }

                break;

            case TypeBlocks.TOP_BOT:
                checkNodeLeft = this.tiledLayer.getTiledTileAt(this.colEnemy - 1, this.rowEnemy, true).node;
                checkNodeRight = this.tiledLayer.getTiledTileAt(this.colEnemy + 1, this.rowEnemy, true).node;
                if (this._preNode === checkNodeLeft) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;
                    //move to right
                    this.makeMove(this.colEnemy + 1, this.rowEnemy);
                    return;
                }

                if (this._preNode === checkNodeRight) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;
                    //move to left
                    this.makeMove(this.colEnemy - 1, this.rowEnemy);
                    return;
                }

                if (this._preNode === this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node) {
                    let randomTopBot = randomRangeInt(1, 3);

                    if (randomTopBot === 1) {
                        //move to right
                        this.makeMove(this.colEnemy + 1, this.rowEnemy);
                    }
                    if (randomTopBot === 2) {
                        //move to left
                        this.makeMove(this.colEnemy - 1, this.rowEnemy);
                    }
                }

                break;

            case TypeBlocks.LEFT_RIGHT:
                checkNodeTop = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy - 1, true).node;
                checkNodeBot = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy + 1, true).node;
                if (this._preNode === checkNodeTop) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;
                    //move to bot
                    this.makeMove(this.colEnemy, this.rowEnemy + 1);
                    return;
                }

                if (this._preNode === checkNodeBot) {
                    this._preNode = this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node;
                    //move to top
                    this.makeMove(this.colEnemy, this.rowEnemy - 1);
                    return;
                }

                if (this._preNode === this.tiledLayer.getTiledTileAt(this.colEnemy, this.rowEnemy, true).node) {
                    let randomLeftRight = randomRangeInt(1, 3);

                    if (randomLeftRight === 1) {
                        //move to bot
                        this.makeMove(this.colEnemy, this.rowEnemy + 1);
                    }
                    if (randomLeftRight === 2) {
                        //move to top
                        this.makeMove(this.colEnemy, this.rowEnemy - 1);
                    }
                }

                break;
        }
    }

    update(dt: number) {
        let boundingBox = this.node.getComponent(UITransform).getBoundingBox();
        if (boundingBox.intersects(this.playerUITransform.getBoundingBox())) {
            Tween.stopAll();

            //send event to LevelController to stop player
            this.playerUITransform.node.parent.parent.emit("hit to enemy");

            this.update = () => { };
        }
    }

    onDestroy() {
        Tween.stopAll();
        this.unscheduleAllCallbacks();
    }
}