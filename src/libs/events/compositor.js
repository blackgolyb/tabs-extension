export class CompoiteEvent extends ExtEvent {
    constructor(event) {
        super(event, "CompoiteEvent");
    }
}

export class EventCompositor extends BaseEventListenerAdapter {
    constructor() {
        super();
        this.eventMappings = new Map();
    }

    map(event, modeEvent) {
        const key = event.hash();
        const events = this.eventMappings.get(key) || [];
        events.push(modeEvent);
        this.eventMappings.set(key, events);
    }

    handleExternalEvent(event) {
        const key = event.hash();
        const mappedEvents = this.eventMappings.get(key) || [];
        for (const e of mappedEvents) {
            this.emit(e);
        }
    }
}
