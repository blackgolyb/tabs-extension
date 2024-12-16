export function removeValueIfExist(arr, value) {
    const idx = arr.indexOf(value);
    if (idx !== -1) {
        arr.splice(idx, 1);
    }
    return idx !== -1;
}

/**
 * @param {String} HTML representing a single node (which might be an Element,
                   a text node, or a comment).
 * @return {Node}
 */
export function htmlToNode(html) {
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
