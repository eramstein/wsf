import { FullState, Screen } from "../model";
import { getFilteredItems } from "../ui/conceptsMany/Filters";

export function mutateStateAfterNavigation(screen : Screen, params, state : FullState, skipHistory : boolean) {    
    state.ui.openScreen = screen;
    state.ui.screenParameters = params;    
    if (screen === Screen.Concept && state.ui.lastOpenConcept !== params.concept) {        
        state.ui.filteredItems = getFilteredItems(state.data.user.preferences.concepts[params.concept].filters);
        state.ui.chartConfig = { colorBy: null, sizeBy: null, posBy1: null, posBy2: null, chartType: null};        
    }
    if (screen === Screen.Concept) {
        state.ui.lastOpenConcept = params.concept;
    }
    if (skipHistory === false) {
        state.ui.history.push({
            openScreen: screen,
            screenParameters: params,
        });
        if (state.ui.history.length > 100) {
            state.ui.history.shift();
        }
    }    
}

export function goBack(state : FullState) {    
    if (state.ui.history.length <= 1) {
        return;
    }
    state.ui.history.pop();    
    const previousPage = state.ui.history[state.ui.history.length -1];
    mutateStateAfterNavigation(previousPage.openScreen, previousPage.screenParameters, state, true);
}