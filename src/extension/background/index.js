import { CommandListener } from "@/libs/events/browserCommands";
import { ActiveTabEventProxy, Direction } from "@/libs/events/proxy";

const commandEventProvider = new CommandListener();
const activeTabEventProxy = new ActiveTabEventProxy(Direction.Send);

commandEventProvider.subscribe((e) =>
    activeTabEventProxy.handleExternalEvent(e),
);

console.log("Browser Info:", browser.runtime.getBrowserInfo());
