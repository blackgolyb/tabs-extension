import { ModeEventCompositor } from "@/libs/events/modeCompositor";
import { Keybind, KeybindingsListener } from "@/libs/events/keybindings";
import { CommandEvent } from "@/libs/events/browserCommands";
import { modes } from "@/core/modes";
import { ModsEvents } from "@/core/events";
import { keybindings, commands } from "@/core/mappings";
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

const mainEventProvider = new ModeEventCompositor(modes);
const keybindingsListener = new KeybindingsListener();
keybindingsListener.subscribe((e) => mainEventProvider.handleExternalEvent(e));
let popupRef;

function hidePopup() {
    popupRef.classList.add("hidden");
}

function showPopup() {
    popupRef.classList.remove("hidden");
}

function initAppWorkflow() {
    for (const [mode, keys, event] of keybindings) {
        mainEventProvider.map(mode, Keybind.fromKeys(keys).toEvent(), event);
    }
    for (const [mode, command, event] of commands) {
        mainEventProvider.map(mode, new CommandEvent(command), event);
    }

    mainEventProvider.subscribeEvent(ModsEvents.Close.ChoseMode, hidePopup);
    mainEventProvider.subscribeEvent(ModsEvents.Select.ChoseMode, showPopup);
}

function initPublicEventApi() {
    window.ExtTabsOpen = () =>
        mainEventProvider.emit(ModsEvents.Select.ChoseMode);
    window.ExtTabsRegisterExternalListener = (l) =>
        l.subscribe((e) => mainEventProvider.handleExternalEvent(e));
}

function initTabsExtension() {
    initAppWorkflow();
    initPublicEventApi();
    popupRef = htmlToNode(extensionHTML);
    mainEventProvider.emit(ModsEvents.Close.ChoseMode);
    document.body.appendChild(popupRef);
}

initTabsExtension();
