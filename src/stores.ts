import { get, writable } from "svelte/store";
import { handleKeyPress } from "./keybinds";

export enum Screen {
    Home = "HOME",
    ConceptMany = "CONCEPTS_MANY",
    ConceptOne = "CONCEPTS_ONE",
} 

export interface FullState {
    ui: UI;
    data: Data;
}

export interface UI {
    openScreen: Screen;
    screenParameters: any;
}

export interface Data {
    concepts: { [key: string] : Concept };
}

export interface Concept {
    items: { [key: string] : any };
}

export const State = createFullState();

function createFullState() {
    const initialState = getSavedState();

    const { subscribe, set, update } = writable(initialState);

    return {
        subscribe,
        initialize: () => set(getNewState()),

        //updateSpeed: diff => update(s => { s.ui.timeSpeed = Math.max(1, Math.min(10, s.ui.timeSpeed + diff)); return s; }),
    };
}

function getNewState(): FullState {
    return {
        data: {
            concepts: {},
        },
        ui: {
            openScreen: Screen.Home,
            screenParameters: null,
        },
    };
}

function getSavedState(): FullState {
    const savedData = localStorage.getItem("wsfData") || "nope";
    if (savedData === "nope") {
        return getNewState();
    } else {
        const parsedData = JSON.parse(savedData);
        return parsedData;
    }
}

export function saveState() {
    const savedData = get(State);
    localStorage.setItem("wsfData", JSON.stringify(savedData));
}

export function printState() {
    console.log(get(State));
}

export function resetState() {
    State.initialize();
    saveState();
}

window.onbeforeunload = () => {
    saveState();
};

window.onkeypress = handleKeyPress;
