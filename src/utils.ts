export interface Spread {
    min: number;
    max: number;
    med: number;
    q1: number;
    q3: number;
}

export interface Range {
    min: number;
    max: number;
}

export function getSpread(vals : [any], attr : string) : Spread {    
    const sortedItems = vals.filter(a => a[attr] !== null).sort((a, b) => a[attr] - b[attr]);             
    if (sortedItems.length > 0) {
        return {
            min: sortedItems[0][attr],
            max: sortedItems[sortedItems.length - 1][attr],
            med: sortedItems[Math.floor(sortedItems.length / 2)][attr],
            q1: sortedItems[Math.floor(sortedItems.length / 4)][attr],
            q3: sortedItems[Math.floor(sortedItems.length * 3 / 4)][attr],
        };
    }
    return {
        min: 0,
        max: 0,
        med: 0,
        q1: 0,
        q3: 0,
    };
}

export function getSpreadRaw(vals : [any]) : Spread {    
    const sortedItems = vals.filter(a => a !== null).sort((a, b) => a*1 - b*1);
      
    if (sortedItems.length > 0) {
        return {
            min: sortedItems[0],
            max: sortedItems[sortedItems.length - 1],
            med: sortedItems[Math.floor(sortedItems.length / 2)],
            q1: sortedItems[Math.floor(sortedItems.length / 4)],
            q3: sortedItems[Math.floor(sortedItems.length * 3 / 4)],
        };
    }
    return {
        min: 0,
        max: 0,
        med: 0,
        q1: 0,
        q3: 0,
    };
}

export function getSpreadByCategory(vals : [any], attr : string, category : string) : { [key: string] : Spread } {
    const result = {};
    const categoryValues = {};
    let val;
    let categ;
    for (var i=vals.length-1; i>=0; i--) {
        val = vals[i][attr];
        categ = vals[i][category];
        if (!categoryValues[categ]) {
            categoryValues[categ] = [];
        }
        categoryValues[categ].push(val);
    }    
    Object.entries(categoryValues).forEach(c => {        
        result[c[0]] = getSpreadRaw(<any>c[1]);
    });
    return result;
}

export function getRangeBy(vals : [any], attr : string) : Range {
    let lowest = Number.POSITIVE_INFINITY;
    let highest = Number.NEGATIVE_INFINITY;
    let val;
    for (var i=vals.length-1; i>=0; i--) {
        val = vals[i][attr];
        if (val < lowest) lowest = val;
        if (val > highest) highest = val;
    }
    return {
        max: highest,
        min: lowest,
    };
}

export function getUniqueValues(vals, attr) {
    return Array.from(new Set(vals.map(v => v[attr])));
}