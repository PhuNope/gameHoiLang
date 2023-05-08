import { _decorator, Component, director, MouseJoint2D, Node } from 'cc';
import { Configs } from '../utils/Configs';
const { ccclass, property } = _decorator;

@ccclass('MouseJointController')
export class MouseJointController extends Component {
    @property({
        type: MouseJoint2D,
        tooltip: "mouse joint"
    })
    mouseJoint: MouseJoint2D = null;

    onLoad() {
        director.on(Configs.EVENT_ENABLE_MOUSE_JOINT, () => { this.onEnableMouseJoint(); }, this);
        director.on(Configs.EVENT_DISABLE_MOUSE_JOINT, () => { this.onDisableMouseJoint(); }, this);
    }

    onEnableMouseJoint() {
        this.mouseJoint.enabled = true;
    }

    onDisableMouseJoint() {
        this.mouseJoint.enabled = false;
    }
}