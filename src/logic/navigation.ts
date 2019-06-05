import { FullState, Screen } from "../model";

export function mutateStateAfterNavigation(screen : Screen, params, state : FullState) {
    state.ui.openScreen = screen;
    state.ui.screenParameters = params;
    if (screen === Screen.Concept) {
        state.ui.filteredItems = Object.values(state.data.concepts[params.concept].items);
    }    
}