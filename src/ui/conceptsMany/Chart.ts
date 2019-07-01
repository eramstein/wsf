import { Attribute, DataType } from "../../model";
import { getSpread, getSpreadByCategory, Spread, Range, getRangeBy, getUniqueValues } from "../../utils";
import { getTreemap, TreemapRect } from "../../logic/treemap";

export interface ChartConfig {
    colorBy: string;
    sizeBy: string;
    posBy1: string;
    posBy2: string;
    chartType: string;
}

export interface Bubble {
    id: string;
    x: number;
    y: number;
    color: string;
    width: number;
    height: number;
    data: {any};
}

export interface Plate {
    xPos: number;
    yPos: number;
    xLabel: string;
    yLabel: string;
    weight: number;
    weightRelative: number;
    width: number;
    height: number;
    leafs: TreemapRect[] | [];
}

export interface Helpers {
    spreadX: Spread;
    spreadY: Spread;
    spreadByCategory: { [key: string] : Spread },
    sizeRange: Range;
    width: number;
    height: number;
    plates: { [key: string] : Plate };  
    margin: {
        top: number,
        bottom: number,
        right: number,
        left: number,
    };
}

const ANIMATION_DURATION = 750;
const INNER_MARGINS_BOXPLOTS = {
    left: 100,
    bottom: 70,
};
const INNER_MARGINS_PLATES = {
    left: 150,
    bottom: 30,
};
const COLORS = ['rgba(3, 102, 214, 0.5)', 'rgba(255, 127, 0, 0.75)', 'rgba(37, 162, 33, 0.75)', 'rgba(216, 40, 31, 0.75)', 'rgba(149, 99, 191, 0.75)', 'rgba(141, 85, 73, 0.75)', 'rgba(229, 116, 196, 0.75)', 'rgba(127, 127, 127, 0.75)', 'rgba(188, 190, 0, 0.75)', 'rgba(0, 190, 208, 0.75)', 'rgba(28, 158, 119, 0.75)', 'rgba(218, 95, 3, 0.75)', 'rgba(117, 111, 179, 0.75)', 'rgba(232, 41, 138, 0.75)', 'rgba(102, 166, 30, 0.75)', 'rgba(231, 171, 1, 0.75)', 'rgba(166, 117, 30, 0.75)'];
const MIN_BUBBLE_SIZE = 1;
const MAX_BUBBLE_SIZE = 50;
const DEFAULT_BUBBLE_SIZE = 10;
const MAX_PLATE_HEIGHT = 100;

export const bubbleChart = function() {
    const canvas = <HTMLCanvasElement> document.getElementById("canvas");
    // TODO: use webgl (30 FPS with 15K bubbles, acceptable but not great)
    const ctx = canvas.getContext('2d');
    canvas.style.width ='100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = document.body.clientHeight - 110; // TODO: magic number which is the 2 menus height on top    
    
    const margin = { top: 40, right: 20, bottom: 20, left: 20 };

    let oldBubblesValues : { [key: string] : Bubble } = {};

    const helpers = <Helpers>{
        margin, 
        width: canvas.width - margin.right - margin.left,
        height: canvas.height - margin.top - margin.bottom,
    };

    let oldHelpers = <Helpers>{
        spreadX: { min: 0, max: 0, med: 0, q1: 0, q3: 0 },
        spreadY: { min: 0, max: 0, med: 0, q1: 0, q3: 0 },
    };
    
    let colorScale = {};
    let oldConfig = <ChartConfig>{};

    this.build = function() {

        console.log('BUILD CHART');     

    };

    this.update = function(data : [any], config : ChartConfig, attributes : { [key: string] : Attribute }) {
        console.log('UPDATE CHART');

        console.log(config);
        

        ctx.clearRect(0, 0, canvas.width, canvas.height);        

        const type1 = attributes[config.posBy1] && attributes[config.posBy1].type;
        const type2 = attributes[config.posBy2] && attributes[config.posBy2].type;
        const identifier = Object.entries(attributes).filter(a => a[1].type === DataType.Identifier).map(a => a[0])[0];
        let sizeRange;
        let colorIndex = 0;
        let bubbles : Bubble[] = [];

        // HELPERS
        if (type1 === DataType.Numeric && type2 === DataType.Numeric) {
            helpers.spreadX = getSpread(data, config.posBy1);
            helpers.spreadY = getSpread(data, config.posBy2);
        }
        if (type1 === DataType.Numeric && type2 === DataType.Categorical) {
            helpers.spreadByCategory = getSpreadByCategory(data, config.posBy1, config.posBy2);
        }
        if (type1 === DataType.Categorical && type2 === DataType.Numeric) {
            helpers.spreadByCategory = getSpreadByCategory(data, config.posBy2, config.posBy1);
        }
        if (type1 === DataType.Numeric && !type2) {
            helpers.spreadByCategory = getSpreadByCategory(data, config.posBy1, null);
        }
        if (type1 === DataType.Categorical && type2 === DataType.Categorical) {
            helpers.plates = getPlatesChartHelpers(data, config, helpers, identifier);
        }
        if (type1 === DataType.Categorical && !type2 || type2 === DataType.Categorical && !type1) {
            // bar charts are in fact a one dimensional plate chart, same code works for both
            helpers.plates = getPlatesChartHelpers(data, config, helpers, identifier);
        }

        // SIZE - set range
        if (config.sizeBy) {
            helpers.sizeRange = getRangeBy(data, config.sizeBy);
            sizeRange = helpers.sizeRange.max - helpers.sizeRange.min;
        }
        
        // COLOR - clear
        colorScale = {};

        if (config.colorBy) {
            bubbles.sort((a, b) => a.data[config.colorBy].localeCompare(b.data[config.colorBy]) );
        } else {
            bubbles.sort((a, b) => a.data[config.posBy1].localeCompare(b.data[config.posBy1]) );
        }        
        
        // BUBBLES - init, set color and size
        bubbles = data.map(d => {
            // COLOR - set
            if (config.colorBy && !colorScale[d[config.colorBy]]) {
                colorScale[d[config.colorBy]] = COLORS[colorIndex % COLORS.length];
                colorIndex++;
            }
            // SIZE - size bubbles unless it's treemap layout
            // square root used to keep the area proportionnal to the value)
            const size = config.sizeBy && !(type1 === DataType.Categorical && type2 === DataType.Categorical) ?
                Math.max(MIN_BUBBLE_SIZE,
                    Math.sqrt(((d[config.sizeBy] - helpers.sizeRange.min) / sizeRange) * Math.pow(MAX_BUBBLE_SIZE, 2)) 
                )
                : DEFAULT_BUBBLE_SIZE;
            return {
                id: d[identifier],
                x: 0,
                y: 0,
                data: d,
                color: config.colorBy ? colorScale[d[config.colorBy]] : 'rgba(70, 130, 180, 1)',
                width: size,
                height: size,
            };
        });

        const ANIMATION_DELAY = bubbles.length > 1000 ? 750 : 100;

        // BUBBLES - set new positions
        // scatterplot
        if (type1 === DataType.Numeric && type2 === DataType.Numeric) {
            bubbles = scatterPlotBubbles(bubbles, config, helpers);
        }
        // boxplot
        else if (type1 === DataType.Numeric && type2 === DataType.Categorical) {
            bubbles = boxPlotsBubbles(bubbles, config.posBy1, config.posBy2, helpers);
        }
        else if (type1 === DataType.Categorical && type2 === DataType.Numeric) {
            bubbles = boxPlotsBubbles(bubbles, config.posBy2, config.posBy1, helpers);
        }
        else if (type1 === DataType.Numeric && !type2) {
            bubbles = boxPlotsBubbles(bubbles, config.posBy1, null, helpers);
        }
        // plates
        else if (type1 === DataType.Categorical && type2 === DataType.Categorical) {
            bubbles = platesBubbles(bubbles, config, helpers);
        }
        // bars
        else if (type1 === DataType.Categorical && !type2 || type2 === DataType.Categorical && !type1) {
            bubbles = platesBubbles(bubbles, config, helpers);
        }
        // random
        else {            
            bubbles = randomPos(bubbles, helpers);
        }

        // ANIMATION - loop function
        const startTime = new Date().getTime();
        let frames = 0;  

        function draw() {
            const now = new Date().getTime();            

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const animationProgress = Math.min(1, (now - startTime) / ANIMATION_DURATION);
            const delayedProgress = Math.min(1, (now - startTime - ANIMATION_DELAY) / ANIMATION_DURATION);            
            
            // tween position and size
            bubbles.forEach((d, i) => {
                const delay = ANIMATION_DELAY * (i / bubbles.length);                
                const localProgress = Math.min(1, (now - startTime - delay) / ANIMATION_DURATION);
                ctx.fillStyle = d.color;
                const old = oldBubblesValues[d.id] || {x: 0, y: 0, width: DEFAULT_BUBBLE_SIZE, height: DEFAULT_BUBBLE_SIZE};
                const newX = old.x + (d.x - old.x) * localProgress;
                const newY = old.y + (d.y - old.y) * localProgress;
                const newW = old.width + (d.width - old.width) * animationProgress;
                const newH = old.height + (d.height - old.height) * animationProgress;
                ctx.fillRect(newX, newY, newW, newH);                
            });

            // tween helpers
            if (type1 === DataType.Numeric && type2 === DataType.Numeric) {
                scatterPlotAxis(ctx, helpers, oldHelpers, animationProgress);
            }
            else if (type1 === DataType.Numeric && type2 === DataType.Categorical) {
                boxPlotsAxis(ctx, helpers, oldHelpers, animationProgress, config.posBy1, config.posBy2);
            }
            else if (type1 === DataType.Categorical && type2 === DataType.Numeric) {
                boxPlotsAxis(ctx, helpers, oldHelpers, animationProgress, config.posBy2, config.posBy1);
            }
            else if (type1 === DataType.Numeric && !type2) {
                boxPlotsAxis(ctx, helpers, oldHelpers, animationProgress, config.posBy1, null);
            }
            else if (type1 === DataType.Categorical && type2 === DataType.Categorical) {
                platesAxis(ctx, helpers);
            }
            else if (type1 === DataType.Categorical && !type2 || type2 === DataType.Categorical && !type1) {
                platesAxis(ctx, helpers);
            }

            // legend (TODO: no need to redraw this on every frame)
            if (config.colorBy) {
                colorLegend(ctx, colorScale);
            }
            
            
            frames++;

            if (delayedProgress < 1) {
                window.requestAnimationFrame(draw);
            } else {
                console.log('frames', frames, ' ms ', new Date().getTime() - startTime);
                onDrawFinished();
            }     
        }
        
        // ANIMATION - on end of animation:
        // - memorize previous values
        // - draw helpers we want to hide during the animation
        function onDrawFinished() {            
            oldHelpers.spreadX = { ...helpers.spreadX };
            oldHelpers.spreadY = { ...helpers.spreadY };
            oldHelpers.spreadByCategory = { ...helpers.spreadByCategory }; 
            
            oldBubblesValues = {};
            bubbles.forEach(d => {
                oldBubblesValues[d.id] = d;
            });            
        }

        // ANIMATION - start loop
        draw();
        
        oldConfig = config;

    };
    
};

function colorLegend(ctx, colorScale) {
    ctx.font = '14px Arial';
    ctx.textAlign = "start"; 
    Object.entries(colorScale).forEach((c, i) => {
        ctx.fillStyle = c[1];            
        ctx.fillRect(25 + i * 120, 5, 10, 10);
        ctx.fillStyle = '#333';
        ctx.fillText(c[0], 40 + i * 120, 15);
    });
}

function randomPos(data : Bubble[], helpers) : Bubble[] {
    return data.map((d, i) => mapRandom(i, d, helpers));
}

function mapRandom(i : number, d : Bubble, helpers) : Bubble {
    const { width, height, margin } = helpers; 
    return {
        ...d,
        x: Math.floor(Math.random()*width) + margin.left,
        y: Math.floor(Math.random()*height) + margin.top,
    };
}

function platesBubbles(bubbles : Bubble[], config : ChartConfig, helpers : Helpers) : Bubble[] {

    const { plates } = helpers;

    const treeMapData = {};

    Object.values(plates).forEach(plate => {        
        const rects = getTreemap(plate.leafs, plate.weightRelative * plate.width, plate.height, plate.weight);        
        rects.forEach(r => {
            treeMapData[r.id] = {
                ...r,
                x: plate.xPos + r.x,
                y: plate.yPos + r.y,
            };
        });
    });    

    const result = bubbles.map((d, i) => {
        return {
            ...d,
            x: treeMapData[d.id].x,
            y: treeMapData[d.id].y,
            width: treeMapData[d.id].width,
            height: treeMapData[d.id].height,
        }
    });

    return result;
}

function getPlatesChartHelpers(data, config: ChartConfig, helpers : Helpers, identifier) : { [key: string] : Plate } {

    const { width, height, margin } = helpers;

    const isBarChart = !config.posBy2;
    
    const axisSize = INNER_MARGINS_PLATES;
    const fullWidth = width + margin.left + margin.right;
    const innerWidth = fullWidth - axisSize.left - margin.right;
    const innerHeight = height - axisSize.bottom;    

    const plates : { [key: string] : Plate } = {};
    const xCategories = {};
    const yCategories = {};
    const platesGroups = {};

    let maxWeight = Number.NEGATIVE_INFINITY;

    data.forEach(d => {
        const name = d[config.posBy2] + d[config.posBy1];
        if (!plates[name]) {
            plates[name] = {
                xPos: 0,
                yPos: 0,
                xLabel: d[config.posBy2],
                yLabel: d[config.posBy1],
                weight: 0,
                weightRelative: 0,
                width: 0,
                height: 0,
                leafs: [],
            }
            platesGroups[name] = config.colorBy ? {} : { default: [] };
        }
        if (config.sizeBy) {            
            plates[name].weight += d[config.sizeBy];
        } else {
            plates[name].weight++;
        }        
        if (config.colorBy) {
            if (!platesGroups[name][d[config.colorBy]]) {                
                platesGroups[name][d[config.colorBy]] = [];
            }
            platesGroups[name][d[config.colorBy]].push({ id: d[identifier], value: config.sizeBy ? d[config.sizeBy] : 1 });
        } else {
            platesGroups[name].default.push({ id: d[identifier] , value: config.sizeBy ? d[config.sizeBy] : 1 });
        }
    });

    const sorting = isBarChart ? 
        (a, b) => { return b.weight - a.weight }
        :
        (a, b) => { return b.xLabel - a.xLabel }    
    ;

    Object.values(plates).sort(sorting).forEach(p => {
        if (xCategories[p.xLabel] === undefined) {
            xCategories[p.xLabel] = Object.values(xCategories).length;
        }
        if (yCategories[p.yLabel] === undefined) {
            yCategories[p.yLabel] = Object.values(yCategories).length;
        }
        p.xPos = xCategories[p.xLabel];
        p.yPos = yCategories[p.yLabel];
        if (p.weight > maxWeight) {
            maxWeight = p.weight;
        }
        // @ts-ignore
        p.leafs = Object.entries(platesGroups[p.xLabel+p.yLabel]).map(g => {
            return {
                id: g[0],
                // @ts-ignore
                value: g[1].reduce((agg, curr) => { agg += curr.value; return agg; }, 0),
                children: g[1],
            };
        });
    });

    const plateHeight = isBarChart ? Math.min(MAX_PLATE_HEIGHT, innerHeight / Object.values(yCategories).length) : innerHeight / Object.values(yCategories).length;
    const plateWidth = innerWidth / Object.values(xCategories).length;
    
    Object.values(plates).sort(sorting).forEach((p, i) => {
        p.xPos = axisSize.left + p.xPos * plateWidth;
        p.yPos = margin.top + p.yPos * plateHeight + (isBarChart ? i : 0);
        p.width = plateWidth;
        p.height = plateHeight;
        p.weightRelative = p.weight / maxWeight;
    });    
   
    return plates;
}

function platesAxis(ctx, helpers : Helpers) {
    const { width, height, margin, plates } = helpers;
    const axisSize = INNER_MARGINS_PLATES;
    const xLabels = {};
    const yLabels = {};
    
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
        
    Object.values(plates).forEach(p => {
        // draw rectangles only for 2 dims plate charts, not simple bars
        if (p.xLabel) {
            ctx.fillRect(p.xPos, p.yPos, p.width, 1);
            ctx.fillRect(p.xPos, p.yPos + p.height, p.width, 1);       
            ctx.fillRect(p.xPos, p.yPos, 1, p.height);
            ctx.fillRect(p.xPos + p.width, p.yPos, 1, p.height);
        }        
        if (!yLabels[p.yLabel]) {                        
            ctx.fillText(p.yLabel, axisSize.left / 2, p.yPos + p.height / 2);
            yLabels[p.yLabel] = true;
        }  
        if (p.xLabel && !xLabels[p.xLabel]) {                        
            ctx.fillText(p.xLabel, p.xPos + p.width / 2, height + margin.top);
            xLabels[p.xLabel] = true;
        }        
    });
}

function scatterPlotBubbles(bubbles : Bubble[], config : ChartConfig, helpers : Helpers) : Bubble[] {

    const { width, height, margin, spreadX, spreadY } = helpers;    
   
    const axisSize = INNER_MARGINS_BOXPLOTS;

    const innerWidth = width - axisSize.left;
    const innerHeight = height - axisSize.bottom;

    function scaleX(v) {
        return axisSize.left + margin.left + (v - spreadX.min) / (spreadX.max - spreadX.min) * innerWidth;
    }

    function scaleY(v) {
        return margin.top + innerHeight - (v - spreadY.min) / (spreadY.max - spreadY.min) * innerHeight;
    }

    // get new bubble positions
    const result = bubbles.map((d, i) => {
        return {
            ...d,
            x: scaleX(d.data[config.posBy1]) - d.width/2,
            y: scaleY(d.data[config.posBy2]) - d.height/2,
        }
    });

    return result;
}

function scatterPlotAxis(ctx, helpers : Helpers, oldHelpers : Helpers, animationProgress : number) {

    const { width, height, margin, spreadX, spreadY } = helpers;
    const { spreadX: oldSpreadX, spreadY: oldSpreadY } = oldHelpers;
    
    const minX = animationProgress * spreadX.min + (1-animationProgress) * (oldSpreadX.min || 0);
    const maxX = animationProgress * spreadX.max + (1-animationProgress) * (oldSpreadX.max || 0);
    const minY = animationProgress * spreadY.min + (1-animationProgress) * (oldSpreadY.min || 0);
    const maxY = animationProgress * spreadY.max + (1-animationProgress) * (oldSpreadY.max || 0);
   
    const axisSize = INNER_MARGINS_BOXPLOTS;

    const innerWidth = width - axisSize.left;
    const innerHeight = height - axisSize.bottom;

    function scaleX(v) {
        return axisSize.left + margin.left + (v - minX) / (maxX - minX) * innerWidth;
    }

    function scaleY(v) {
        return margin.top + innerHeight - (v - minY) / (maxY - minY) * innerHeight;
    }

    const fullHeight = height + margin.top - axisSize.bottom + 30;
    

    // draw helper elements
    ctx.fillStyle = '#333';
    ctx.fillRect(scaleX(spreadX.min), fullHeight, scaleX(spreadX.max) - scaleX(spreadX.min), 1);
    ctx.fillRect(scaleX(spreadX.q1), fullHeight - 1, scaleX(spreadX.q3) - scaleX(spreadX.q1), 3);

    ctx.fillRect(axisSize.left - 20, scaleY(spreadY.min), 1, scaleY(spreadY.max) - scaleY(spreadY.min));
    ctx.fillRect(axisSize.left - 21, scaleY(spreadY.q1), 3, scaleY(spreadY.q3) - scaleY(spreadY.q1));    

    ctx.fillStyle = '#fff';
    ctx.fillRect(scaleX(spreadX.med)-2, fullHeight - 1, 4, 3);
    ctx.fillRect(axisSize.left - 21, scaleY(spreadY.med)-2, 3, 4);

    ctx.font = '14px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = "center"; 
    ctx.fillText(spreadX.min, scaleX(spreadX.min), fullHeight + 18);
    ctx.fillText(spreadX.max, scaleX(spreadX.max), fullHeight + 18);
    ctx.fillText(spreadX.q1, scaleX(spreadX.q1), fullHeight + 18);
    ctx.fillText(spreadX.q3, scaleX(spreadX.q3), fullHeight + 18);
    ctx.fillText(spreadX.med, scaleX(spreadX.med), fullHeight + 18);

    ctx.textAlign = "end"; 
    ctx.fillText(spreadY.min, axisSize.left - 30, 4 + scaleY(spreadY.min));
    ctx.fillText(spreadY.max, axisSize.left - 30, 4 + scaleY(spreadY.max));
    ctx.fillText(spreadY.q1, axisSize.left - 30, 4 + scaleY(spreadY.q1));
    ctx.fillText(spreadY.q3, axisSize.left - 30, 4 + scaleY(spreadY.q3));
    ctx.fillText(spreadY.med, axisSize.left - 30, 4 + scaleY(spreadY.med));

}

function boxPlotsBubbles(bubbles : Bubble[], spreadBy : string, categorizeBy : string, helpers : Helpers) : Bubble[] {

    const { width, height, margin, spreadByCategory } = helpers;

    const axisSize = INNER_MARGINS_BOXPLOTS;
    const innerHeight = height - axisSize.bottom;

    const categoryCount = Object.values(spreadByCategory).length;
    const categoryConfig = {};
    
    Object.keys(spreadByCategory).sort().forEach((c, i) => { 
        categoryConfig[c] = { label: c, order: i }; 
    });    

    let lowest = Number.POSITIVE_INFINITY;
    let highest = Number.NEGATIVE_INFINITY;
    
    Object.values(spreadByCategory).forEach(spread => {
        if (spread.min < lowest) { lowest = spread.min };
        if (spread.max > highest) { highest = spread.max };
    });
   
    function scaleX(category, value) {
        return axisSize.left + margin.left + categoryConfig[category].order * (width / categoryCount);
    }

    function scaleY(v) {
        return margin.top + innerHeight - (v - lowest) / (highest - lowest) * innerHeight;
    }    

    // get new bubble positions
    const result = bubbles.map((d, i) => {
        return {
            ...d,
            x: scaleX(d.data[categorizeBy], d.data[spreadBy]) - d.width/2,
            y: scaleY(d.data[spreadBy]) - d.height/2,
        }
    });  

    return result;
}

function boxPlotsAxis(ctx, helpers : Helpers, oldHelpers : Helpers, animationProgress : number, spreadBy : string, categorizeBy : string) {
    const { width, height, margin, spreadByCategory } = helpers;      

    const axisSize = INNER_MARGINS_BOXPLOTS;
    const innerHeight = height - axisSize.bottom;

    const categoryCount = Object.values(spreadByCategory).length;
    const categoryConfig = {};
    
    Object.keys(spreadByCategory).sort().forEach((c, i) => { 
        categoryConfig[c] = { label: c, order: i }; 
    });    

    let lowest = Number.POSITIVE_INFINITY;
    let highest = Number.NEGATIVE_INFINITY;
    
    Object.values(spreadByCategory).forEach(spread => {
        if (spread.min < lowest) { lowest = spread.min };
        if (spread.max > highest) { highest = spread.max };
    });

    // TODO: doesn't have to be recomputed each frame
    const oldSpread = oldHelpers.spreadByCategory;
    let oldLowest = Number.POSITIVE_INFINITY;
    let oldHighest = Number.NEGATIVE_INFINITY;
    
    if (oldSpread && oldSpread.min) {
        Object.values(oldSpread).forEach(spread => {
            if (spread.min < oldLowest) { oldLowest = spread.min };
            if (spread.max > oldHighest) { oldHighest = spread.max };
        });
    } else {
        oldLowest = oldHighest = null;
    }    

    const min = animationProgress * lowest + (1-animationProgress) * (oldLowest || 0);
    const max = animationProgress * highest + (1-animationProgress) * (oldHighest || 0);
   
    function scaleX(category) {
        return Math.floor(axisSize.left + margin.left + categoryConfig[category].order * (width / categoryCount));
    }

    function scaleY(v) {
        return margin.top + innerHeight - (v - min) / (max - min) * innerHeight;
    }    

    Object.entries(spreadByCategory).forEach(category => {        
        const name = category[0];
        const spread = category[1];

        ctx.fillStyle = '#555';
        ctx.fillRect(scaleX(name) - 20, scaleY(spread.min), 1, scaleY(spread.max) - scaleY(spread.min));
        ctx.fillRect(scaleX(name) - 22, scaleY(spread.q1), 5, scaleY(spread.q3) - scaleY(spread.q1));    

        ctx.fillStyle = '#fff';
        ctx.fillRect(scaleX(name) - 23, scaleY(spread.med)-2, 7, 3);

        ctx.font = '14px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = "end"; 
        ctx.fillText(spread.min, scaleX(name) - 30, 4 + scaleY(spread.min));
        ctx.fillText(spread.max, scaleX(name) - 30, 4 + scaleY(spread.max));
        ctx.fillText(spread.q1, scaleX(name) - 30, 4 + scaleY(spread.q1));
        ctx.fillText(spread.q3, scaleX(name) - 30, 4 + scaleY(spread.q3));
        ctx.fillText(spread.med, scaleX(name) - 30, 4 + scaleY(spread.med));
        
        if (name && name !== "undefined") {
            ctx.textAlign = "center"; 
            ctx.fillText(name, scaleX(name) - 15, height);
        }        
    });

}

export const getDefaultConfig = function() : ChartConfig {
    return {
        colorBy: null,
        sizeBy: null,
        posBy1: null,
        posBy2: null,
        chartType: null,
    };
}

