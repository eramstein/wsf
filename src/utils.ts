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

export function getSpreadBy(vals : [any], attr : string) : Spread {
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

export function getRangeBy(vals : [any], attr : string) : Range {
    let lowest = Number.POSITIVE_INFINITY;
    let highest = Number.NEGATIVE_INFINITY;
    let tmp;
    for (var i=vals.length-1; i>=0; i--) {
        tmp = vals[i][attr];
        if (tmp < lowest) lowest = tmp;
        if (tmp > highest) highest = tmp;
    }
    return {
        max: highest,
        min: lowest,
    };
}