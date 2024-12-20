import { htmlToNode } from "@/utils";

const extensionHTML = `
<div class="tbxt" id="tbxt">
    <div class="tbxt__content">
        <input class="tbxt__search" id="tbxt-search" type="text" placeholder="Search..." />
        <div class="tbxt__tabs-list">
        </div>
    </div>
    <div class="tbxt__bg"/>
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
