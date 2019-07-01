import { FullState, Screen } from "../model";
import { getFilteredItems } from "../ui/conceptsMany/Filters";

export function mutateStateAfterNavigation(screen : Screen, params, state : FullState) {
    state.ui.openScreen = screen;
    state.ui.screenParameters = params;    
    if (screen === Screen.Concept && state.ui.lastOpenConcept !== params.concept) {        
        state.ui.filteredItems = getFilteredItems(state.data.user.preferences.concepts[params.concept].filters);
        state.ui.chartConfig = { colorBy: null, sizeBy: null, posBy1: null, posBy2: null, chartType: null};        
    }
    if (screen === Screen.Concept) {
        state.ui.lastOpenConcept = params.concept;
    }  
}