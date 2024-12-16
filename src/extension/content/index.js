import { CTRL, SHIFT, ALT, META, Keybind } from "@/keybindings";
import { KeybindingsListener, EventManager } from "@/event";
import { keybindings, ModsEvents } from "@/mapping";
import { htmlToNode } from "@/utils";

const extensionHTML = `
<div class="tabs-extension">
    <div class="content">
        <div class="search">
            <input type="text" placeholder="Search..." />
        </div>
        <div class="tabs-list"></div>
    </div>
</div>
`;

const eventManager = new EventManager();
let popupRef;

function hidePopup() {
    popupRef.classList.add("hidden");
}

function showPopup() {
    popupRef.classList.remove("hidden");
}

function initAppWorkflow() {
    const keybindingsListener = new KeybindingsListener();
    for (const [mode, keys, event] of keybindings) {
        keybindingsListener.map(mode, new Keybind(keys), event);
    }
    eventManager.registerListener(keybindingsListener);

    //Init modes switching
    for (const mode of Object.values(ModsEvents)) {
        eventManager.subscribe(mode.ChoseMode, () =>
            eventManager.setMode(mode.ChoseMode.mode),
        );
    }

    eventManager.subscribe(ModsEvents.Close.ChoseMode, hidePopup);
    eventManager.subscribe(ModsEvents.Select.ChoseMode, showPopup);
}

function initPublicApi() {
    window.ExtTabsOpen = () => eventManager.emit(ModsEvents.Select.ChoseMode);
    // window.ExtTabs = {
    //     open: () => eventManager.emit(ModsEvents.Select.ChoseMode),
    //     registerListener: (l) => eventManager.registerListener(l),
    // };
}

function initTabsExtension() {
    initAppWorkflow();
    initPublicApi();
    popupRef = htmlToNode(extensionHTML);
    eventManager.emit(ModsEvents.Close.ChoseMode);
    document.body.appendChild(popupRef);
}

initTabsExtension();
