import { Keybind } from "@/keybindings";

export class ExtEvent {
    constructor(id, tag) {
        this.id = id;
        this.data = null;
        this.tag = tag || null;
    }

    create(data) {
        const event = new ExtEvent(this.id, this.tag);
        event.data = data || null;
        return event;
    }

    hash() {
        return JSON.stringify({ id: this.id, tag: this.tag });
    }
}

export class ModeEvent extends ExtEvent {
    static CHANGE_MODE = "ChangeMode";

    constructor(mode, event) {
        super({ mode, event }, "ModeEvent");
        this.mode = mode;
        this.event = event;
    }
}

export class CommandEvent extends ExtEvent {
    constructor(command) {
        super({ command }, "CommandEvent");
        this.command = command;
    }
}

class BaseEventListenerAdapter {
    constructor() {
        this.eventSubscriber = new Map();
        this.subscribers = [];
        this.initListener();
    }

    initListener() {}

    subscribeEvent(event, callback) {
        const key = event.hash();
        const callbacks = this.eventSubscriber.get(key) || [];
        callbacks.push(callback);
        this.eventSubscriber.set(key, callbacks);
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    emit(event, data) {
        const key = event.hash();
        const eventDirectCallbacks = this.eventSubscriber.get(key) || [];
        const callbacks = this.subscribers.concat(eventDirectCallbacks);
        for (const callback of callbacks) {
            callback(event.create(data));
        }
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

export class CommandListener extends BaseEventListenerAdapter {
    initListener() {
        browser.commands.onCommand.addListener((c) => this.handleCommand(c));
    }

    handleCommand(command) {
        this.emit(new ExtEvent(command));
    }
}

export class EventCompositor extends BaseEventListenerAdapter {
    constructor(modes) {
        super();
        this.currentMode = null;
        this.eventMappings = new Map();

        this.modes = modes;
        if (this.modes === undefined || this.modes?.length < 1) {
            throw new Error("modes must be specified");
        }
        this.initModeChangerSubscribers();
    }

    initModeChangerSubscribers() {
        for (const mode of this.modes) {
            const modeChangeEvent = new ModeEvent(mode, ModeEvent.CHANGE_MODE);
            this.subscribeEvent(modeChangeEvent, () => this.setMode(mode));
        }
    }

    map(mode, event, modeEvent) {
        if (!this.modes.includes(mode)) {
            throw new Error(
                `mode ${mode} is not available. Abaliable mode: ${this.modes}`,
            );
        }
        const key = event.hash();
        const events = this.eventMappings.get(key) || [];
        const target = [mode, modeEvent];
        events.push(target);
        this.eventMappings.set(key, events);
    }

    handleExternalEvent(event) {
        const currentMode = this.currentMode;
        const key = event.hash();
        const mappedEvents = this.eventMappings.get(key) || [];
        for (const [mode, e] of mappedEvents) {
            if (mode === null || mode === currentMode) {
                this.emit(e);
            }
        }
    }

    setMode(mode) {
        this.currentMode = mode;
    }
}
