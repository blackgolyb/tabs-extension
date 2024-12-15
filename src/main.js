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

const ExtMods = {
    Close: "Close",
    Select: "Select",
    Search: "Search",
    SearchSelect: "SearchSelect",
};
let extMod = ExtMods.Close;
let popupRef;

function addHandlers() {
    popupRef.addEventListener("click", (e) => {
        removePopup();
    });
    popupRef.addEventListener("keydown", (event) => {
        if (event.key === "/") {
            console.log("search");
        }
    });
}

function createPopup() {
    extMod = ExtMods.Select;
    showPopup();
}

function removePopup() {
    extMod = ExtMods.Close;
    hidePopup();
}

function hidePopup() {
    popupRef.classList.add("hidden");
}

function showPopup() {
    popupRef.classList.remove("hidden");
}

function initTabsExtension() {
    document.addEventListener("keydown", (event) => {
        if (extMod === ExtMods.Close && event.ctrlKey && event.key === " ") {
            event.stopImmediatePropagation();
            createPopup();
        } else if (extMod !== ExtMods.Close && event.key === "Escape") {
            event.stopImmediatePropagation();
            removePopup();
        }
    });
    popupRef = htmlToNode(extensionHTML);
    popupRef.classList.add("hidden");
    hidePopup();
    addHandlers();
    document.body.appendChild(popupRef);
}

initTabsExtension();
