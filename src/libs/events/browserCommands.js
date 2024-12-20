import { ExtEvent, BaseEventListenerAdapter } from "./base";

export class CommandEvent extends ExtEvent {
    constructor(command) {
        super({ command }, "CommandEvent");
        this.command = command;
    }
}

export class CommandListener extends BaseEventListenerAdapter {
    initListener() {
        browser.commands.onCommand.addListener((c) => this.handleCommand(c));
    }

    handleCommand(command) {
        this.emit(new CommandEvent(command).create());
    }
}
