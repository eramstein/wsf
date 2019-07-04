<script>    
    import { State } from '../../stores';
    import { Screen, InstanceScreen } from '../../model';
    import Link from '../Link.svelte';
    import Widget from "../Widget.svelte";
    import Relations from "./Relations.svelte";
 
    export let item;
    export let concept;

    const NO_WIDGET = 'no widget';
    const DEFAULT_WIDGET = 'Default View';
    const RELATIONS_WIDGET = 'Relations';

    $: data = $State.data.concepts[concept].items[item];
    let widgets = Object.values($State.data.concepts[concept].widgets.one);

    if (!widgets || widgets.length === 0) {
        widgets = widgets.concat([DEFAULT_WIDGET]);
    }
    widgets = widgets.concat([RELATIONS_WIDGET]);
    
    let index = 0;
    let currentWidget = widgets[index];

    function updateIndex(v) {
        index += v;
        if (index < 0) {
            index = widgets.length - 1;
        }
        if (index >= widgets.length) {
            index = 0;
        }
        currentWidget = widgets[index];
    }
        
</script>

<style>
    .browser {
        max-width: 600px;
        max-height: 800px;
        position: relative;
    }
    .title {
        background-color: rgb(92, 92, 92);
        color: white;
        padding: 10px 0px;
        text-align: center;
        height: 18px;
    }
    .content {
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .nav {
        position: absolute;
        top: 5px;
        right: 10px;
        display: flex;
    }
    .nav div {
        font-weight: bold;
        padding-right: 8px;
        cursor: pointer;
        font-family: monospace;
        font-size: 21px;
    }
    .field {
        margin-bottom: 3px;
    }
    .field-title {
        font-weight: bold;
        padding-right: 20px;
        min-width: 100px;
    }
    .drilldown {
        position: absolute;
        top: 5px;
        left: 20px;
        font-weight: bold;
        cursor: pointer;
        font-family: monospace;
        font-size: 22px;
    }
</style>

<div class="browser">

    <div class="title">
        { currentWidget.name || currentWidget }
        <div class="nav">
            <div on:click={ () => updateIndex(-1) }>
                &lt;
            </div>
            <div on:click={ () => updateIndex(1) }>
                &gt;
            </div>
        </div>
        <div class="drilldown">
            <Link  screen={ Screen.Instance } params={ { concept: concept , instance: item, widget: InstanceScreen.Mashups } }>
                &#x25BE;
            </Link>
        </div>
    </div>
    <div class="content">
        {#if currentWidget !== RELATIONS_WIDGET && currentWidget !== DEFAULT_WIDGET }
            <Widget
                template={ currentWidget.template } script={ currentWidget.script } computedNode={ currentWidget.computedNode } data={ data }
            />
        {/if}
        {#if currentWidget === RELATIONS_WIDGET }
            <Relations concept={ concept } item={ item } />
        {/if}
        {#if currentWidget === DEFAULT_WIDGET }            
            {#each Object.entries(data) as field }
                <div class="field">
                    <span class="field-title">{field[0]}</span>
                    <span>{field[1]}</span>
                </div>
            {/each}            
        {/if}
    </div>
    
</div>