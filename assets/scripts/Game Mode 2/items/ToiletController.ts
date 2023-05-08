import { _decorator, Component, Node, CCFloat, TiledLayer, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ToiletController')
export class ToiletController extends Component {
    @property({
        type: CCFloat,
        tooltip: "Current col of toilet"
    })
    colToilet: number = 0;
    @property({
        type: CCFloat,
        tooltip: "Current row of toilet"
    })
    rowToilet: number = 0;

    @property({
        type: TiledLayer,
        tooltip: "TiledLayer of map"
    })
    tiledLayer: TiledLayer = null;

    start() {
        Vec3.add(this.node.position, this.tiledLayer.getTiledTileAt(this.colToilet, this.rowToilet, true).node.position, new Vec3(50, 50, 0));
    }

    update(deltaTime: number) {

    }
}


