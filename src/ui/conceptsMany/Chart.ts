import { Attribute, DataType } from "../../model";
import { getSpreadBy } from "../../utils";

export interface ChartConfig {
    colorBy: string;
    sizeBy: string;
    posBy1: string;
    posBy2: string;
    chartType: string;
}

export interface Bubble {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    color: string;
    size: number;
    data: {any};
}

export const bubbleChart = function() {
    const canvas = <HTMLCanvasElement> document.getElementById("canvas");
    const ctx = canvas.getContext('2d');
    canvas.style.width ='100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = document.body.clientHeight - 110; // TODO: magic number which is the 2 menus height on top    
    
    let _this = this;       

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    let width = canvas.width - margin.right - margin.left;
    let height = canvas.height - margin.top - margin.bottom;

    _this.build = function() {

        console.log('BUILD CHART');     

    };

    _this.update = function(data : [any], config : ChartConfig, attributes : { [key: string] : Attribute }) {

        console.log('UPDATE CHART');

        ctx.clearRect(0, 0, canvas.width, canvas.height);        

        let bubbles : Bubble[] = [];
        const type1 = attributes[config.posBy1] && attributes[config.posBy1].type;
        const type2 = attributes[config.posBy2] && attributes[config.posBy2].type;

        bubbles = data.map(d => {
            return {
                x: 0,
                y: 0,
                targetX: 0,
                targetY: 0,
                data: d,
                color: 'rgba(70, 130, 180, 0.5)',
                size: 10,
            };
        });

        if (type1 === DataType.Numeric && type2 === DataType.Numeric) {
            bubbles = scatterPlot(ctx, data, bubbles,  config, width, height, margin);
        }
        else {
            bubbles = randomPos(bubbles, width, height);
        }        

        bubbles.forEach(d => {
            ctx.fillStyle = d.color;
            ctx.fillRect(d.x, d.y, d.size, d.size);
        });

    };
};

function randomPos(data : Bubble[], width, height) : Bubble[] {
    return data.map((d, i) => mapRandom(i, d, width, height));
}

function scatterPlot(ctx, data: [any], bubbles : Bubble[], config : ChartConfig, width : number, height: number, margin) : Bubble[] {
    const spreadX = getSpreadBy(data, config.posBy1);
    const spreadY = getSpreadBy(data, config.posBy2);

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
            x: scaleX(d.data[config.posBy1]) - d.size/2,
            y: scaleY(d.data[config.posBy2]) - d.size/2,
            targetX: 0,
            targetY: 0,            
        }
    });

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

    return result;
}

function mapRandom(i : number, d : Bubble, width : number, height: number) : Bubble {    
    return {
        ...d,
        x: Math.floor(Math.random()*width),
        y: Math.floor(Math.random()*height),
        targetX: 0,
        targetY: 0,
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

