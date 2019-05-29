import { printState } from "./stores";

export function handleKeyPress(event) {
    // l -> log state
    if (event.charCode === 108) {
        printState();
    }
}
