import { _decorator, Component, Node, tween, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tutorial')
export class Tutorial extends Component {
    @property({
        type: Node,
        tooltip: "hand boy"
    })
    handBoy: Node = null;

    @property({
        type: Node,
        tooltip: "hand girl"
    })
    handGirl: Node = null;

    @property({
        type: Node,
        tooltip: "marks boy"
    })
    marksBoy: Node = null;

    @property({
        type: Node,
        tooltip: "marks girl"
    })
    marksGirl: Node = null;

    onEnable() {
        this.handBoy.worldPosition = this.marksBoy.children[0].worldPosition;
        this.handGirl.worldPosition = this.marksGirl.children[0].worldPosition;

        tween(this.handBoy).sequence(
            tween(this.handBoy).to(2, { worldPosition: this.marksBoy.children[1].worldPosition }, { easing: "cubicInOut" }),

            tween(this.handBoy).delay(0.5),

            tween(this.handBoy).call(() => {
                this.handBoy.worldPosition = this.marksBoy.children[0].worldPosition;
            })
        )
            .repeatForever()
            .start();

        tween(this.handGirl).sequence(
            tween(this.handGirl).to(2, { worldPosition: this.marksGirl.children[1].worldPosition }, { easing: "cubicInOut" }),

            tween(this.handGirl).delay(0.5),

            tween(this.handGirl).call(() => {
                this.handGirl.worldPosition = this.marksGirl.children[0].worldPosition;
            })
        )
            .repeatForever()
            .start();
    }

    onClickBG() {
        Tween.stopAll();
        this.node.destroy();
    }

    onDisable() {
        Tween.stopAll();
    }
}

