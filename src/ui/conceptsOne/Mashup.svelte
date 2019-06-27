<script>
    import { Screen, InstanceScreen, DataType } from '../../model';
    import { LEFT_BAR_WIDTH } from '../../constants';
    import { State } from '../../stores';
    import Link from '../Link.svelte';
    import { getDefaultConfig, getNewMashup, addDefaultIfNeeded } from './Mashup';

    let concept = $State.data.concepts[$State.ui.screenParameters.concept];
    const allWidgets = Object.keys(concept.widgets.one);
    
    let showConfig = true;

    const defaultPrefs = $State.data.user.preferences.concepts[concept.name];
    const defaultMashups = defaultPrefs && defaultPrefs.mashups;

    let config = getDefaultConfig(concept.widgets.one, defaultMashups);

    $: preferences = $State.data.user.preferences.concepts[concept.name];
    $: mashups = preferences && preferences.mashups && preferences.mashups.length > 0 ? preferences.mashups : [config];

    $: selectedMashup = config.id;

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
        selectedMashup = id;
        config = mashups.filter(l => l.id === id)[0];
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
        background-color: rgb(92, 92, 92);
        height: 40px;
        display: flex;
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
        color: white;
        cursor: pointer;
        min-width: 100px;
        justify-content: center;
    }
    .selected, .selected:hover {
        background-color: steelblue !important;
    }
    .mashup-tab:hover {
        background-color: rgba(65, 118, 163, 0.52)
    }    
    .config-buttons {
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    .config-buttons div {
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0px 20px;
        color: white;
        cursor: pointer;
    }
    .add-mashup {
        font-size: 24px;
        font-weight: bold;
        min-width: 30px !important;
    }
    .widgets-list {
        padding: 10px 20px;
        height: 100%;
        border-right: 1px solid #ccc;
        flex: 1 1 auto;
    }
    .container{
        display: flex;
        flex: 1 1 auto;
    }
    .config-top-bar{
        display: flex;
    } 
    .config-top-bar div{
        padding-right: 10px;
    }
    .config-top-bar div button{
       width: 85px;
    }
    .config-name input{
       width: 276px;
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
</style>

<div class="page">

    <div class="mashups-bar">
        <div class="config-buttons" style="width:{LEFT_BAR_WIDTH}px">
            {#if showConfig === false }
            <div class="open-config-button" on:click={ () => { showConfig = true; } }>
                Config
            </div>            
            {/if}
        </div>
        <div class="mashup-tabs">
            {#if !mashups }                
                <div class="selected">{ config.name }</div>
            {:else}
                {#each mashups as mashup (mashup.id) }
                    <div class="mashup-tab" class:selected="{ selectedMashup === mashup.id }"
                        on:click={ () => selectMashup(mashup.id) }>{ mashup.name }</div>
                {/each}
                <div class="add-mashup" on:click={ () => addMashup() }>+</div>
            {/if}
        </div>
    </div>  

    <div class="container">
        {#if showConfig === true }
            <div class="left-panel" style="width: {LEFT_BAR_WIDTH}px; max-width: {LEFT_BAR_WIDTH}px">
                <div class="widgets-list">
                    <div class="config-top-bar">                       
                        <div>
                            <button on:click={ () => saveConfig() } class="save">Save</button>
                        </div>                
                        <div>
                            <button on:click={ () => deleteMashup() } class="delete">Delete</button>
                        </div>
                        <div>
                            <button on:click={ () => { showConfig = false; } }>Cancel</button>
                        </div>
                    </div>
                    <div class="section-title">Mashup Name</div>
                    <div class="config-name"><input bind:value={ config.name }></div>
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
            MASHUP
        </div>
    </div>

    
    
</div>