import { DataType } from "../../model";

const PAGE_SIZE = 100;

export enum Sorting {
    Asc = "asc",
    Desc = "desc",
}

export interface Config {
    sortBy: string;
    sortDirection: string;
    columns: { [key: string] : Column } | {};
    pages: number;
}

export interface Column {
    name: string;
    filterValue: string;
    display: boolean,
}

export function getDefaultConfig(attributes) : Config {
    return {
        sortBy: null,
        sortDirection: null,
        columns: getColumnsFromAttributes(attributes),
        pages: 1,
    };
}

export function filterItem(item, columns : Column[]) {        
    let valid = true;
    Object.values(columns).forEach(column => {
        if (column.filterValue && item[column.name].toLowerCase().indexOf(column.filterValue.toLowerCase()) < 0) {
           valid = false; 
        }
    });
    return valid;
}

export function sortBy(item1, item2, config, attributes) {

    if (!attributes[config.sortBy]) {
        return null;
    }

    let val1 = item1[config.sortBy];
    let val2 = item2[config.sortBy];

    if (attributes[config.sortBy].type === DataType.Numeric) {
        val1 = val1*1;
        val2 = val2*1;
    } else {
        val1 = val1.toLowerCase();
        val2 = val2.toLowerCase();
    }
    
    if (config.sortDirection === Sorting.Asc) {
        if (val1 < val2) {
            return -1;
        }
        if (val1 > val2) {
            return 1;
        }
        return 0;
    } else {
        if (val1 > val2) {
            return -1;
        }
        if (val1 < val2) {
            return 1;
        }
        return 0;
    }
}

export function getColumnsFromAttributes(attributes) : { [key: string] : Column } | {} {
    return Object.values(attributes).reduce((agg : { [key: string] : Column }, curr : Column) => {
        agg[curr.name] = {
            name: curr.name,
            filterValue: null,
            display: true,
        };
        return agg;
    }, {});
}

export function getColumnSorting(name, configuration) {
    const currentSorting = configuration.sortBy === name ? configuration.sortDirection : null;
    let direction = null;
    if (currentSorting !== Sorting.Asc) {
        direction = Sorting.Asc;
    }
     else if (currentSorting === Sorting.Asc) {
        direction = Sorting.Desc;
    }

    return {
        sortBy: name,
        sortDirection: direction,
    };
}

export function getList(concept, config) {
    return Object.values(concept.items)
        .filter(item => filterItem(item, config.columns))
        .sort((item1, item2) => sortBy(item1, item2, config, concept.attributes))
        .slice(0, config.pages * PAGE_SIZE);
}