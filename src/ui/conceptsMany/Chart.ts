import { Attribute, DataType } from "../../model";
import { getSpread, getSpreadByCategory, Spread, Range, getRangeBy } from "../../utils";

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

export interface Helpers {
    spreadX: Spread;
    spreadY: Spread;
    spreadByCategory: { [key: string] : Spread },
    sizeRange: Range;
    width: number;
    height: number;
    margin: {
        top: number,
        bottom: number,
        right: number,
        left: number,
    };
}

const ANIMATION_DURATION = 750;
const INNER_MARGINS = {
    left: 100,
    bottom: 70,
};
const COLORS = ['#0366d6', '#ff7f00', '#25a221', '#d8281f', '#9563bf', '#8d5549', '#e574c4', '#7f7f7f', '#bcbe00', '#00bed0', '#1c9e77', '#da5f03', '#756fb3', '#e8298a', '#66a61e', '#e7ab01', '#a6751e'];
const MIN_BUBBLE_SIZE = 1;
const MAX_BUBBLE_SIZE = 50;
const DEFAULT_BUBBLE_SIZE = 10;

export const bubbleChart = function() {
    const canvas = <HTMLCanvasElement> document.getElementById("canvas");
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

        // SIZE - set range
        if (config.sizeBy) {
            helpers.sizeRange = getRangeBy(data, config.sizeBy);
            sizeRange = helpers.sizeRange.max - helpers.sizeRange.min;
        }
        
        // COLOR - clear
        if (oldConfig.colorBy !== config.colorBy) {
            colorScale = {};
        }
        
        // BUBBLES - init, set color and size
        bubbles = data.map(d => {
            // COLOR - set
            if (config.colorBy && !colorScale[d[config.colorBy]]) {
                colorScale[d[config.colorBy]] = COLORS[colorIndex % COLORS.length];
                colorIndex++;
            }
            // SIZE - set
            const size = config.sizeBy ? Math.max(MIN_BUBBLE_SIZE, (d[config.sizeBy] - helpers.sizeRange.min) / sizeRange * MAX_BUBBLE_SIZE) : DEFAULT_BUBBLE_SIZE;
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

        // BUBBLES - set new positions
        // scatterplot
        if (type1 === DataType.Numeric && type2 === DataType.Numeric) {
            bubbles = scatterPlotBubbles(bubbles, config, helpers);
        }
        else if (type1 === DataType.Numeric && type2 === DataType.Categorical) {
            bubbles = boxPlotsBubbles(bubbles, config.posBy1, config.posBy2, helpers);
        }
        else if (type1 === DataType.Categorical && type2 === DataType.Numeric) {
            bubbles = boxPlotsBubbles(bubbles, config.posBy2, config.posBy1, helpers);
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
            const animationProgress = Math.min(1, (now - startTime) / ANIMATION_DURATION);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // tween position and size
            bubbles.forEach(d => {
                ctx.fillStyle = d.color;
                const old = oldBubblesValues[d.id] || {x: 0, y: 0, width: DEFAULT_BUBBLE_SIZE, height: DEFAULT_BUBBLE_SIZE};
                const newX = old.x + (d.x - old.x) * animationProgress;
                const newY = old.y + (d.y - old.y) * animationProgress;
                const newW = old.width + (d.width - old.width) * animationProgress;
                const newH = old.height + (d.height - old.height) * animationProgress;
                ctx.fillRect(newX, newY, newW, newH);                
            });

            // tween helpers
            if (type1 === DataType.Numeric && type2 === DataType.Numeric) {
                scatterPlotAxis(ctx, helpers, oldHelpers, animationProgress);
            } else if (type1 === DataType.Numeric && type2 === DataType.Categorical ||
                type1 === DataType.Categorical && type2 === DataType.Numeric
            ) {
                boxPlotsAxis(ctx, helpers, oldHelpers, animationProgress);
            }

            // legend (TODO: no need to redraw this on every frame)
            if (config.colorBy) {
                colorLegend(ctx, colorScale);
            }
            
            frames++;

            if (animationProgress < 1) {
                window.requestAnimationFrame(draw);
            } else {
                console.log('frames', frames, ' ms ', new Date().getTime() - startTime);
                onDrawFinished();
            }     
        }
        
        // ANIMATION - on end of animation, memorize previous values
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
        ctx.fillRect(25 + i * 100, 5, 10, 10);
        ctx.fillStyle = '#333';
        ctx.fillText(c[0], 40 + i * 100, 15);
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

function scatterPlotBubbles(bubbles : Bubble[], config : ChartConfig, helpers : Helpers) : Bubble[] {

    const { width, height, margin, spreadX, spreadY } = helpers;    
   
    const axisSize = INNER_MARGINS;

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
   
    const axisSize = INNER_MARGINS;

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

    const axisSize = INNER_MARGINS;
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
   
    function scaleX(category) {
        return axisSize.left + margin.left + categoryConfig[category].order * (width / categoryCount);
    }

    function scaleY(v) {
        return margin.top + innerHeight - (v - lowest) / (highest - lowest) * innerHeight;
    }    

    // get new bubble positions
    const result = bubbles.map((d, i) => {
        return {
            ...d,
            x: scaleX(d.data[categorizeBy]) - d.width/2,
            y: scaleY(d.data[spreadBy]) - d.height/2,
        }
    });    

    return result;
}

function boxPlotsAxis(ctx, helpers : Helpers, oldHelpers : Helpers, animationProgress : number) {

    // const { width, height, margin, spreadX, spreadY } = helpers;
    // const { spreadX: oldSpreadX, spreadY: oldSpreadY } = oldHelpers;
    
    // const minX = animationProgress * spreadX.min + (1-animationProgress) * (oldSpreadX.min || 0);
    // const maxX = animationProgress * spreadX.max + (1-animationProgress) * (oldSpreadX.max || 0);
    // const minY = animationProgress * spreadY.min + (1-animationProgress) * (oldSpreadY.min || 0);
    // const maxY = animationProgress * spreadY.max + (1-animationProgress) * (oldSpreadY.max || 0);
   
    // const axisSize = INNER_MARGINS;

    // const innerWidth = width - axisSize.left;
    // const innerHeight = height - axisSize.bottom;

    // function scaleX(v) {
    //     return axisSize.left + margin.left + (v - minX) / (maxX - minX) * innerWidth;
    // }

    // function scaleY(v) {
    //     return margin.top + innerHeight - (v - minY) / (maxY - minY) * innerHeight;
    // }

    // const fullHeight = height + margin.top - axisSize.bottom + 30;
    

    // // draw helper elements
    // ctx.fillStyle = '#333';
    // ctx.fillRect(scaleX(spreadX.min), fullHeight, scaleX(spreadX.max) - scaleX(spreadX.min), 1);
    // ctx.fillRect(scaleX(spreadX.q1), fullHeight - 1, scaleX(spreadX.q3) - scaleX(spreadX.q1), 3);

    // ctx.fillRect(axisSize.left - 20, scaleY(spreadY.min), 1, scaleY(spreadY.max) - scaleY(spreadY.min));
    // ctx.fillRect(axisSize.left - 21, scaleY(spreadY.q1), 3, scaleY(spreadY.q3) - scaleY(spreadY.q1));    

    // ctx.fillStyle = '#fff';
    // ctx.fillRect(scaleX(spreadX.med)-2, fullHeight - 1, 4, 3);
    // ctx.fillRect(axisSize.left - 21, scaleY(spreadY.med)-2, 3, 4);

    // ctx.font = '14px Arial';
    // ctx.fillStyle = '#333';
    // ctx.textAlign = "center"; 
    // ctx.fillText(spreadX.min, scaleX(spreadX.min), fullHeight + 18);
    // ctx.fillText(spreadX.max, scaleX(spreadX.max), fullHeight + 18);
    // ctx.fillText(spreadX.q1, scaleX(spreadX.q1), fullHeight + 18);
    // ctx.fillText(spreadX.q3, scaleX(spreadX.q3), fullHeight + 18);
    // ctx.fillText(spreadX.med, scaleX(spreadX.med), fullHeight + 18);

    // ctx.textAlign = "end"; 
    // ctx.fillText(spreadY.min, axisSize.left - 30, 4 + scaleY(spreadY.min));
    // ctx.fillText(spreadY.max, axisSize.left - 30, 4 + scaleY(spreadY.max));
    // ctx.fillText(spreadY.q1, axisSize.left - 30, 4 + scaleY(spreadY.q1));
    // ctx.fillText(spreadY.q3, axisSize.left - 30, 4 + scaleY(spreadY.q3));
    // ctx.fillText(spreadY.med, axisSize.left - 30, 4 + scaleY(spreadY.med));

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

