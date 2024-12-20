import { htmlToNode } from "@/utils";

const extensionHTML = `
<div class="tabs-extension">
    <div class="content">
        <div class="search">
            <input type="text" placeholder="Search..." />
        </div>
        <div class="tabs-list"></div>
    </div>
    <div class="bg"/>
</div>
`;

export function createApp() {
    const ref = htmlToNode(extensionHTML);

    const hide = () => {
        ref.classList.add("hidden");
    };

    const show = () => {
        ref.classList.remove("hidden");
    };

    const app = {
        ref,
        hide,
        show,
    };
    return app;
}
