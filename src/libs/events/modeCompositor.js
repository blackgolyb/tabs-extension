import { ExtEvent, BaseEventListenerAdapter } from "./base";

export class ModeEvent extends ExtEvent {
    static CHANGE_MODE = "ChangeMode";

    constructor(mode, event) {
        super({ mode, event }, "ModeEvent");
        this.mode = mode;
        this.event = event;
    }
}

export class ModeEventCompositor extends BaseEventListenerAdapter {
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
