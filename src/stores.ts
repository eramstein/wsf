import { get, writable } from "svelte/store";
import { handleKeyPress } from "./keybinds";
import { FullState, Screen } from "./model";
import { mutateStateAfterNavigation } from "./logic/navigation";

export const State = createFullState();

function createFullState() {
    const initialState = getNewState();

    const { subscribe, set, update } = writable(initialState);

    return {
        subscribe,
        initialize: () => set(getNewState()),
        load: data => set(data),
        goTo: (screen, params) => update(s => { mutateStateAfterNavigation(screen, params, s); saveState(); return s; }),
        
        addConcept: concept => update(s => { s.data.concepts[concept.name] = concept; saveState(); return s; }),
        filterData: newItems => update(s => { s.ui.filteredItems = newItems; saveState(); return s; }),
        updateConceptPreferences: (conceptName, preferences) => update(s => { s.data.user.preferences.concepts[conceptName] = preferences; saveState(); return s; }),
        updateConceptFilters: (conceptName, filters) => update(s => { s.data.user.preferences.concepts[conceptName].filters = filters; saveState(); return s; }),
        updateFiltersData: data => update(s => { s.ui.filterData = data; return s; }),
    };
}

function getNewState(): FullState {
    return {
        data: {
            concepts: {},
            user: {
                name: "Robert",
                preferences: {
                    concepts: {},
                },
            },
        },
        ui: {
            openScreen: Screen.Home,
            screenParameters: null,
            filteredItems: [],
            filterData: [],
        },
    };
}

// TODO: make DB more flexible than just IndexedDB
let db;
const request = window.indexedDB.open("wsf", 1);
request.onerror = function (event) {
    console.log('The database failed to open');
};
request.onsuccess = function (event) {    
    db = request.result;
    loadState(); 
};
request.onupgradeneeded = function(event) {
    db = request.result;
    if (!db.objectStoreNames.contains('state')) {
        db.createObjectStore('state', { keyPath: 'id' });
    }
}

function loadState() {
    const transaction = db.transaction(['state']);
    const objectStore = transaction.objectStore('state');
    const request = objectStore.get(1);

    request.onerror = function(event) {
        console.log('Transaction failed in getSavedState');
    };

    request.onsuccess = function(event) {
        if (request.result) {            
            State.load(request.result.state); 
        } else {
          console.log('No data record');
        }
     };
}

export function saveState() {
    const savedData = get(State);
    const request = db.transaction(['state'], 'readwrite')
        .objectStore('state')
        .put({ id: 1, state: savedData });
    request.onerror = function (event) {
        console.log('Failure while saving data');
    }
}

export function printState() {
    console.log(get(State));
}

export function resetState() {
    State.initialize();
    saveState();
}

window.onkeypress = handleKeyPress;
