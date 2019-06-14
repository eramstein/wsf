import { Attribute, DataType } from "../../model";
import { getSpreadBy, Spread } from "../../utils";

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

export const bubbleChart = function() {
    const canvas = <HTMLCanvasElement> document.getElementById("canvas");
    const ctx = canvas.getContext('2d');
    canvas.style.width ='100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = document.body.clientHeight - 110; // TODO: magic number which is the 2 menus height on top    
    
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    let bubbleMap : { [key: string] : Bubble } = {};

    const helpers = <Helpers>{
        margin, 
        width: canvas.width - margin.right - margin.left,
        height: canvas.height - margin.top - margin.bottom,
    };

    let oldHelpers = <Helpers>{
        spreadX: { min: 0, max: 0, med: 0, q1: 0, q3: 0 },
        spreadY: { min: 0, max: 0, med: 0, q1: 0, q3: 0 },
    };
    

    this.build = function() {

        console.log('BUILD CHART');     

    };

    this.update = function(data : [any], config : ChartConfig, attributes : { [key: string] : Attribute }) {

        helpers.spreadX = getSpreadBy(data, config.posBy1);
        helpers.spreadY = getSpreadBy(data, config.posBy2);

        console.log('UPDATE CHART');        

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const type1 = attributes[config.posBy1] && attributes[config.posBy1].type;
        const type2 = attributes[config.posBy2] && attributes[config.posBy2].type;
        const identifier = Object.entries(attributes).filter(a => a[1].type === DataType.Identifier).map(a => a[0])[0];

        let bubbles : Bubble[] = [];

        bubbles = data.map(d => {
            return {
                id: d[identifier],
                x: 0,
                y: 0,
                data: d,
                color: 'rgba(70, 130, 180, 0.5)',
                width: 10,
                height: 10,
            };
        });        

        if (type1 === DataType.Numeric && type2 === DataType.Numeric) {
            bubbles = scatterPlotBubbles(bubbles, config, helpers);
        }
        else {
            bubbles = randomPos(bubbles, helpers);
        }        

        const startTime = new Date().getTime();
        let frames = 0;       

        function draw() {
            const now = new Date().getTime();
            const animationProgress = Math.min(1, (now - startTime) / ANIMATION_DURATION);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            bubbles.forEach(d => {
                ctx.fillStyle = d.color;
                const old = bubbleMap[d.id] || {x: 0, y: 0};
                const newX = old.x + (d.x - old.x) * animationProgress;
                const newY = old.y + (d.y - old.y) * animationProgress;
                ctx.fillRect(newX, newY, d.width, d.height);                
            });

            if (type1 === DataType.Numeric && type2 === DataType.Numeric) {
                scatterPlotAxis(ctx, helpers, oldHelpers, animationProgress);
            }
            
            frames++;

            if (animationProgress < 1) {
                window.requestAnimationFrame(draw);
            } else {
                console.log('frames', frames, ' ms ', new Date().getTime() - startTime);
                onDrawFinished();
            }     
        }
        
        function onDrawFinished() {
            oldHelpers.spreadX = { ...helpers.spreadX };
            oldHelpers.spreadY = { ...helpers.spreadY };
            bubbleMap = {};
            bubbles.forEach(d => {
                bubbleMap[d.id] = d;
            });
        }

        draw();       

    };
};

function randomPos(data : Bubble[], helpers) : Bubble[] {
    return data.map((d, i) => mapRandom(i, d, helpers.width, helpers.height));
}

function scatterPlotBubbles(bubbles : Bubble[], config : ChartConfig, helpers : Helpers) : Bubble[] {

    const { width, height, margin, spreadX, spreadY } = helpers;    
   
    const axisSize = { left: 60, bottom: 60 };

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
    
    const minX = animationProgress * spreadX.min + (1-animationProgress) * oldSpreadX.min;
    const maxX = animationProgress * spreadX.max + (1-animationProgress) * oldSpreadX.max;
    const minY = animationProgress * spreadY.min + (1-animationProgress) * oldSpreadY.min;
    const maxY = animationProgress * spreadY.max + (1-animationProgress) * oldSpreadY.max;
   
    const axisSize = { left: 60, bottom: 60 };

    const innerWidth = width - axisSize.left;
    const innerHeight = height - axisSize.bottom;

    function scaleX(v) {
        return axisSize.left + margin.left + (v - minX) / (maxX - minX) * innerWidth;
    }

    function scaleY(v) {
        return margin.top + innerHeight - (v - minY) / (maxY - minY) * innerHeight;
    }

    // draw helper elements
    ctx.fillStyle = '#333';
    ctx.fillRect(scaleX(spreadX.min), height, scaleX(spreadX.max) - scaleX(spreadX.min), 1);
    ctx.fillRect(scaleX(spreadX.q1), height - 1, scaleX(spreadX.q3) - scaleX(spreadX.q1), 3);

    ctx.fillRect(axisSize.left - 20, scaleY(spreadY.min), 1, scaleY(spreadY.max) - scaleY(spreadY.min));
    ctx.fillRect(axisSize.left - 21, scaleY(spreadY.q1), 3, scaleY(spreadY.q3) - scaleY(spreadY.q1));    

    ctx.fillStyle = '#fff';
    ctx.fillRect(scaleX(spreadX.med)-2, height - 1, 4, 3);
    ctx.fillRect(axisSize.left - 21, scaleY(spreadY.med)-2, 3, 4);

    ctx.font = '14px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = "center"; 
    ctx.fillText(spreadX.min, scaleX(spreadX.min), height + 18);
    ctx.fillText(spreadX.max, scaleX(spreadX.max), height + 18);
    ctx.fillText(spreadX.q1, scaleX(spreadX.q1), height + 18);
    ctx.fillText(spreadX.q3, scaleX(spreadX.q3), height + 18);
    ctx.fillText(spreadX.med, scaleX(spreadX.med), height + 18);

    ctx.textAlign = "end"; 
    ctx.fillText(spreadY.min, axisSize.left - 30, 4 + scaleY(spreadY.min));
    ctx.fillText(spreadY.max, axisSize.left - 30, 4 + scaleY(spreadY.max));
    ctx.fillText(spreadY.q1, axisSize.left - 30, 4 + scaleY(spreadY.q1));
    ctx.fillText(spreadY.q3, axisSize.left - 30, 4 + scaleY(spreadY.q3));
    ctx.fillText(spreadY.med, axisSize.left - 30, 4 + scaleY(spreadY.med));

}

function mapRandom(i : number, d : Bubble, width : number, height: number) : Bubble {    
    return {
        ...d,
        x: Math.floor(Math.random()*width),
        y: Math.floor(Math.random()*height),
    };
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

