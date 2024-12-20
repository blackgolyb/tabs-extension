import { Modes } from "./modes";
import { ModsEvents } from "./events";
import { CommandEvent } from "@/libs/events/browserCommands";
import { Keybind } from "@/libs/events/keybindings";

export const keybindings = [
    /*
    Also this keybindigs analogs are represented in manifest.json for configuring ability
    */
    //Select mode
    [Modes.Select, ["Escape"], ModsEvents.Close.ChoseMode],
    [Modes.Select, ["f"], ModsEvents.Search.ChoseMode], // provided by `search` command
    [Modes.Select, ["j"], ModsEvents.Select.NextTab],
    [Modes.Select, ["k"], ModsEvents.Select.PrevTab],
    //Search mode
    [Modes.Search, ["Escape"], ModsEvents.Select.ChoseMode],
    [Modes.Search, ["Enter"], ModsEvents.SearchSelect.ChoseMode],
    //SearchSelect mode
    [Modes.SearchSelect, ["Escape"], ModsEvents.Select.ChoseMode],
    [Modes.SearchSelect, ["f"], ModsEvents.Search.ChoseMode], // provided by `search` command
    [Modes.SearchSelect, ["j"], ModsEvents.SearchSelect.NextTab],
    [Modes.SearchSelect, ["k"], ModsEvents.SearchSelect.PrevTab],
];

export const commands = [
    [Modes.Close, "open", ModsEvents.Select.ChoseMode], // provided by `open` command
    [Modes.Select, "search", ModsEvents.Search.ChoseMode], // provided by `search` command
    [Modes.SearchSelect, "search", ModsEvents.Search.ChoseMode], // provided by `search` command
];

export const mappings = [];
for (const [mode, keys, event] of keybindings) {
    mappings.push([mode, Keybind.fromKeys(keys).toEvent(), event]);
}
for (const [mode, command, event] of commands) {
    mappings.push([mode, new CommandEvent(command), event]);
}
