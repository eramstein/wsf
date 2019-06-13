<script>
    import { State } from '../../stores';
    import { onMount } from 'svelte';
    import { DataType } from "../../model";
    import { bubbleChart, getDefaultConfig } from './Chart';
    
    let chart;

    onMount(() => {
		chart = new bubbleChart();
        chart.build();
    });

    const attributes = $State.ui.filterData;
    const quantitativeAttributes = attributes.filter(a => a.type === DataType.Numeric);
    const categoricalAttributes = attributes.filter(a => a.type === DataType.Categorical);

    $: config = $State.ui.chartConfig;

    $: if (!config) {        
        State.updateChartConfig(getDefaultConfig());
    }
    
    $: {
        if (chart) {
            chart.update($State.ui.filteredItems, $State.ui.chartConfig, $State.data.concepts[$State.ui.screenParameters.concept].attributes);
        }        
    }

    function save() {
        State.updateChartConfig(config);
    }

</script>

<style>
    .chart {
        width: 100%;
        height: 100%;
    }
    .config {
        height: 40px;
        display: flex;
        padding: 10px 20px;
    }
    .config div {
        margin-right: 20px;
    }
</style>

<div id="chart" class="chart">
    <div class="config">
        <div>
            <span>Color By </span>
            <select bind:value={$State.ui.chartConfig.colorBy}>
                <option value={null}>
                    -
                </option>
                {#each categoricalAttributes as attribute}
                    <option value={attribute.attribute}>
                        {attribute.attribute}
                    </option>
                {/each}
            </select>
        </div>
        <div>
            <span>Size By </span>
            <select bind:value={$State.ui.chartConfig.sizeBy}>
                <option value={null}>
                    -
                </option>
                {#each quantitativeAttributes as attribute}
                    <option value={attribute.attribute}>
                        {attribute.attribute}
                    </option>
                {/each}
            </select>
        </div>
        <div>
            <span>Position By </span>
            <select bind:value={$State.ui.chartConfig.posBy1}>
                {#each attributes as attribute}
                    <option value={attribute.attribute}>
                        {attribute.attribute}
                    </option>
                {/each}
            </select>
        </div>
        <div>
            <span>And </span>
            <select bind:value={$State.ui.chartConfig.posBy2}>
                <option value={null}>
                    -
                </option>
                {#each attributes as attribute}
                    <option value={attribute.attribute}>
                        {attribute.attribute}
                    </option>
                {/each}
            </select>
        </div>
        <div>
            <button on:click="{() => save()}">
                Save
            </button>
        </div>
    </div>
    <canvas id="canvas"></canvas>
</div>

