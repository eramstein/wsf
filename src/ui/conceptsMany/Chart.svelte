<script>
    import { State } from '../../stores';
    import { onMount } from 'svelte';

    const bubbleChart = function() {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext('2d');
        canvas.style.width ='100%';
        canvas.width  = canvas.offsetWidth;
        canvas.height = document.body.clientHeight - 40;

        console.log(canvas);
        
        
        let _this = this;       

        const margin = { top: 10, right: 10, bottom: 10, left: 10 };

        let width = canvas.width - margin.right - margin.left;
        let height = canvas.height - margin.top - margin.bottom;

        _this.build = function() {

            console.log('BUILD CHART');     

        };

        _this.update = function(data) {

            console.log('UPDATE CHART');

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'rgba(70, 130, 180, 0.5)';

            data.forEach(d => {
                ctx.fillRect(Math.floor(Math.random()*width), Math.floor(Math.random()*height), 10, 10);
            });

        };
    }

    let chart;

    onMount(() => {
		chart = new bubbleChart();
        chart.build();
    });
    
    $: {
        if (chart) {
            chart.update($State.ui.filteredItems);
        }        
    }

</script>

<style>
    .chart {
        width: 100%;
        height: 100%;
    }
</style>

<div id="chart" class="chart">
    <canvas id="canvas"></canvas>
</div>

