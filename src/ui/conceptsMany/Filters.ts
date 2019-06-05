import { State } from '../../stores';
import { Concept, FilterConfig, DataType } from "../../model";

export interface FilterData {
    attribute: string;
    type: string;
    spread?: Spread;
    categories?: Category[];
}

export interface Spread {
    min: number;
    max: number;
    med: number;
    q1: number;
    q3: number;
}

export interface Category {
    name: string;
    value: number;
}

export function getFiltersData(concept : Concept, items) : FilterData[] {    
    
    let result = [];
    
    Object.values(concept.attributes).forEach(attribute => {
        if (attribute.type === DataType.Numeric || attribute.type === DataType.Categorical) {
            const newVal : FilterData = {
                attribute: attribute.name,
                type: attribute.type,
            };
            if (attribute.type === DataType.Numeric) {
                const sortedItems = items.filter(a => a[attribute.name] !== null).sort((a, b) => a[attribute.name] - b[attribute.name]);             
                if (sortedItems.length >= 1) {
                    newVal.spread = {
                        min: sortedItems[0][attribute.name],
                        max: sortedItems[sortedItems.length - 1][attribute.name],
                        med: sortedItems[Math.floor(sortedItems.length / 2)][attribute.name],
                        q1: sortedItems[Math.floor(sortedItems.length / 4)][attribute.name],
                        q3: sortedItems[Math.floor(sortedItems.length * 3 / 4)][attribute.name],
                    };
                }                                
            }
            if (attribute.type === DataType.Categorical) {
                const categories : { [key: string] : number } = items.reduce((agg, item) => {
                    const val = item[attribute.name];
                    if (!agg[val]) {
                        agg[val] = 1;
                    } else {
                        agg[val]++;
                    }
                    return agg;
                }, {});
                newVal.categories = Object.entries(categories).map(a => {return { name:a[0], value:a[1] } } );
            }
            if (newVal.spread || newVal.categories) {
                result.push(newVal);
            }
        }
    });
    console.log('getFiltersData', result);
    return result;
}

export function getDefaultFilterConfig(concept : Concept) : { [key: string] : FilterConfig } {
    return {};
}

export function filterData(items) {
    const filteredItems = items.slice(0, 5);
    State.filterData(filteredItems);
}