enum StatusItem {
    SELECTED,
    NOT_SELECTED,
    NOT_BUY,
    COMMING_SOON
}

class Configs {
    //scene name
    public static GAME_SCENE_NAME = "game";
    public static MENU_SCENE_NAME = "menu";

    //name storage
    public static KEY_STORAGE_MAX_MAIN_LEVEL = "MaxMainLevel";
    public static KEY_STORAGE_CURRENT_MAIN_LEVEL = "CurrentMainLevel";

    public static KEY_STORAGE_MAX_LEVEL_MODE_SINGLE = "MaxLevelModeSingle";
    public static KEY_STORAGE_MAX_LEVEL_MODE_MULTI = "MaxLevelModeMulti";

    public static KEY_STORAGE_CURRENT_LEVEL_MODE_SINGLE = "CurrentLevelModeSingle";
    public static KEY_STORAGE_CURRENT_LEVEL_MODE_MULTI = "CurrentLevelModeMulti";

    public static KEY_STORAGE_MONEY = "Money";

    public static KEY_STORAGE_SOUND_STATUS = "SoundStatus";
    public static KEY_STORAGE_MUSIC_STATUS = "MusicStatus";

    public static KEY_STORAGE_SKIN_DATA = "skin data";

    //animation
    public static SPEED = 800;
    public static HALF_WIDTH = 720 / 2;
    public static HALF_HEIGHT = 1600 / 2;

    //measure
    public static HALF_PLAYER_HEIGHT = 171 / 2;
    public static WIDTH_CHARACTOR = 70;

    //name event
    public static EVENT_NEXT_LEVEL = "nextLevel";
    public static EVENT_LOSE_LEVEL = "loseLevel";
    public static EVENT_WIN_LEVEL = "winLevel";
    public static EVENT_RESET_LEVEL = "resetLevel";
    public static EVENT_MOVE_TO_TARGET = "moveToTarget";
    public static EVENT_SELECTED_GROUND = "selectedGround";
    public static EVENT_PLAYER_GOAL = "player goal";
    public static EVENT_STOP_PLAYER = "stop player";
    public static EVENT_OFF_EVENT_TOUCH = "off event touch";
    public static EVENT_TAP_TO_PLAY = "tap to play";
    public static EVENT_UPDATE_PROGRESS_LEVEL = "update progress level";
    public static EVENT_UPDATE_PROGRESS_REWARD_LEVEL = "update progress reward level";
    public static EVENT_ENABLE_RIGIDBODY_CART = "enable rigidbody cart";
    public static EVENT_CHOOSE_DOOR = "choose door";
    public static EVENT_MOVE_FINISH = "move finish";
    public static EVENT_HIT_TO_OTHER = "hit to other";
    //event mouse joint
    public static EVENT_ENABLE_MOUSE_JOINT = "enable mouse joint";
    public static EVENT_DISABLE_MOUSE_JOINT = "disable mouse joint";

    //data skin
    public static SkinData = [
        {
            name: "NAM",
            type: "Boy",
            price: 50,
            status: `${StatusItem.SELECTED.toString()}`
        },

        {
            name: "NU",
            type: "Girl",
            price: 50,
            status: `${StatusItem.SELECTED.toString()}`
        },

        {
            name: "NAM",
            type: "Boy",
            price: 50,
            status: `${StatusItem.NOT_SELECTED.toString()}`
        },

        {
            name: "NU",
            type: "Girl",
            price: 50,
            status: `${StatusItem.NOT_BUY.toString()}`
        },

        {
            name: "",
            type: "",
            price: "",
            status: `${StatusItem.COMMING_SOON.toString()}`
        },

        {
            name: "",
            type: "",
            price: "",
            status: `${StatusItem.COMMING_SOON.toString()}`
        },

        {
            name: "",
            type: "",
            price: "",
            status: `${StatusItem.COMMING_SOON.toString()}`
        }
    ];
}

enum DisplayAnimation {
    STAND = "dung",
    RUN = "chay",
    DIE = "nga",
    DIE_BY_THORN = "nga",
    CROUCH = "vo tay",
    BOOM = "Boom"
}

enum DisplayAnimationTrap {
    DEFAULT = "animation",
    GAP = "gap"
}

enum DisplayAnimationEnemyPurple {
    RUN = "chay",
    DIE = "chet",
    STAND = "dung"
}

enum DisplayAnimationEnemy3 {
    RUN = "chay",
    STAND = "dung"
}

enum DisplayAnimationToilet {
    IDLE = "dung",
    SIT_ON = "ngoi len"
}

enum GameStatus {
    PLAYING,
    MOVING,
    END
}

enum GameMusicStatus {
    ON,
    OFF
}

enum GameSoundStatus {
    ON,
    OFF
}

enum GameMusicDisplay {
    BACKGROUND,
    BACKGROUND_SINGLE = "audios/BG_ModeSingle",
    BACKGROUND_MULTI = "audios/BG_ModeMulti",
    WINLEVEL = "audios/OnWin",
    FAILLEVEL = "audios/fail-level",
    FLUSH = ""
}

enum GameSoundDisplay {
    BUTTON,
    MOVE,
    HIT_TOILET,
    ITEM,
    DRAWING,
    PAPER,
    CART,
    HIT_ENEMY,
    LIGHT,
    LETS_GO
}

enum CharactorType {
    RED = "RED",
    BLUE = "BLUE",
    PURPLE = "PURPLE",
    YELLOW = "YELLOW",
    PINK = "PINK",
    GREEN = "GREEN",
    ORANGE = "ORANGE"
}

enum TypeBlocks {
    LEFT_TOP = 1,
    TOP_RIGHT = 2,
    TOP = 3,
    LEFT_BOT = 4,
    LEFT = 5,
    RIGHT = 6,
    BOT = 7,
    BOT_RIGHT = 8,
    LEFT_BOT_RIGHT = 9,
    TOP_LEFT_BOT = 10,
    LEFT_TOP_RIGHT = 11,
    TOP_RIGHT_BOT = 12,
    EMPTY = 13,
    TOP_BOT = 14,
    LEFT_RIGHT = 15
}

enum DirectMove {
    LEFT,
    RIGHT,
    TOP,
    BOT
}

enum GameMode {
    SINGLE = "prefabs/Game Mode 1/Level ",
    MULTI = "prefabs/Game Mode Multi/Level ",
    MODE2 = "prefabs/Game Mode 2/Level "
}

export { Configs, DisplayAnimation, GameStatus, GameMusicStatus, GameSoundStatus, GameMusicDisplay, GameSoundDisplay, CharactorType, TypeBlocks, DirectMove, GameMode, DisplayAnimationTrap, DisplayAnimationEnemyPurple, DisplayAnimationEnemy3, DisplayAnimationToilet, StatusItem };