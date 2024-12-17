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

export class BaseEventListenerAdapter {
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
