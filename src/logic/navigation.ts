import { FullState, Screen } from "../model";

export function mutateStateAfterNavigation(screen : Screen, params, state : FullState) {
    const oldScreen = state.ui.openScreen;
    const oldParams = state.ui.screenParameters;
    state.ui.openScreen = screen;
    state.ui.screenParameters = params;
    if (screen === Screen.Concept && oldParams.concept !== params.concept) {        
        state.ui.filteredItems = Object.values(state.data.concepts[params.concept].items);
    }    
}