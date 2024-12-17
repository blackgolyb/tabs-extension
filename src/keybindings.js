import { removeValueIfExist } from "@/utils";
import { ExtEvent } from "./event";

export const CTRL = "CTRL";
export const SHIFT = "SHIFT";
export const ALT = "ALT";
export const META = "META";

export class Keybind {
    constructor() {}

    static fromKeys(keys) {
        const keybind = new Keybind();
        keybind.ctrl = removeValueIfExist(keys, CTRL);
        keybind.shift = removeValueIfExist(keys, SHIFT);
        keybind.alt = removeValueIfExist(keys, ALT);
        keybind.meta = removeValueIfExist(keys, META);
        keybind.key = keys[0];
        return keybind;
    }

    static fromKeyboardEvent(event) {
        const keybind = new Keybind();
        keybind.ctrl = event.ctrlKey;
        keybind.shift = event.shiftKey;
        keybind.alt = event.altKey;
        keybind.meta = event.metaKey;
        keybind.key = event.key;
        return keybind;
    }

    toEvent() {
        return new ExtEvent(this);
    }
    // verifyEvent(event) {
    //     if (this.ctrl !== event.ctrlKey) {
    //         return false;
    //     }
    //     if (this.shift !== event.shiftKey) {
    //         return false;
    //     }
    //     if (this.alt !== event.altKey) {
    //         return false;
    //     }
    //     if (this.meta !== event.metaKey) {
    //         return false;
    //     }
    //     return this.key === event.key;
    // }
}
