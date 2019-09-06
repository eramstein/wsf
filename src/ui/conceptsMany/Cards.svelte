<script>
    import { afterUpdate } from 'svelte';
    import { State } from '../../stores';
    import { DataType, Cardinality } from "../../model";
    import { GRID_COLUMNS, BUTTON_EDIT } from "../../constants";
    import Widget from "../Widget.svelte";

    const MAX_CARDS = 24;
    
    let concept = $State.data.concepts[$State.ui.screenParameters.concept];
    let idAttribute = Object.values(concept.attributes).filter(a => a.type === DataType.Identifier)[0].name;
    let widgets = Object.values(concept.widgets.one);    
    let lastOpenWidget = $State.ui.lastOpenWidget && widgets.filter(w => w.name === $State.ui.lastOpenWidget)[0];   
    let widgetToOpen = $State.ui.screenParameters.defaultWidget || lastOpenWidget;
    let widget = widgets.length > 0 && (widgetToOpen || widgets[0]);

    function addWidget() {
        State.openWidgetAuthoring({
            widget: {
                name: 'New widget',
                height: 300,
                width: '4cols',
                template: '',
                script: '',
                computedNode: '',                
            },
            cardinality: Cardinality.One,
            conceptName: concept.name,
        });
    }

    function editWidget() {        
        State.openWidgetAuthoring({
            widget: widget,
            cardinality: Cardinality.One,
            conceptName: concept.name,
        });
    }

    function selectWidget(name) {     
        if (selectedWidget === name) {
            editWidget();
        } else {
            selectedWidget = name;
            widget = concept.widgets.one[name];
        } 
    }

    let selectedWidget = widget.name;
    $: filteredItems = $State.ui.filteredItems;
    $: items = filteredItems.slice(0, MAX_CARDS);

    let container;
    let columns = 3;

    afterUpdate(() => {

        console.log(widget);
        
        
        if (!widget) {
            return false;
        }        
        
        if (widget.width.indexOf('cols') >= 0) {
            columns = Math.max(1, Math.floor(GRID_COLUMNS / widget.width.slice(0, -4)));
        } else if (widget.width.indexOf('px') >= 0) {
            columns = Math.max(1, Math.floor(container.offsetWidth / widget.width.slice(0, -2)));
        }                
        
	});
    

</script>

<style>
    .cards {
        display: grid;        
        grid-gap: 10px;        
        height: 100%;
        background-color: #fbfbfb;
        padding: 10px;
        box-sizing: border-box;
    }
    .card {
        border: 1px solid #ccc;
        border-radius: 6px;
        background-color: white;
        padding: 12px  20px;
        overflow: hidden;
    }
    .widgets-bar {
        background-color: #eee;
        height: 36px;
        display: flex;
        justify-content: space-between;
    }
    .widget-tabs {
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    .widget-tabs div {
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0px 20px;
        cursor: pointer;
        min-width: 100px;
        justify-content: center;
    }
    .widget-tab {
        position: relative;
    }
    .edit-button {
        position: absolute;
        right: 5px;    
    }
    .selected, .selected:hover {
        background-color: #ddd;
    }
    .selected:not(:hover) .edit-button {
        display: none;
    }
    .widget-tab:hover {
        background-color: #ccc;
    }
    .add-widget {
        font-size: 24px;
        font-weight: bold;
        min-width: 30px !important;
    }
</style>

<div bind:this={container}>

    <div class="widgets-bar">
        <div class="widget-tabs">
            {#each widgets as widget (widget.name) }
                <div class="widget-tab" class:selected="{ selectedWidget === widget.name }"
                    on:click={ () => selectWidget(widget.name) }>
                    { widget.name }
                    <img class="edit-button"
                        alt="e"
                        src={BUTTON_EDIT}
                        style="height:16px;width:16px;display:{selectedWidget !== widget.name ? 'none' : null}" />
                </div>
            {/each}
            <div class="add-widget" on:click={ () => addWidget() }>+</div>
        </div>
    </div>

    {#if widget }
        <div class="cards"
            style="grid-auto-rows: minmax(100px, {widget.height*1+24}px);
                grid-template-columns: repeat({columns}, 1fr);"
        >
            {#each items as entity (entity[idAttribute]) }
                <div class="card"
                    style="min-height: minmax(100px, {widget.height}px);">
                    <Widget
                        template={ widget.template } script={ widget.script } computednode={ widget.computedNode } data={ entity }
                    />
                </div>
            {/each}
        </div>
    {/if}

</div>

