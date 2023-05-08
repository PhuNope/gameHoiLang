import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Fbsdk')
export class Fbsdk extends Component {
    public static instance: Fbsdk;
    public FBInstant;

    public base64Pic: string = '';

    public dataFb = {
        fbId: '',
        sender: '',
        photoURL: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=224663823283303&gaming_photo_type=unified_picture&ext=1683369405&hash=AeQucHmFCBqTcYnLT9o',
    };

    start() {
        //set base64 image
        this.getBase64ByURL((base64Image) => {
            this.base64Pic = base64Image;
        });

        if (Fbsdk.instance == null) {
            Fbsdk.instance = this;
            director.addPersistRootNode(this.node);

            this.FBInstant = (typeof FBInstant !== 'undefined') ? FBInstant : null;

            // this.getLocaleManual((data) => {
            //     let startIndex = data.search('loc');
            //     let loc = data.substring(startIndex + 4, startIndex + 6).toLowerCase();
            //     //convert from location to language
            //     var countryCode = loc;
            //     var lang = 'en';
            //     if (countryCode == null || countryCode == undefined || countryCode.length == 0 || countryCode == 'undefined') {
            //         countryCode = 'us';
            //     }
            //     if (countryCode == 'vn') {
            //         lang = 'vi';
            //     }

            //     this.dataFb.locale = countryCode;
            // });

            if (this.FBInstant == null) {
                return;
            }
            console.log(this.FBInstant.player.getPhoto());
            this.dataFb.fbId = this.FBInstant.player.getID();
            this.dataFb.sender = this.FBInstant.player.getName();
            this.dataFb.photoURL = this.FBInstant.player.getPhoto();
        }
    }

    getBase64ByURL(func: CallableFunction) {
        var imageUrl = 'https://i.imgur.com/QgbPVrR.png'; // Thay thế bằng đường dẫn URL thực tế của hình ảnh

        // Tải dữ liệu hình ảnh từ URL
        var xhr = new XMLHttpRequest();
        xhr.open('GET', imageUrl, true);
        xhr.responseType = 'blob';

        xhr.onload = function () {
            if (xhr.status === 200) {
                // Tạo một đối tượng FileReader để đọc dữ liệu hình ảnh dưới dạng chuỗi base64
                var reader = new FileReader();

                reader.onloadend = function () {
                    // Lấy chuỗi base64 của hình ảnh
                    var base64Image = reader.result;

                    //console.log("Chuỗi base64 của hình ảnh:", base64Image);

                    func(base64Image);
                };

                // Đọc dữ liệu hình ảnh dưới dạng chuỗi base64
                reader.readAsDataURL(xhr.response);

            } else {
                console.error('Lỗi khi tải dữ liệu hình ảnh:', xhr.statusText);
            }
        };

        xhr.onerror = function () {
            console.error('Lỗi khi tải dữ liệu hình ảnh');
        };

        xhr.send();
    }

    shareGame() {
        if (this.FBInstant == null) return;

        this.FBInstant.inviteAsync({
            image: this.base64Pic,
            text: {
                default: `${this.dataFb.sender} just invited you play the game!`,
                localizations: {
                    vi_VN: `${this.dataFb.sender} đã mời bạn chơi trò chơi!`,
                    en_US: `${this.dataFb.sender} just invited you play the game!`,
                }
            },
            data: { myReplayData: '...' }
        }).then(function () {
            // continue with the game.
        });
    }
}

