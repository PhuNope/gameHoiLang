import { _decorator, Component, Node, tween, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tutorial')
export class Tutorial extends Component {
    @property({
        type: Node,
        tooltip: "Hand"
    })
    hand: Node = null;

    @property({
        type: Node,
        tooltip: "Group marks"
    })
    marks: Node = null;

    _tweenNode: Tween<Node> = null;

    start() {

    }

    onEnable() {
        this.hand.worldPosition = this.marks.children[0].worldPosition;
        this._tweenNode = tween(this.hand).sequence(
            tween(this.hand).to(2, { worldPosition: this.marks.children[1].worldPosition }, { easing: "cubicInOut" }),

            tween(this.hand).delay(0.5),

            tween(this.hand).call(() => {
                this.hand.worldPosition = this.marks.children[0].worldPosition;
            })
        )
            .repeatForever()
            .start();
    }

    onDisable() {
        if (this._tweenNode) {
            this._tweenNode.stop();
        }
    }
}

