import { _decorator, Component, Node, sp } from 'cc';
import { DisplayAnimationToilet } from '../utils/Configs';
const { ccclass, property } = _decorator;

@ccclass('Toilet')
export class Toilet extends Component {

    start() {
        //this.ilde();
    }

    ilde() {
        //this.toiletSkeleton.setAnimation(0, DisplayAnimationToilet.IDLE, true);
    }

    sitOn() {
        //this.toiletSkeleton.setAnimation(0, DisplayAnimationToilet.SIT_ON, true);
    }
}

