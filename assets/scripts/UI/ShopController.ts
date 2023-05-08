import { _decorator, Component, Node, Prefab, Label, instantiate, director, UITransform, find, sp } from 'cc';
import { GameData } from '../utils/GameData';
import { ItemShopCharactor } from '../items/ItemShopCharactor';
import { Configs, GameSoundDisplay, StatusItem } from '../utils/Configs';
import { AudioController } from '../controllers/AudioController';
import { PlayerSave } from '../utils/PlayerSave';
const { ccclass, property } = _decorator;

@ccclass('ShopController')
export class ShopController extends Component {
    @property({
        type: Prefab,
        tooltip: "Prefab of itemCharactor"
    })
    itemCharactorPrefab: Prefab = null;

    @property({
        type: Node,
        tooltip: "Ground itemCharactor"
    })
    groundItemCharactor: Node = null;

    @property({
        type: Label,
        tooltip: "Label of money"
    })
    moneyLabel: Label = null;

    @property({
        type: Node,
        tooltip: "Buy Confirm"
    })
    buyConfirm: Node = null;

    _itemSelected: Node = null;

    onLoad() {
        this.buyConfirm.active = false;
    }

    start() {
        this.moneyLabel.string = GameData.instance.money.toString();

        this.setItemCharactor();
    }

    setItemCharactor() {
        for (let i = 0; i < GameData.instance.SkinData.length; i++) {
            let itemCharactor = instantiate(this.itemCharactorPrefab);
            this.groundItemCharactor.addChild(itemCharactor);

            itemCharactor.getComponent(ItemShopCharactor).SetUp(GameData.instance.SkinData[i]);
            itemCharactor.getComponent(ItemShopCharactor)._buyConfirm = this.buyConfirm;
            itemCharactor.getComponent(ItemShopCharactor)._getItemSelected = (item: Node) => { this.getItemSelected(item); };
        }

        let height = (GameData.instance.SkinData.length / 3 + 1) * (269 + 10);
        this.groundItemCharactor.getComponent(UITransform).height = height;
    }

    getItemSelected(item: Node) {
        this._itemSelected = item;
    }

    //add to button
    onBackButton() {
        //audio
        AudioController.instance.onPLaySound(GameSoundDisplay.BUTTON);

        this.node.destroy();

        director.loadScene(Configs.GAME_SCENE_NAME);
    }

    //add to button
    onClickExitBuyConfirm() {
        //audio
        AudioController.instance.onPLaySound(GameSoundDisplay.BUTTON);

        this.buyConfirm.active = false;
    }

    //on click confirm
    onClickConfirm() {
        //audio
        AudioController.instance.onPLaySound(GameSoundDisplay.BUTTON);

        if (this._itemSelected.getComponent(ItemShopCharactor)._price > GameData.instance.money) {
            return;
        }
        if (this._itemSelected.getComponent(ItemShopCharactor)._price <= GameData.instance.money) {
            this.buyConfirm.active = false;

            //change data save
            GameData.instance.money -= this._itemSelected.getComponent(ItemShopCharactor)._price;

            //change money display
            this.moneyLabel.string = GameData.instance.money.toString();

            this._itemSelected.getComponent(ItemShopCharactor).setItemDisplay(StatusItem.NOT_SELECTED);

            GameData.instance.SkinData.find(value => value.name == this._itemSelected.getComponent(ItemShopCharactor)._name).status = StatusItem.NOT_SELECTED.toString();

            //save data
            PlayerSave.saveDataStorage(Configs.KEY_STORAGE_SKIN_DATA, JSON.stringify(GameData.instance.SkinData));
            PlayerSave.saveDataStorage(Configs.KEY_STORAGE_MONEY, GameData.instance.money);
        }
    }
}

