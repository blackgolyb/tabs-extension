import { CTRL, SHIFT, ALT, META, Keybind } from "./keybindings";
import { ModeEvent, EventManager } from "./event";
import { htmlToNode } from "./utils";

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

const Modes = {
    Close: "Close",
    Select: "Select",
    Search: "Search",
    SearchSelect: "SearchSelect",
};

const ModsEvents = {
    Close: {
        ChoseMode: new ModeEvent(Modes.Close, "ChoseMode"),
    },
    Select: {
        ChoseMode: new ModeEvent(Modes.Select, "ChoseMode"),
        NextTab: new ModeEvent(Modes.Select, "NextTab"),
        PrevTab: new ModeEvent(Modes.Select, "PrevTab"),
    },
    Search: {
        ChoseMode: new ModeEvent(Modes.Search, "ChoseMode"),
    },
    SearchSelect: {
        ChoseMode: new ModeEvent(Modes.SearchSelect, "ChoseMode"),
        NextTab: new ModeEvent(Modes.SearchSelect, "NextTab"),
        PrevTab: new ModeEvent(Modes.SearchSelect, "PrevTab"),
    },
};

const eventManager = new EventManager();
let popupRef;
const keybindings = [
    [Modes.Close, [CTRL, " "], ModsEvents.Select.ChoseMode],
    //Select mode
    [Modes.Select, ["Escape"], ModsEvents.Close.ChoseMode],
    [Modes.Select, ["f"], ModsEvents.Search.ChoseMode],
    [Modes.Select, ["j"], ModsEvents.Select.NextTab],
    [Modes.Select, ["k"], ModsEvents.Select.PrevTab],
    //Search mode
    [Modes.Search, ["Escape"], ModsEvents.Select.ChoseMode],
    [Modes.Search, ["Enter"], ModsEvents.SearchSelect.ChoseMode],
    //SearchSelect mode
    [Modes.SearchSelect, ["Escape"], ModsEvents.Select.ChoseMode],
    [Modes.SearchSelect, ["f"], ModsEvents.Search.ChoseMode],
    [Modes.SearchSelect, ["j"], ModsEvents.SearchSelect.NextTab],
    [Modes.SearchSelect, ["k"], ModsEvents.SearchSelect.PrevTab],
];

function initAppWorkflow() {
    for (const [mode, keys, event] of keybindings) {
        eventManager.map(mode, new Keybind(keys), event);
    }

    //Init modes switching
    for (const mode of Object.values(ModsEvents)) {
        eventManager.subscribe(mode.ChoseMode, () =>
            eventManager.setMode(mode.ChoseMode.mode),
        );
    }

    eventManager.subscribe(ModsEvents.Close.ChoseMode, hidePopup);
    eventManager.subscribe(ModsEvents.Select.ChoseMode, showPopup);
}

function hidePopup() {
    popupRef.classList.add("hidden");
}

function showPopup() {
    popupRef.classList.remove("hidden");
}

function initTabsExtension() {
    initAppWorkflow();
    popupRef = htmlToNode(extensionHTML);
    eventManager.emit(ModsEvents.Close.ChoseMode);
    document.body.appendChild(popupRef);
}

initTabsExtension();
