import { ExtEvent, BaseEventListenerAdapter } from "./base";

import { removeValueIfExist } from "@/utils";

export const CTRL = "CTRL";
export const SHIFT = "SHIFT";
export const ALT = "ALT";
export const META = "META";

export class KeybingEvent extends ExtEvent {
    constructor(keybind) {
        super(keybind, "KeybingEvent");
    }
}

export class Keybind {
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
        return new KeybingEvent(this);
    }
}

export class KeybindingsListener extends BaseEventListenerAdapter {
    initListener() {
        document.addEventListener("keydown", (e) =>
            this.handleKeyboardEvent(e),
        );
    }

    handleKeyboardEvent(e) {
        const keybind = Keybind.fromKeyboardEvent(e);
        this.emit(keybind.toEvent());
    }
}
