import { Keybind } from "@/keybindings";
import { KeybindingsListener, EventCompositor, ExtEvent } from "@/event";
import { keybindings, commands, ModsEvents, modes } from "@/mapping";
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

const eventManager = new EventCompositor(modes);
const keybindingsListener = new KeybindingsListener();
keybindingsListener.subscribe((e) => eventManager.handleExternalEvent(e));
let popupRef;

function hidePopup() {
    popupRef.classList.add("hidden");
}

function showPopup() {
    popupRef.classList.remove("hidden");
}

function initAppWorkflow() {
    for (const [mode, keys, event] of keybindings) {
        eventManager.map(mode, Keybind.fromKeys(keys).toEvent(), event);
    }
    for (const [mode, command, event] of commands) {
        eventManager.map(mode, new ExtEvent(command), event);
    }

    eventManager.subscribeEvent(ModsEvents.Close.ChoseMode, hidePopup);
    eventManager.subscribeEvent(ModsEvents.Select.ChoseMode, showPopup);
}

function initPublicEventApi() {
    window.ExtTabsOpen = () => eventManager.emit(ModsEvents.Select.ChoseMode);
    window.ExtTabsRegisterExternalListener = (l) =>
        l.subscribe((e) => eventManager.handleExternalEvent(e));
}

function initTabsExtension() {
    initAppWorkflow();
    initPublicEventApi();
    popupRef = htmlToNode(extensionHTML);
    eventManager.emit(ModsEvents.Close.ChoseMode);
    document.body.appendChild(popupRef);
}

initTabsExtension();
