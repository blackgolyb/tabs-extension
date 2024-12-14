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

let isTabsPopupOpen = false;
let popupRef;

function createPopup() {
    isTabsPopupOpen = true;
    popupRef = htmlToNode(extensionHTML);
    document.body.appendChild(popupRef);
}

function removePopup() {
    isTabsPopupOpen = false;
    if (popupRef) {
        document.body.removeChild(popupRef);
        popupRef = undefined;
    }
}

document.addEventListener("keydown", (event) => {
    if (!isTabsPopupOpen && event.ctrlKey && event.key === " ") {
        createPopup();
    } else if (isTabsPopupOpen && event.key === "Escape") {
        removePopup();
    }
});
