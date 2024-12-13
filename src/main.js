let isTabsPopupOpen = false;

function createPopup() {
    isTabsPopupOpen = true;
    console.log("open popup");
}

function removePopup() {
    isTabsPopupOpen = false;
    console.log("remove popup");
}

document.addEventListener("keydown", (event) => {
    if (!isTabsPopupOpen && event.ctrlKey && event.key === " ") {
        createPopup();
    } else if (isTabsPopupOpen && event.key === "Escape") {
        removePopup();
    }
});
