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

    static recover(data) {
        const event = new ExtEvent(data.id, data.tag);
        event.data = data.data || null;
        return event;
    }

    hash() {
        return JSON.stringify({ id: this.id, tag: this.tag });
    }
}

class BaseStorage {
    init() {}
    subscribeEvent(event, callback) {}
    subscribe(callback) {}
    get_callbacks(event) {}
}

class MultiStorage extends BaseStorage {
    init() {
        this.eventSubscriber = new Map();
        this.subscribers = [];
    }

    subscribeEvent(event, callback) {
        const key = event.hash();
        const callbacks = this.eventSubscriber.get(key) || [];
        callbacks.push(callback);
        this.eventSubscriber.set(key, callbacks);
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    get_callbacks(event) {
        const key = event.hash();
        const eventDirectCallbacks = this.eventSubscriber.get(key) || [];
        return this.subscribers.concat(eventDirectCallbacks);
    }
}

class SingleStorage extends BaseStorage {
    init() {
        this.subscriber = undefined;
    }

    subscribeEvent(event, callback) {
        throw new Error("subscribeEvent is Unsupported");
    }

    subscribe(callback) {
        this.subscriber = callback;
    }

    get_callbacks(event) {
        if (this.subscriber) {
            return [this.subscriber];
        }
        return [];
    }
}

export class BaseEventListenerAdapter {
    static STORAGES = {
        multi: MultiStorage,
        single: SingleStorage,
    };
    static DEFAULT_STORAGE = "multi";

    constructor(storage) {
        this.initListener();
        this.initStorage(storage);
    }

    initListener() {}

    storage_fabric(storage) {
        if (storage === undefined) {
            storage = BaseEventListenerAdapter.DEFAULT_STORAGE;
        }
        if (typeof storage === "string") {
            if (storage in BaseEventListenerAdapter.STORAGES) {
                return new BaseEventListenerAdapter.STORAGES[storage]();
            }
            throw new Error(`No storage found by this name: ${storage}`);
        }
        return storage;
    }

    initStorage(storage) {
        this.storage = this.storage_fabric(storage);
        this.storage.init();
    }

    subscribeEvent(event, callback) {
        return this.storage.subscribeEvent(event, callback);
    }

    subscribe(callback) {
        return this.storage.subscribe(callback);
    }

    emit(event, data) {
        const callbacks = this.storage.get_callbacks(event);
        for (const callback of callbacks) {
            callback(event.create(data));
        }
    }
}
