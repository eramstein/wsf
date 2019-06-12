import { State } from '../../stores';
import { get } from "svelte/store";

export interface ChartConfig {
    colorBy: string;
    sizeBy: string;
    posBy1: string;
    posBy2: string;
    chartType: string;
}

export interface ChartData {
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
    canvas.height = document.body.clientHeight - 100; // TODO: magic number which is the 2 menus height on top    
    
    let _this = this;       

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };

    let width = canvas.width - margin.right - margin.left;
    let height = canvas.height - margin.top - margin.bottom;

    _this.build = function() {

        console.log('BUILD CHART');     

    };

    _this.update = function(data : [any]) {

        console.log('UPDATE CHART');

        const config = get(State).ui.chartConfig;

        ctx.clearRect(0, 0, canvas.width, canvas.height);        

        const chartData = data.map(d => mapChartData(d, config, width, height));

        chartData.forEach(d => {
            ctx.fillStyle = d.color;
            ctx.fillRect(d.x, d.y, d.size, d.size);
        });

    };
};

function mapChartData(d : {any}, config : ChartConfig, width : number, height: number) : ChartData {    
    return {
        x: Math.floor(Math.random()*width),
        y: Math.floor(Math.random()*height),
        targetX: 0,
        targetY: 0,
        color: 'rgba(70, 130, 180, 0.5)',
        size: 10,
        data: d,
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

