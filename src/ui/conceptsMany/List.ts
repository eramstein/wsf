import { DataType, ConceptPreferences, ListConfig, Column, Widget } from "../../model";

const PAGE_SIZE = 60;

export enum Sorting {
    Asc = "asc",
    Desc = "desc",
}

export function getDefaultConfig(attributes, widgets : { [key: string] : Widget }, lists : ListConfig[]) : ListConfig {    
    if (!lists || lists.length === 0) {
        return {
            id: 0,
            name: "Listing",
            sortBy: null,
            sortDirection: null,
            columns: getColumnsFromAttributes(attributes),
            widgets: {},
            pages: 1,
        };
    }

    const sparklines = Object.values(widgets).filter(w => w.inLists === true);
    const firstList = lists[0];
    sparklines.forEach(s => {
        if (firstList.widgets[s.name] === undefined) {
            firstList.widgets[s.name] = false;
        }
    })
    return firstList;
}

export function filterItem(item, columns : Column[]) {        
    let valid = true;
    Object.values(columns).forEach(column => {
        if (column.filterValue && (item[column.name]+"").toLowerCase().indexOf(column.filterValue.toLowerCase()) < 0) {
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

export function getList(items, attributes, config) {    
    return Object.values(items)
        .filter(item => filterItem(item, config.columns))
        .sort((item1, item2) => sortBy(item1, item2, config, attributes))
        .slice(0, config.pages * PAGE_SIZE);
}

export function saveListConfig(oldLists : ListConfig[], listConfig : ListConfig) : ListConfig[] {
    const isDefault = listConfig.id === 0 ? true : false;
    let newLists = oldLists || [];

    if (isDefault) {
        listConfig.id = getNewID();
        newLists = [listConfig];
    }

    return newLists;
}

export function getNewList(attributes) : ListConfig {
    return {
        id: getNewID(),
        name: "New List",
        sortBy: null,
        sortDirection: null,
        columns: getColumnsFromAttributes(attributes),
        widgets: {},
        pages: 1,
    }
}

function getNewID() : number {
    return Math.floor(Math.random() * 1000000000000);
}

export function getSortArrowClass(attribute, config : ListConfig) : string {
    let className = "";
    if (attribute === config.sortBy) {
        className = "arrow ";
        if (config.sortDirection === Sorting.Asc) {
            className += " arrow-up";
        } else {
            className += " arrow-down";
        }
    }    
    return className;
}
