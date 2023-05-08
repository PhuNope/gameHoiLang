import { _decorator, Component, Node, RigidBody2D, UITransform, Vec2, Vec3, director, Collider2D, IPhysics2DContact, Contact2DType } from 'cc';
import { Configs, GameSoundDisplay } from '../../utils/Configs';
import { Character } from './Character';
import { AudioController } from '../../controllers/AudioController';
const { ccclass, property } = _decorator;

@ccclass('Cart')
export class Cart extends Component {
    check: boolean = false;

    _powerForce: number = 5000;

    start() {
        let collider = this.node.getComponent(Collider2D);

        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        //receive event from LevelController to enable onBeginContact
        director.on(Configs.EVENT_ENABLE_RIGIDBODY_CART, () => {
            this.check = false;
        }, this);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this.check) return;

        if (otherCollider.node.name.includes("Boy")) {
            //play sound
            AudioController.instance.onPLaySound(GameSoundDisplay.CART);

            this.check = true;

            //animation boy
            otherCollider.node.getComponent(Character).idle();

            //send event to LevelController to stop Boy
            director.emit(Configs.EVENT_STOP_PLAYER);

            let dirVec: Vec3 = new Vec3();

            Vec3.subtract(dirVec, this.node.position, otherCollider.node.position);
            dirVec.normalize().multiplyScalar(this._powerForce);

            let rigidBody = this.node.getComponent(RigidBody2D);
            rigidBody.applyForce(new Vec2(dirVec.x, dirVec.y), new Vec2(this.node.worldPosition.x, this.node.worldPosition.y), true);
        }
    }
}