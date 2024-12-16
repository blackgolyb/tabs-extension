import { removeValueIfExist } from "./utils";

export const CTRL = "CTRL";
export const SHIFT = "SHIFT";
export const ALT = "ALT";
export const META = "META";

export class Keybind {
    constructor(keys) {
        this.initKeybind(keys);
    }

    initKeybind(keys) {
        this.ctrl = removeValueIfExist(keys, CTRL);
        this.shift = removeValueIfExist(keys, SHIFT);
        this.alt = removeValueIfExist(keys, ALT);
        this.meta = removeValueIfExist(keys, META);
        this.key = keys[0];
    }

    verifyEvent(event) {
        if (this.ctrl !== event.ctrlKey) {
            return false;
        }
        if (this.shift !== event.shiftKey) {
            return false;
        }
        if (this.alt !== event.altKey) {
            return false;
        }
        if (this.meta !== event.metaKey) {
            return false;
        }
        return this.key === event.key;
    }
}
