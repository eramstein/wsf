import { printState, saveState } from "./stores";

export function handleKeyPress(event) {
    // l -> log state
    if (event.charCode === 108) {
        printState();
    }
    // s -> save
    if (event.charCode === 115) {
        saveState();
    }
}
