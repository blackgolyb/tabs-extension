import { CommandListener } from "@/event";

const commandListener = new CommandListener();

async function createCenteredPopup() {
    const screenWidth = window.screen.availWidth;
    const screenHeight = window.screen.availHeight;

    const popupWidth = 400; // ширина попапу
    const popupHeight = 300; // висота попапу

    const left = Math.round((screenWidth - popupWidth) / 2);
    const top = Math.round((screenHeight - popupHeight) / 2);

    await browser.windows.create({
        url: "google.com", // ваш HTML-файл для попапу
        type: "popup",
        width: popupWidth,
        height: popupHeight,
        left: left,
        top: top,
    });
}

async function openExt() {
    try {
        const tabs = await browser.tabs.query({
            active: true,
            currentWindow: true,
        });
        const activeTab = tabs[0];
        await browser.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: () => {
                window.ExtTabsOpen();
                // window.ExtTabs.registerListener(commandListener);
            },
        });
    } catch (e) {
        console.log("errrr: ", e);
        // await createCenteredPopup();
    }
}

console.log("Browser Info:", browser.runtime.getBrowserInfo());
browser.commands.onCommand.addListener((command) => {
    if (command === "open") {
        console.log("open ext");
        openExt();
    }
});
