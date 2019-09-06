<script>
    import { State } from '../../stores';
    import { onMount } from 'svelte';
    import { DataType } from "../../model";
    import { bubbleChart, getDefaultConfig } from './Chart';
    import Browser from "../conceptsOne/Browser.svelte";
    
    let chart;

    onMount(() => {
		chart = new bubbleChart(onBubbleClick);
        chart.build();
    });

    let concept= $State.ui.screenParameters.concept;
    const attributes = $State.ui.filterData;
    const quantitativeAttributes = attributes.filter(a => a.type === DataType.Numeric);
    const categoricalAttributes = attributes.filter(a => a.type === DataType.Categorical);

    $: config = $State.ui.chartConfig;

    $: if (!config) {        
        State.updateChartConfig(getDefaultConfig());
    }
    
    $: {
        if (chart) {
            chart.update($State.ui.filteredItems, $State.ui.chartConfig, $State.data.concepts[concept].attributes);
        }        
    }

    function save() {
        State.updateChartConfig(config);
    }

    $: selectedItem = null;
    function onBubbleClick(itemName) {
        selectedItem = itemName;        
    }

</script>

<style>
    .chart {
        width: 100%;
        height: 100%;
        position: relative;
    }
    .config {
        height: 35px;
        display: flex;
        padding: 10px 20px;
    }
    .config div {
        margin-right: 20px;
    }
    .browser {
        position: absolute;
        top: 0;
        right: 0;
        border: 1px solid #ccc;
        background-color: #f3f3f3;
        width: 520px;
        height: 750px;
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
    {#if selectedItem }
    <div class="browser">
        <Browser concept={concept} item={selectedItem} />
    </div>
    {/if}
    <canvas id="canvas"></canvas>
</div>

