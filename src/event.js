export class ModeEvent {
    constructor(mode, eventName) {
        this.mode = mode;
        this.eventName = eventName;
    }
}

class BaseListener {
    constructor() {
        this.initListener();
    }

    setup(getCurrentMode, emitEvent) {
        this.getCurrentMode = getCurrentMode;
        this.emitEvent = emitEvent;
    }

    initListener() {}

    map(mode, state, event) {}
}

export class KeybindingsListener extends BaseListener {
    constructor() {
        super();
        this.mappings = [];
    }

    map(mode, keybind, event) {
        this.mappings.push([mode, keybind, event]);
    }

    initListener() {
        document.addEventListener("keydown", (e) =>
            this.handleKeyboardEvent(e),
        );
    }

    handleKeyboardEvent(e) {
        const currentMode = this.getCurrentMode();
        for (const [mode, keybind, event] of this.mappings) {
            if (
                (mode === null || mode === currentMode) &&
                keybind.verifyEvent(e)
            ) {
                this.emitEvent(event);
                e.stopPropagation();
            }
        }
    }
}

export class CommandListener extends BaseListener {
    constructor() {
        super();
        this.mappings = [];
    }

    map(mode, command, event) {
        this.mappings.push([mode, command, event]);
    }

    initListener() {
        browser.commands.onCommand.addListener((c) => this.handleCommand(c));
    }

    handleCommand(c) {
        const currentMode = this.getCurrentMode();
        for (const [mode, command, event] of this.commandMappings) {
            if ((mode === null || mode === currentMode) && command === c) {
                this.emitEvent(event);
            }
        }
    }
}

export class EventManager {
    constructor(listeners) {
        this.currentMode = null;
        this.eventMappings = new Map();
        this.listeners = listeners || [];
    }

    registerListener(listener) {
        listener.setup(
            () => this.currentMode,
            (e) => this.emit(e),
        );
        this.listeners.push(listener);
    }

    subscribe(event, callback) {
        const callbacks = this.eventMappings.get(event) || [];
        callbacks.push(callback);
        this.eventMappings.set(event, callbacks);
    }

    emit(event) {
        console.log("emit", event);
        console.log(this.eventMappings);
        const callbacks = this.eventMappings.get(event) || [];
        for (const callback of callbacks) {
            callback();
        }
    }

    setMode(mode) {
        this.currentMode = mode;
    }
}
