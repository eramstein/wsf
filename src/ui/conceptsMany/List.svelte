<script>
    import { Screen, InstanceScreen, DataType } from '../../model';
    import { State } from '../../stores';
    import Link from '../Link.svelte';
    import Widget from "../Widget.svelte";
    import { sortBy, getColumnsFromAttributes, getColumnSorting, getDefaultConfig, getList, getSortArrowClass, saveListConfig, getNewList } from './List';

    let configsPerConcept = {};

    $: concept = $State.data.concepts[$State.ui.screenParameters.concept];
    $: idAttribute = Object.values(concept.attributes).filter(a => a.type === DataType.Identifier)[0].name;

    let showConfig = false;

    $: defaultPrefs = $State.data.user.preferences.concepts[concept.name];
    $: defaultLists = defaultPrefs && defaultPrefs.lists;

    let config;

    $: {
        if (!configsPerConcept[concept.name]) {
            configsPerConcept[concept.name] = getDefaultConfig(concept.attributes, concept.widgets.one, defaultLists);            
        }           
    }

    $: {
        if (!showConfig) {
            config = configsPerConcept[concept.name];
        }        
    }

    $: preferences = $State.data.user.preferences.concepts[concept.name];
    $: lists = preferences && preferences.lists && preferences.lists.length > 0 ? preferences.lists : [config];    

    $: filteredItems = $State.ui.filteredItems;    

    function sortColumn(name) {
        const newConfig = getColumnSorting(name, config);
        config.sortBy = newConfig.sortBy;
        config.sortDirection = newConfig.sortDirection;
    }

    function saveConfig() {
        const id = config.id;
        const newLists = saveListConfig(lists, config);
        let newPreferences = preferences || {};
        newPreferences.lists = newLists;
        State.updateConceptPreferences(concept.name, newPreferences);
        showConfig = false;
        selectList(id);
    }

    function addList() {
        const newList = getNewList(concept.attributes, concept.widgets.one); 
        let newPreferences = preferences || {};
        newPreferences.lists = newPreferences.lists.concat([newList]);
        config = newList;
        showConfig = true;
        State.updateConceptPreferences(concept.name, newPreferences);
    }

    function selectList(id) {        
        selectedList = id;
        config = lists.filter(l => l.id === id)[0];
    }

    function deleteList() {
        const newLists = lists.filter(l => l.id !== selectedList);
        const newPreferences = preferences || {};
        newPreferences.lists = newLists;
        State.updateConceptPreferences(concept.name, newPreferences);
        config = getDefaultConfig(concept.attributes, defaultLists);
        showConfig = false;
    }

    $: items = getList(filteredItems, concept.attributes, config);
    $: displayedColumns = Object.values(config.columns).filter(c => c.display);
    $: displayedWidgets = config.widgets ?
        Object.entries(config.widgets)
            .filter(c => c[1] === true)
            .map(c => concept.widgets.one[c[0]])
     : [];

    $: selectedList = config.id;
        
</script>

<style>
    .lister {
        margin-top: 10px;
        border-collapse: collapse;
    }
    .lister th {
        white-space: nowrap;
        text-align: left;
    }
    .lister th, .lister td {
        padding: 5px 0px 5px 20px;
        border-bottom: 1px solid #ccc;
    }
    .lister tbody tr:hover td {
        cursor: pointer;
        background-color: rgb(206, 231, 251);
    }
    .filter-input {
        width: 100px;
        margin-top: 5px;
    }
    .lists-bar {
        background-color: rgb(92, 92, 92);
        height: 40px;
        display: flex;
        justify-content: space-between;
    }
    .list-tabs {
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    .list-tabs div {
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
    .list-tab:hover {
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
    .add-list {
        font-size: 24px;
        font-weight: bold;
        min-width: 30px !important;
    }
    .config {
        padding: 10px 20px;
    }
    .config-name {
        font-weight: bold;
    }
    .config-top-bar {
        display: flex;
    }
    .config-top-bar div {
        margin-right: 10px;
    }
    .config-top-bar div button {
        cursor: pointer;
        width: 100px;
    }
    .save {
        background-color: #428e42;
        color: white;     
    }
    .delete {
        background-color: #c50404;
        color: white;
    }
    .checkboxes-group-title {
        padding: 10px 0px 0px 0px;
        font-weight: bold;
    }
    .checkboxes {
        padding: 10px 0px 0px 0px;
        display: grid;
        grid-template-columns: 200px 200px 200px 200px;
        grid-column-gap: 10px;
        grid-row-gap: 3px;
    }
    .column-name{
        display: flex;
        cursor: pointer;
    }
    .arrow {
        margin-right: 5px;
    }
    .arrow i {
        border: solid #333;
        border-width: 0 3px 3px 0;
        display: inline-block;
        padding: 3px;
    }
    .arrow-down i {
        transform: rotate(-135deg);
    }
    .arrow-up i {
        transform: rotate(45deg);
    }
    .arrow-up {
        margin-top: -3px;
    }
</style>

<div>

    <div class="lists-bar">
        <div class="list-tabs">
            {#if !lists }                
                <div class="selected">{ config.name }</div>
            {:else}
                {#each lists as list (list.id) }
                    <div class="list-tab" class:selected="{ selectedList === list.id }"
                        on:click={ () => selectList(list.id) }>{ list.name }</div>
                {/each}
                <div class="add-list" on:click={ () => addList() }>+</div>
            {/if}
        </div>
        <div class="config-buttons">
            {#if showConfig === false }
            <div class="open-config-button" on:click={ () => { showConfig = true; } }>
                Config
            </div>
            {/if}
        </div>
    </div>
    
    {#if showConfig === true }
        <div class="config">
            <div class="config-top-bar">
                <div class="config-name">Name <input bind:value={ config.name }></div>
                <div>
                    <button on:click={ () => saveConfig() } class="save">Save</button>
                </div>                
                <div>
                    <button on:click={ () => deleteList() } class="delete">Delete</button>
                </div>
                <div>
                    <button on:click={ () => { showConfig = false; } }>Cancel</button>
                </div>
            </div>
            <div class="checkboxes-group-title">Raw Data</div>
            <div class="checkboxes">                
                {#each Object.values(config.columns) as attribute (attribute.name) }
                    <label class="checkbox">
                        <input type=checkbox bind:checked={ config.columns[attribute.name].display }> { attribute.name }
                    </label>
                {/each}
            </div>
            <div class="checkboxes-group-title">Sparklines</div>
            <div class="checkboxes">                 
                {#each Object.keys(config.widgets) as widget (widget) }
                    <label class="checkbox">
                        <input type=checkbox bind:checked={ config.widgets[widget] }> { widget }
                    </label>
                {/each}
            </div>
        </div>        
    {/if}

    <table class="lister">
        <thead>
            <tr>
                {#each displayedWidgets as widget (widget.name) }
                    <th>
                        <div class="column-name">                        
                            { widget.name }
                        </div>
                    </th>
                {/each}
                {#each displayedColumns as attribute (attribute.name) }
                    <th>
                        <div class="column-name" on:click={ () => sortColumn(attribute.name)}>
                            <div class={ getSortArrowClass(attribute.name, config) }><i></i></div>                            
                            { attribute.name }
                        </div>
                        <div>
                            <input class="filter-input" bind:value={ config.columns[attribute.name].filterValue } />
                        </div>
                    </th>
                {/each}
            </tr>            
        </thead>
        <tbody>            
            {#each items as item (item[idAttribute]) }
                <tr on:click={ () => State.goTo(Screen.Instance, { concept: $State.ui.screenParameters.concept, instance: item[idAttribute], widget: InstanceScreen.Mashups }) }>
                    {#each displayedWidgets as widget (widget.name) }
                        <td>
                            <Widget
                                template={ widget.template } script={ widget.script } computedNode={ widget.computedNode } data={ item }
                            />
                        </td>
                    {/each}
                    {#each displayedColumns as attribute (attribute.name) }
                        <td>
                            { item[attribute.name] }
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
    
</div>