import { createAreaFireMessage, listenAreaFireMessage } from "./actions/area-fire.mjs";
import { initializeActions } from "./actions/index.mjs";

Hooks.once("init", () => {
    CONFIG.PF2E.thrownBaseWeapons?.push("grenade");
    initializeActions();
});

// Add Area Damage Aux Button to the character sheet
// @todo handle in actual system
Hooks.on("renderCharacterSheetPF2e", (sheet, html) => {
    const actor = sheet.actor;
    for (const strikeRow of html.find("[data-strike]")) {
        const action = actor.system.actions[strikeRow.dataset.actionIndex];
        const item = action.item;
        const isArea = item.system.traits.value.some((t) => t.startsWith("area-"));
        const isAutomatic = item.system.traits.value.includes("automatic");
        if (!isArea && !isAutomatic) continue;

        const auxActions = strikeRow.querySelector(".auxiliary-actions.weapon-drawn");
        if (!auxActions) continue;

        const label = game.i18n.localize(`SF2E.Actions.${isArea ? "AreaFire" : "AutoFire"}.Title`);
        const button = createHTMLElement(`<button class="use-action" type="button"><span>${label}</span> <span class="action-glyph">2</span></button>`);
        auxActions.prepend(button);
        button.addEventListener("click", () => {
            createAreaFireMessage(item);
        });
    }
});

function createHTMLElement(elementString) {
    const element = document.createElement("template");
    element.innerHTML = elementString?.trim();
    return element.content.firstElementChild;
}

Hooks.on('renderChatMessageHTML', (message, html) => {
    listenAreaFireMessage(message, html);
});
