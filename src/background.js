console.log(browser.runtime.getBrowserInfo());

async function createCenteredPopup() {
    await browser.tabs.executeScript({
        file: "src/main.js",
    });
}

browser.browserAction.onClicked.addListener(() => {
    console.log("open popup");
    createCenteredPopup();
});
