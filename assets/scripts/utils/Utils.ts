import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Utils')
export class Utils {
    public static Log(str1,str2=null,str3=null){
        console.log(str1,str2,str3);
    }
}


