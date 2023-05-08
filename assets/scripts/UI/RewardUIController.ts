import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RewardUIController')
export class RewardUIController extends Component {
    onButtonClaim() {
        this.node.destroy();
    }
}