<script>
    import { afterUpdate } from 'svelte';
    import { Screen, InstanceScreen, DataType } from '../../model';
    import { LEFT_BAR_WIDTH } from '../../constants';
    import { State } from '../../stores';
    import Link from '../Link.svelte';
    import { getDefaultConfig, getNewMashup, addDefaultIfNeeded, getLayoutSimplified } from './Mashup';
    import Widget from "../Widget.svelte";
    import Relations from "./Relations.svelte";
 
    export let item;
    export let concept;

    const NO_WIDGET = 'no widget';
    const DEFAULT_WIDGET = 'Default View';
    const RELATIONS_WIDGET = 'Relations';

    let data = $State.data.concepts[concept].items[item];
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
        padding: 3px;
        cursor: pointer;
    }
    .field {
        margin-bottom: 3px;
    }
    .field-title {
        font-weight: bold;
        padding-right: 20px;
        min-width: 100px;
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
            <div class="field">
                {#each Object.entries(data) as field }
                    <span class="field-title">{field[0]}</span>
                    <span>{field[1]}</span>
                {/each}
            </div>
        {/if}
    </div>
    
</div>