import { _decorator, Camera, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraLevel')
export class CameraLevel extends Component {
    setOrthoHeightCamera(orthoHeight: number) {
        this.node.getComponent(Camera).orthoHeight = orthoHeight;
    }
}