import { _decorator, Component, Node, sp, Sprite, SpriteFrame, Label, find } from 'cc';
import { Configs, DisplayAnimation, GameSoundDisplay, StatusItem } from '../utils/Configs';
import { GameData } from '../utils/GameData';
import { PlayerSave } from '../utils/PlayerSave';
import { AudioController } from '../controllers/AudioController';
const { ccclass, property } = _decorator;

@ccclass('ItemShopCharactor')
export class ItemShopCharactor extends Component {
    @property({
        type: SpriteFrame,
        tooltip: "list of status bg: 0 is selected, 1 is default, 2 is coming soon"
    })
    listBg: SpriteFrame[] = [];

    @property({
        type: Node,
        tooltip: "bg of item"
    })
    bg: Node = null;

    @property({
        type: sp.Skeleton,
        tooltip: "skeleton of item"
    })
    itemSkeleton: sp.Skeleton = null;

    @property({
        type: Node,
        tooltip: "price of item"
    })
    price: Node = null;

    @property({
        type: Node,
        tooltip: "Purchase of item"
    })
    purchase: Node = null;

    _name: string = "";
    _type: string = "";
    _price: number = 50;
    _status: string = "";

    _buyConfirm: Node = null;

    //from ShopController
    _getItemSelected(itemNode: Node) { };

    start() {
        this.node.on(Node.EventType.TOUCH_START, this.onCLickItem, this);
    }

    SetUp(obj: any) {
        switch (obj.status) {
            case StatusItem.SELECTED.toString():
                this._name = obj.name;
                this.itemSkeleton.setSkin(obj.name);

                this._type = obj.type;
                this.itemSkeleton.setAnimation(0, DisplayAnimation.STAND, false);
                this.itemSkeleton.paused = true;

                this._price = Number(obj.price);
                this._status = obj.status;
                this.bg.getComponent(Sprite).spriteFrame = this.listBg[0];
                this.price.active = false;
                this.purchase.active = false;

                break;

            case StatusItem.NOT_SELECTED.toString():
                this._name = obj.name;
                this.itemSkeleton.setSkin(obj.name);

                this._type = obj.type;
                this.itemSkeleton.setAnimation(0, DisplayAnimation.STAND, false);
                this.itemSkeleton.paused = true;

                this._price = Number(obj.price);
                this._status = obj.status;
                this.bg.getComponent(Sprite).spriteFrame = this.listBg[1];
                this.purchase.active = true;
                this.price.active = false;

                break;

            case StatusItem.NOT_BUY.toString():
                this._name = obj.name;
                this.itemSkeleton.setSkin(obj.name);

                this._type = obj.type;
                this.itemSkeleton.setAnimation(0, DisplayAnimation.STAND, false);
                this.itemSkeleton.paused = true;

                this._price = Number(obj.price);
                this.price.getChildByName("Label").getComponent(Label).string = obj.price;
                this._status = obj.status;
                this.bg.getComponent(Sprite).spriteFrame = this.listBg[1];
                this.purchase.active = false;
                this.price.active = true;

                break;

            case StatusItem.COMMING_SOON.toString():
                this.bg.getComponent(Sprite).spriteFrame = this.listBg[2];
                this._status = obj.status;
                this.purchase.active = false;
                this.price.active = false;
                this.itemSkeleton.node.active = false;

                break;
        }
    }

    setItemDisplay(status: StatusItem) {
        switch (status.toString()) {
            case StatusItem.SELECTED.toString():
                this.bg.getComponent(Sprite).spriteFrame = this.listBg[0];
                this.price.active = false;
                this.purchase.active = false;

                this._status = status.toString();

                break;

            case StatusItem.NOT_SELECTED.toString():
                this.bg.getComponent(Sprite).spriteFrame = this.listBg[1];
                this.price.active = false;
                this.purchase.active = true;

                this._status = status.toString();

                break;
        }
    }

    onCLickItem() {
        //audio
        AudioController.instance.onPLaySound(GameSoundDisplay.BUTTON);

        switch (this._status) {
            case StatusItem.SELECTED.toString():

                break;

            case StatusItem.NOT_SELECTED.toString():
                //change data save
                if (this._type == "Boy") {
                    //unset current skin boy
                    GameData.instance.SkinData.find(value => value.name == GameData.instance.BoySkin).status = StatusItem.NOT_SELECTED.toString();

                    //set new skin boy
                    GameData.instance.BoySkin = this._name;
                }
                if (this._type == "Girl") {
                    //unset current skin girl
                    GameData.instance.SkinData.find(value => value.name == GameData.instance.GirlSkin).status = StatusItem.NOT_SELECTED.toString();

                    //set new skin girl
                    GameData.instance.GirlSkin = this._name;
                }
                GameData.instance.SkinData.find(value => value.name == this._name).status = StatusItem.SELECTED.toString();

                //find current selected item
                let item = this.node.parent.children.find(value => {
                    let script = value.getComponent(ItemShopCharactor);

                    return script._status == StatusItem.SELECTED.toString() && script._type == this._type;
                });

                item.getComponent(ItemShopCharactor).setItemDisplay(StatusItem.NOT_SELECTED);

                this.setItemDisplay(StatusItem.SELECTED);

                //save data
                PlayerSave.saveDataStorage(Configs.KEY_STORAGE_SKIN_DATA, JSON.stringify(GameData.instance.SkinData));

                break;

            case StatusItem.NOT_BUY.toString():
                this.showBuyConfirm();
                this._getItemSelected(this.node);

                break;

            case StatusItem.COMMING_SOON.toString():

                break;
        }
    }

    showBuyConfirm() {
        //audio
        AudioController.instance.onPLaySound(GameSoundDisplay.BUTTON);

        find("board/charactor", this._buyConfirm).getComponent(sp.Skeleton).setSkin(this._name);
        find("board/charactor", this._buyConfirm).getComponent(sp.Skeleton).setAnimation(0, DisplayAnimation.STAND, false);
        find("board/charactor", this._buyConfirm).getComponent(sp.Skeleton).paused = true;
        find("board/boardConfirm/Label", this._buyConfirm).getComponent(Label).string = `-${this._price.toString()}`;

        if (this._price > GameData.instance.money) {
            find("board/boardConfirm/Confirm", this._buyConfirm).getComponent(Label).string = "NOT ENOUGH";
        }
        if (this._price <= GameData.instance.money) {
            find("board/boardConfirm/Confirm", this._buyConfirm).getComponent(Label).string = "CONFIRM";
        }

        this._buyConfirm.active = true;
    }
}