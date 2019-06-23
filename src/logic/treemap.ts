export interface TreemapRect {
    id: string;
    value: number;
    x: number;
    y: number;
    width: number;
    height: number;
    surface?: number;
    children?: TreemapRect[];
}

const SQUARIFY_BELOW = 10000;

function worseAspectRatio(row: TreemapRect[], w: number): number {

    if (row.length === 0) {
        return Number.POSITIVE_INFINITY;
    }
    const min = row[row.length - 1].surface;
    const max = row[0].surface;
    let s = 0;
    row.forEach(r => s += r.surface);

    const ratioOfBiggest = (w * w * max) / (s * s);
    const inverseRatioOfSmallest = (s * s) / (w * w * min);

    return Math.max(ratioOfBiggest, inverseRatioOfSmallest);
}

// builds a tree map trying to make rectangles as square as possible
// implemented based on this paper: https://www.win.tue.nl/~vanwijk/stm.pdf
function squarifiedLayout(leafs: TreemapRect[], x: number, y: number, width: number, height: number, totalValue: number): TreemapRect[] {

    const totalSurface = width * height;
    const sortedLeafs = [...leafs]
        .sort((a, b) => b.value - a.value)
        .map(l => ({ ...l, surface: l.value / totalValue * totalSurface }));

    const result = [];
    let goingVertical = width > height ? true : false;
    let eatenWidth = 0;
    let eatenHeight = 0;
    let remainingValue = totalValue;

    function insertRowIntoLayout(row: TreemapRect[]) {
        let sum = 0;
        row.forEach(r => sum += r.value);

        const fixedDimSize = goingVertical ? height - eatenHeight : width - eatenWidth;
        const variableDimSize = !goingVertical ? height - eatenHeight : width - eatenWidth;
        const rowSizeOnVariableDim = variableDimSize * sum / remainingValue;

        let accumulatedRows = 0;

        row.forEach(r => {
            const rowSize = (r.value / sum) * fixedDimSize;
            result.push({
                ...r,
                x: x + eatenWidth + (!goingVertical ? accumulatedRows : 0) + 1,
                y: y + eatenHeight + (goingVertical ? accumulatedRows : 0) + 1,
                width: (goingVertical ? rowSizeOnVariableDim : rowSize) - 1,
                height: (goingVertical ? rowSize : rowSizeOnVariableDim) - 1,
            });
            accumulatedRows += rowSize;
        });

        eatenWidth += (goingVertical ? rowSizeOnVariableDim : 0);
        eatenHeight += (goingVertical ? 0 : rowSizeOnVariableDim);
        remainingValue = remainingValue - sum;
        goingVertical = (width - eatenWidth) > (height - eatenHeight) ? true : false;

    }

    function squarify(items: TreemapRect[], row: TreemapRect[], rowSize: number) {

        if (items.length === 0) {
            insertRowIntoLayout(row);
            return;
        }

        const first = items[0];

        // if adding the leaf would make the aspect ratios in the row worse, cash in that row and recurse on the rest
        if (worseAspectRatio(row.concat([first]), rowSize) > worseAspectRatio(row, rowSize)) {
            insertRowIntoLayout(row);
            squarify(items, [], Math.min(width - eatenWidth, height - eatenHeight));
        } else {
            squarify(items.splice(1), row.concat(first), rowSize);
        }
    }

    const initialRowSize = Math.min(width, height);
    squarify(sortedLeafs, [], initialRowSize);

    return result;
}

// builds a tree map with one horizontal row only
// nice side effect with canvas 2d: very small lines + the separator "merge" and create a kind of heatmap/gradient effect by lowering the opacity
function oneDimLinear(leafs: TreemapRect[], x: number, y: number, width: number, height: number, totalValue: number): TreemapRect[] {
    const result = [];
    const sortedLeafs = leafs.sort((a, b) => b.value - a.value);
    let xShift = 0;
    sortedLeafs.forEach(c => {
        const w = (c.value / totalValue) * width;
        result.push({
            ...c,
            x: x + xShift,
            y: y + 0,
            width: w - 0.5,
            height,
        });
        xShift += w;
    });
    return result;
}

// when lots of items: use oneDimLinear to create a high level chart effect
// when fewer, use squarifiedLayout algo to make each indivual rect more visible
export function getTreemap(groups: TreemapRect[], width: number, height: number, totalValue: number): TreemapRect[] {
    let rects = [];

    const zones = oneDimLinear(groups, 0, 0, width, height, totalValue);

    zones.forEach((z, i) => {
        if (z.children.length > SQUARIFY_BELOW) {
            rects = rects.concat(oneDimLinear(z.children, z.x, z.y, z.width, z.height, z.value));
        } else {
            const squarified = squarifiedLayout(z.children, z.x, z.y, z.width, z.height, z.value);
            rects = rects.concat(squarified);
        }
    });

    return rects;
}