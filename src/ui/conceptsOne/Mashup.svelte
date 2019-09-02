<script>
    import { afterUpdate } from 'svelte';
    import { Screen, InstanceScreen, DataType } from '../../model';
    import { LEFT_BAR_WIDTH, BUTTON_EDIT, BUTTON_DELETE } from '../../constants';
    import { State } from '../../stores';
    import Link from '../Link.svelte';
    import { getDefaultConfig, getNewMashup, addDefaultIfNeeded, getLayoutSimplified } from './Mashup';
    import Widget from "../Widget.svelte";

    let concept = $State.data.concepts[$State.ui.screenParameters.concept];
    $: instance = concept.items[$State.ui.screenParameters.instance];
    $: allWidgets = Object.keys(concept.widgets.one);    
    
    let showConfig = false;

    let defaultPrefs = $State.data.user.preferences.concepts[concept.name];
    let defaultMashups = defaultPrefs && defaultPrefs.mashups;

    let config = getDefaultConfig(concept.widgets.one, defaultMashups);    

    $: preferences = $State.data.user.preferences.concepts[concept.name];
    $: mashups = preferences && preferences.mashups && preferences.mashups.length > 0 ? preferences.mashups : [config];
    $: selectedMashup = config.id;

    $: customMashup = $State.ui.screenParameters.customMashup;
    
    let container;    
    let layout;
    let widgetsData = [];

    afterUpdate(() => {        
        if (customMashup) {
            widgetsData = Object.values(concept.widgets.one).filter(w => customMashup.indexOf(w.name) >= 0);
        } else {
            widgetsData = Object.values(concept.widgets.one).filter(w => config.widgets.indexOf(w.name) >= 0);
        }        
        widgetsData = getLayoutSimplified(widgetsData);
    });    

    function saveConfig() {        
        const newMashups = addDefaultIfNeeded(mashups, config);
        let newPreferences = preferences || {};
        newPreferences.mashups = newMashups;
        State.updateConceptPreferences(concept.name, newPreferences);
        showConfig = false;
    }

    function addMashup() {
        const newMashup = getNewMashup(); 
        let newPreferences = preferences || {};
        newPreferences.mashups = newPreferences.mashups.concat([newMashup]);
        config = newMashup;
        showConfig = true;
        State.updateConceptPreferences(concept.name, newPreferences);
    }

    function selectMashup(id) {
        if (selectedMashup === id) {
            if (showConfig === true) {
                saveConfig();
            } else {
                showConfig = true;
            }
        } else {
            selectedMashup = id;
            config = mashups.filter(l => l.id === id)[0];
            showConfig = false;
        }    
    }

    function deleteMashup() {
        const newMashups = mashups.filter(l => l.id !== selectedMashup);
        const newPreferences = preferences || {};
        newPreferences.mashups = newMashups;
        State.updateConceptPreferences(concept.name, newPreferences);
        config = getDefaultConfig(concept.attributes, defaultMashups);
        showConfig = false;
    }

    function toggleWidget(widget) {
        if (config.widgets.filter(w => w === widget).length > 0) {
            config.widgets = config.widgets.filter(w => w !== widget);
        } else {
            config.widgets = config.widgets.concat(widget);
        }        
        State.updateConceptPreferences(concept.name, preferences);
    }    
        
</script>

<style>
    .mashups-bar {
        background-color: #eee;
        height: 36px;
        display: flex;
        justify-content: space-between;
    }
    .mashup-tabs {
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    .mashup-tabs div {
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0px 20px;
        cursor: pointer;
        min-width: 100px;
        justify-content: center;
    }
    .selected, .selected:hover {
        background-color: #ddd;
    }
    .selected:not(:hover) .edit-button {
        display: none;
    }
    .mashup-tab:hover {
        background-color: #ccc;
    }    
    .mashup-tab {
        position: relative;
    }
    .edit-button {
        position: absolute;
        right: 5px;    
    }
    .add-mashup {
        font-size: 24px;
        font-weight: bold;
        min-width: 30px !important;
    }
    .widgets-list {
        padding: 0px 20px;
        height: 100%;
        border-right: 1px solid #ccc;
        flex: 1 1 auto;
    }
    .container{
        display: flex;
        flex: 1 1 auto;
    }
    .config-name input{
       width: 241px;
    }
    .config-name{
       margin-right: 10px;
    }
    .left-panel{
        display: flex;
        flex-flow: column;
        align-items: stretch;
        flex: 1 1 auto;
    }
    .page {
        display: flex;
        flex-flow: column;
        align-items: stretch;
        flex: 1 1 auto;
        height: 100%;
    }
    .widget-selectors div {
        padding: 10px 20px;
        margin-bottom: 7px;
        border: 1px solid #ccc;
        cursor: pointer;
    }
    .widget-selectors div:not(.widgetSelected):hover {
        background-color: rgb(187, 202, 216);
    }
    .widgetSelected {
        background-color: steelblue;
        color: white;
    }
    .section-title {
        font-weight: bold;
        margin-top: 15px;
        margin-bottom: 5px;
    }
    .mashup {
        display: grid;
        grid-template-columns: auto auto auto;
        grid-template-rows: auto auto;
        grid-gap: 0px;
        background-color: #fbfbfb;
        padding: 0px;
        width: 100%;
    }
    .card {
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        background-color: white;
        padding: 12px  20px;
    }
    .delete {
        background-color: #c50404;
        color: white;
        height: 36px;
    }
</style>

<div class="page" bind:this={container}>

    {#if !customMashup }
    <div class="mashups-bar">
        <div class="mashup-tabs">
            {#if !mashups}           
                <div class="selected">{ config.name }</div>
            {:else}
                {#each mashups as mashup (mashup.id) }
                    <div class="mashup-tab" class:selected="{ selectedMashup === mashup.id }"
                        on:click={ () => selectMashup(mashup.id) }>
                        { mashup.name }
                        <img class="edit-button"
                            alt="e"
                            src={BUTTON_EDIT}
                            style="height:16px;width:16px;display:{selectedMashup !== mashup.id ? 'none' : null}" />
                    </div>
                {/each}
                <div class="add-mashup" on:click={ () => addMashup() }>+</div>
            {/if}
        </div>
    </div> 
    {/if}

    <div class="container">
        {#if showConfig === true }
            <div class="left-panel" style="width: {LEFT_BAR_WIDTH}px; max-width: {LEFT_BAR_WIDTH}px">
                <div class="widgets-list">
                    <div class="section-title">Mashup Name</div>
                    <div style="display:flex">
                        <div class="config-name"><input bind:value={ config.name }></div>
                        <div>
                            <button on:click={ () => deleteMashup() } class="delete">
                                <img alt="d"
                                    src={BUTTON_DELETE}
                                    style="height:18px;width:18px;filter: invert(100%);" />
                            </button>
                        </div>
                    </div>                    
                    <div class="section-title">Widgets</div>
                    <div class="widget-selectors">
                        {#each allWidgets as widget (widget) }                           
                            <div class:widgetSelected="{ config.widgets.filter(w => w === widget).length > 0 }"
                                on:click={ () => toggleWidget(widget) }>
                                { widget }
                            </div>
                        {/each}
                    </div>
                </div>
            </div>  
        {/if}
        <div class="mashup">
            {#each widgetsData as widget (widget.name) }
                <div class="card"
                    style="min-height: minmax(100px, {widget.height}px);">
                    <Widget
                        template={ widget.template } script={ widget.script } computedNode={ widget.computedNode } data={ instance }
                    />
                </div>
            {/each}
        </div>
    </div>

    
    
</div>