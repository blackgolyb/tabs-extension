import { ModeEventCompositor } from "@/libs/events/modeCompositor";
import { KeybindingsListener } from "@/libs/events/keybindings";
import { ActiveTabEventProxy, Direction } from "@/libs/events/proxy";
import { modes } from "@/core/modes";
import { ModsEvents } from "@/core/events";
import { mappings } from "@/core/mappings";
import { createApp } from "../app";

const mainEventProvider = new ModeEventCompositor(modes);
const activeTabEventProxy = new ActiveTabEventProxy(Direction.Receive);
const keybindingsListener = new KeybindingsListener();

keybindingsListener.subscribe((e) => mainEventProvider.handleExternalEvent(e));
activeTabEventProxy.subscribe((e) => mainEventProvider.handleExternalEvent(e));

function initAppWorkflow(app) {
    for (const mapping of mappings) {
        mainEventProvider.map(...mapping);
    }
    mainEventProvider.subscribeEvent(ModsEvents.Close.ChoseMode, app.hide);
    mainEventProvider.subscribeEvent(ModsEvents.Select.ChoseMode, app.show);
    mainEventProvider.emit(ModsEvents.Close.ChoseMode); // Close app by default
}

function initTabsExtension() {
    const app = createApp(mainEventProvider);
    initAppWorkflow(app);
    document.body.appendChild(app.ref);
}

initTabsExtension();
