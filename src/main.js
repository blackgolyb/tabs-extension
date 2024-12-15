/**
 * @param {String} HTML representing a single node (which might be an Element,
                   a text node, or a comment).
 * @return {Node}
 */
function htmlToNode(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    const nNodes = template.content.childNodes.length;
    if (nNodes !== 1) {
        throw new Error(
            `html parameter must represent a single node; got ${nNodes}. ` +
                "Note that leading or trailing spaces around an element in your " +
                'HTML, like " <img/> ", get parsed as text nodes neighbouring ' +
                "the element; call .trim() on your input to avoid this.",
        );
    }
    return template.content.firstChild;
}

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

function removeValueIfExist(arr, value) {
    const idx = arr.indexOf(value);
    if (idx !== -1) {
        arr.splice(idx, 1);
    }
    return idx !== -1;
}

class Key {
    constructor(name) {
        this.name = name;
    }

    valueOf() {
        return [this];
    }
}

const CTRL = "CTRL";
const SHIFT = "SHIFT";
const ALT = "ALT";
const META = "META";

class Keybind {
    constructor(keys) {
        this.initKeybind(keys);
    }

    initKeybind(keys) {
        this.ctrl = removeValueIfExist(keys, CTRL);
        this.shift = removeValueIfExist(keys, SHIFT);
        this.alt = removeValueIfExist(keys, ALT);
        this.meta = removeValueIfExist(keys, META);
        this.key = keys[0];
    }

    verifyEvent(event) {
        if (this.ctrl !== event.ctrlKey) {
            return false;
        }
        if (this.shift !== event.shiftKey) {
            return false;
        }
        if (this.alt !== event.altKey) {
            return false;
        }
        if (this.meta !== event.metaKey) {
            return false;
        }
        return this.key === event.key;
    }
}

const ExtMods = {
    Close: "Close",
    Select: "Select",
    Search: "Search",
    SearchSelect: "SearchSelect",
};

class ExtEvent {
    constructor(mode, eventName) {
        this.mode = mode;
        this.eventName = eventName;
    }
}

const ExtModsEvents = {
    Close: {
        ChoseMode: new ExtEvent(ExtMods.Close, "ChoseMode"),
    },
    Select: {
        ChoseMode: new ExtEvent(ExtMods.Select, "ChoseMode"),
        NextTab: new ExtEvent(ExtMods.Select, "NextTab"),
        PrevTab: new ExtEvent(ExtMods.Select, "PrevTab"),
    },
    Search: {
        ChoseMode: new ExtEvent(ExtMods.Search, "ChoseMode"),
    },
    SearchSelect: {
        ChoseMode: new ExtEvent(ExtMods.SearchSelect, "ChoseMode"),
        NextTab: new ExtEvent(ExtMods.SearchSelect, "NextTab"),
        PrevTab: new ExtEvent(ExtMods.SearchSelect, "PrevTab"),
    },
};

class EventManager {
    constructor() {
        this.currentMode = null;
        this.eventMappings = new Map();
        this.mappings = [];
        this.initKeyListener();
    }

    initKeyListener() {
        document.addEventListener("keydown", (e) => this.keyListener(e));
    }

    subscribe(event, callback) {
        const callbacks = this.eventMappings.get(event) || [];
        callbacks.push(callback);
        this.eventMappings.set(event, callbacks);
    }

    map(mode, keybind, event) {
        this.mappings.push([mode, keybind, event]);
    }

    emit(event) {
        const callbacks = this.eventMappings.get(event) || [];
        for (const callback of callbacks) {
            callback();
        }
    }

    setMode(mode) {
        this.currentMode = mode;
    }

    keyListener(e) {
        const currentMode = this.currentMode;
        for (const [mode, keybind, event] of this.mappings) {
            if (
                (mode === null || mode === currentMode) &&
                keybind.verifyEvent(e)
            ) {
                this.emit(event);
                e.stopPropagation();
            }
        }
    }
}

const eventManager = new EventManager();
let popupRef;
const keybindings = [
    [ExtMods.Close, [CTRL, " "], ExtModsEvents.Select.ChoseMode],
    //Select mode
    [ExtMods.Select, ["Escape"], ExtModsEvents.Close.ChoseMode],
    [ExtMods.Select, ["f"], ExtModsEvents.Search.ChoseMode],
    [ExtMods.Select, ["j"], ExtModsEvents.Select.NextTab],
    [ExtMods.Select, ["k"], ExtModsEvents.Select.PrevTab],
    //Search mode
    [ExtMods.Search, ["Escape"], ExtModsEvents.Select.ChoseMode],
    [ExtMods.Search, ["Enter"], ExtModsEvents.SearchSelect.ChoseMode],
    //SearchSelect mode
    [ExtMods.SearchSelect, ["Escape"], ExtModsEvents.Select.ChoseMode],
    [ExtMods.SearchSelect, ["f"], ExtModsEvents.Search.ChoseMode],
    [ExtMods.SearchSelect, ["j"], ExtModsEvents.SearchSelect.NextTab],
    [ExtMods.SearchSelect, ["k"], ExtModsEvents.SearchSelect.PrevTab],
];

function initAppWorkflow() {
    for (const [mode, keys, event] of keybindings) {
        eventManager.map(mode, new Keybind(keys), event);
    }

    //Init modes switching
    for (const mode of Object.values(ExtModsEvents)) {
        eventManager.subscribe(mode.ChoseMode, () =>
            eventManager.setMode(mode.ChoseMode.mode),
        );
    }

    eventManager.subscribe(ExtModsEvents.Close.ChoseMode, hidePopup);
    eventManager.subscribe(ExtModsEvents.Select.ChoseMode, showPopup);
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
    eventManager.emit(ExtModsEvents.Close.ChoseMode);
    document.body.appendChild(popupRef);
}

initTabsExtension();
