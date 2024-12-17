import { ModeEvent } from "@/libs/events/modeCompositor";
import { Modes } from "./modes";

export const ModsEvents = {
    Close: {
        ChoseMode: new ModeEvent(Modes.Close, ModeEvent.CHANGE_MODE),
    },
    Select: {
        ChoseMode: new ModeEvent(Modes.Select, ModeEvent.CHANGE_MODE),
        NextTab: new ModeEvent(Modes.Select, "NextTab"),
        PrevTab: new ModeEvent(Modes.Select, "PrevTab"),
    },
    Search: {
        ChoseMode: new ModeEvent(Modes.Search, ModeEvent.CHANGE_MODE),
    },
    SearchSelect: {
        ChoseMode: new ModeEvent(Modes.SearchSelect, ModeEvent.CHANGE_MODE),
        NextTab: new ModeEvent(Modes.SearchSelect, "NextTab"),
        PrevTab: new ModeEvent(Modes.SearchSelect, "PrevTab"),
    },
};
