import { BaseEventListenerAdapter, ExtEvent } from "./base";

export const Direction = {
    Send: "Send",
    Receive: "Receive",
};
export const ProxyResponse = {
    Ok: "Ok",
};

export class ActiveTabEventProxy extends BaseEventListenerAdapter {
    constructor(direction) {
        super();
        this.initProxy(direction);
    }

    initProxy(direction) {
        if (direction === Direction.Send) {
        } else if (direction === Direction.Receive) {
            this.initReceive();
        } else {
            throw new Error("Unsupported Direction");
        }
    }

    initReceive() {
        browser.runtime.onMessage.addListener((event) => {
            console.log("get event form bg", event);
            this.emit(ExtEvent.recover(event));
            return Promise.resolve(ProxyResponse.Ok);
        });
    }

    async sendEventToReceiver(event) {
        const tabs = await browser.tabs.query({
            active: true,
            currentWindow: true,
        });
        const activeTab = tabs[0];
        const r = await browser.tabs.sendMessage(activeTab.id, event);
        console.log(event);
        if (r !== ProxyResponse.Ok) {
            throw new Error("failed to get response");
        }
    }

    handleExternalEvent(event) {
        this.sendEventToReceiver(event);
    }
}
