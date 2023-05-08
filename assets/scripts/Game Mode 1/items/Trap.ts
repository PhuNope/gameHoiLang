import { _decorator, Component, director, Node, UITransform, Vec2, sp } from 'cc';
import { Configs, DisplayAnimation, DisplayAnimationTrap } from '../../utils/Configs';
import { Character } from './Character';
import { LevelController } from '../levels/LevelController';
const { ccclass, property } = _decorator;

@ccclass('Trap')
export class Trap extends Component {
    //charactor boy in level
    _boyNode: Node = null;

    onLoad() {
        this._boyNode = this.node.parent.getChildByName("Boy");

        this.node.getComponent(sp.Skeleton).setAnimation(0, DisplayAnimationTrap.GAP, true);
    }

    update(deltaTime: number) {
        if (!this.node.parent.getComponent(LevelController)._checkAnimationToPlayFinish) return;

        if (this.node.getComponent(UITransform).getBoundingBox().intersects(this._boyNode.getComponent(UITransform).getBoundingBox())) {
            //animation
            this.node.getComponent(sp.Skeleton).setAnimation(0, DisplayAnimationTrap.DEFAULT, false);
            this._boyNode.getComponent(Character).dieByThorn();

            //send event to LevelController to stop boy
            director.emit(Configs.EVENT_STOP_PLAYER);

            //send event to LevelController to off event touch boy
            director.emit(Configs.EVENT_OFF_EVENT_TOUCH);

            //set lose game
            this.scheduleOnce(() => {
                this.node.parent.emit(Configs.EVENT_LOSE_LEVEL);
            }, 1);

            //reset update
            this.update = () => { };
        }
    }
}