export class ModeEvent {
    constructor(mode, eventName) {
        this.mode = mode;
        this.eventName = eventName;
    }
}

export class EventManager {
    constructor() {
        this.currentMode = null;
        this.eventMappings = new Map();
        this.mappings = [];
        this.initKeyListener();
    }

    initKeyListener() {
        document.addEventListener("keydown", (e) => this.keyListener(e));
    }

    subscribe(event, callback) {
        const callbacks = this.eventMappings.get(event) || [];
        callbacks.push(callback);
        this.eventMappings.set(event, callbacks);
    }

    map(mode, keybind, event) {
        this.mappings.push([mode, keybind, event]);
    }

    emit(event) {
        const callbacks = this.eventMappings.get(event) || [];
        for (const callback of callbacks) {
            callback();
        }
    }

    setMode(mode) {
        this.currentMode = mode;
    }

    keyListener(e) {
        const currentMode = this.currentMode;
        for (const [mode, keybind, event] of this.mappings) {
            if (
                (mode === null || mode === currentMode) &&
                keybind.verifyEvent(e)
            ) {
                this.emit(event);
                e.stopPropagation();
            }
        }
    }
}
