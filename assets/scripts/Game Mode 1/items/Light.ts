import { _decorator, Component, Node, tween, UITransform, Vec2, Vec3 } from 'cc';
import { LevelController } from '../levels/LevelController';
import { AudioController } from '../../controllers/AudioController';
import { GameSoundDisplay } from '../../utils/Configs';
const { ccclass, property } = _decorator;

@ccclass('Light')
export class Light extends Component {
    _boyNode: Node = null;

    _maskNode: Node = null;

    onLoad() {
        this._boyNode = this.node.parent.getChildByName("Boy");
        this._maskNode = this._boyNode.getChildByName("Mask");
    }

    update(deltaTime: number) {
        if (!this.node.parent.getComponent(LevelController)._checkAnimationToPlayFinish) return;

        if (this.node.getComponent(UITransform).getBoundingBox().intersects(this._boyNode.getComponent(UITransform).getBoundingBox())) {
            //play sound
            AudioController.instance.onPLaySound(GameSoundDisplay.LIGHT);

            let tempVec = new Vec3();
            Vec3.multiplyScalar(tempVec, this._boyNode.scale, 15);

            tempVec = new Vec3(Math.abs(tempVec.x), Math.abs(tempVec.y), Math.abs(tempVec.z));

            let scale = new Vec3();
            Vec3.add(scale, this._maskNode.scale, tempVec);

            tween(this._maskNode)
                .to(1, { scale: scale })
                .start();

            this.node.destroy();
        }
    }
}