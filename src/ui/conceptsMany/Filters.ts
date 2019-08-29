import { State } from '../../stores';
import { get } from "svelte/store";
import { Concept, FilterConfig, DataType } from "../../model";
import { Spread, getSpread } from '../../utils';

export const FILTER_LABEL_WIDTH = 130;
export const FILTER_VALUE_WIDTH = 150;
export const FILTER_VALUE_PADDING = 40;
export const CATEGORIES_LIMITED_DISPLAYED = 7;

// TODO: allow filters based on relations (e.g. Star Wars actors)
//       when coming from search or relations tab
export interface FilterData {
    attribute: string;
    type: string;
    spread?: Spread;
    categories?: Category[];
}

export interface Category {
    label: string;
    value: number;
}

export function setFiltersData(concept : Concept, items, filters : FilterConfig) {
    let result = [];
    const preferenceArray = Object.entries(filters).map(a => { return { name: a[0], ...a[1] } });    
    
    Object.values(concept.attributes).forEach(attribute => {
        if (attribute.type === DataType.Numeric || attribute.type === DataType.Categorical) {
            const newVal : FilterData = {
                attribute: attribute.name,
                type: attribute.type,
            };
            const preferences = preferenceArray
                .filter(p => p.name !== attribute.name)
                .map(p => { return { ...p, categories: Object.entries(p.categories).length === 0 ? null : p.categories } });
                
            const filteredItems = items.filter(item => {
                let valid = true;
                preferences.forEach(preference => {
                    const value = item[preference.name];
                    if (preference.from !== null && value < preference.from
                        || preference.to !== null && value > preference.to
                        || preference.categories && !preference.categories[value]
                        ) {
                        valid = false;
                    }
                });
                return valid;
            });
            
            if (attribute.type === DataType.Numeric) {
                newVal.spread = getSpread(filteredItems, attribute.name);
            }
            if (filteredItems.length > 0 && attribute.type === DataType.Categorical) {
                const categories : { [key: string] : number } = filteredItems.reduce((agg, item) => {
                    const val = item[attribute.name];
                    if (!agg[val]) {
                        agg[val] = 1;
                    } else {
                        agg[val]++;
                    }
                    return agg;
                }, {});
                const categoriesArray =
                    Object.entries(categories)
                        .map(a => {return { label:a[0], value:a[1] } } )
                        .sort((a, b) => b.value - a.value);
                const maxValue = categoriesArray[0].value;
                newVal.categories = categoriesArray.map((a, i) => { return { ...a, position: i, sizePercent: Math.floor(a.value/maxValue*100) } } );
            }
            if (newVal.spread || newVal.categories) {
                result.push(newVal);
            }
        }
    });
    State.updateFiltersData(result);
}

export function setDefaultFilterConfig(concept : Concept) {
    const filtersPreferences : { [key: string] : FilterConfig } = {};
    Object.values(concept.attributes).forEach(attribute => {
        filtersPreferences[attribute.name] = {
            collapsed: false,
            limited: false,
            from: null,
            to: null,
            categories: {},
        }
    });    
    State.updateConceptFilters(concept.name, filtersPreferences);
}

export function getFilteredItems(preferences : { [key: string] : FilterConfig }, concept : string) {    
    const savedData = get(State);
    const allItems = Object.values(savedData.data.concepts[concept].items);
    const preferenceArray = Object.entries(preferences).map(a => { return { name: a[0], ...a[1] } });    
    const filteredItems = allItems.filter(item => {
        let valid = true;
        preferenceArray.forEach(preference => {
            const value = item[preference.name];
            if (preference.from !== null && value*1 < preference.from
                || preference.to !== null && value*1 > preference.to
                || Object.entries(preference.categories).length !== 0 && !preference.categories[value]
                ) {
                valid = false;
            }
        });
        return valid;
    });
    return filteredItems;
}

export function toggleCategory(attribute, category) {
    const savedData = get(State);
    const conceptName = savedData.ui.screenParameters.concept;
    const preferences = savedData.data.user.preferences.concepts[conceptName].filters;
    const value = preferences[attribute].categories[category] ? true : false;
    if (!value) {
        preferences[attribute].categories[category] = true;
    } else {
        delete preferences[attribute].categories[category];
    }

    State.updateConceptFilters(conceptName, preferences);
    State.filterData(getFilteredItems(preferences, conceptName));
}

export function setNumericRange(attribute, from, to) {
    const savedData = get(State);
    const conceptName = savedData.ui.screenParameters.concept;
    const preferences = savedData.data.user.preferences.concepts[conceptName].filters;    
    preferences[attribute].from = from;
    preferences[attribute].to = to;
    
    State.updateConceptFilters(conceptName, preferences);
    State.filterData(getFilteredItems(preferences, conceptName));
}

export function toggleAttribute(attribute) {
    const savedData = get(State);
    const conceptName = savedData.ui.screenParameters.concept;
    const preferences = savedData.data.user.preferences.concepts[conceptName].filters;
    const attributePreferences = preferences[attribute];
    const categories = savedData.ui.filterData.filter(f => f.attribute === attribute)[0].categories;
    const { limited, collapsed } = attributePreferences;

    if (collapsed) {
        if (categories && categories.length > CATEGORIES_LIMITED_DISPLAYED) {
            attributePreferences.collapsed = false;
            attributePreferences.limited = true;
        } else {
            attributePreferences.collapsed = false;
            attributePreferences.limited = false;
        }        
    } else {
        if (limited) {
            attributePreferences.collapsed = false;
            attributePreferences.limited = false;
        } else {
            attributePreferences.collapsed = true;
            attributePreferences.limited = false;
        }
    }
    
    State.updateConceptFilters(conceptName, preferences);
}