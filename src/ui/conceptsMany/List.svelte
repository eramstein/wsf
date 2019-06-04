<script>
    import { State } from '../../stores';
    import Link from '../Link.svelte';
    import { filterItem, sortBy, getColumnsFromAttributes, getColumnSorting, getDefaultConfig, getList, saveListConfig, getNewList } from './List';

    export let concept;

    let showConfig = false;

    const defaultPrefs = $State.data.user.preferences.concepts[concept.name];
    const defaultLists = defaultPrefs && defaultPrefs.lists;

    let config = getDefaultConfig(concept.attributes, defaultLists);

    $: preferences = $State.data.user.preferences.concepts[concept.name];
    $: lists = preferences && preferences.lists;

    function sortColumn(name) {
        const newConfig = getColumnSorting(name, config);
        config.sortBy = newConfig.sortBy;
        config.sortDirection = newConfig.sortDirection;
    }

    function saveConfig() {
        const newLists = saveListConfig(lists, config);
        let newPreferences = preferences || {};
        newPreferences.lists = newLists;
        State.updateConceptPreferences(concept.name, newPreferences);
        showConfig = false;
    }

    function addList() {
        const newList = getNewList(concept.attributes); 
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

    $: items = getList(concept, config);
    $: displayedColumns = Object.values(config.columns).filter(c => c.display);

    $: selectedList = config.id;    
        
</script>

<style>
    .lister {
        border-collapse: collapse;
    }
    .lister th {
        white-space: nowrap;
        text-align: left;
    }
    .lister th, .lister td {
        padding: 5px 10px;
        border-bottom: 1px solid #ccc;
    }
    .filter-input{
        width: 100px;
        margin-top: 5px;
    }
    .lists-bar{
        background-color: rgb(92, 92, 92);
        height: 40px;
        display: flex;
        justify-content: space-between;
    }
    .list-tabs{
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
    }
    .selected{
        background-color: steelblue;
    }
    .config-buttons{
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
</style>

<div>

    <div class="lists-bar">
        <div class="list-tabs">
            {#if !lists }
                <div class="selected">{ config.name }</div>
            {:else}
                {#each lists as list (list.id) }
                    <div class:selected="{ selectedList === list.id }"
                        on:click={ () => selectList(list.id) }>{ list.name }</div>
                {/each}
                <div on:click={ () => addList() }>+</div>
            {/if}
        </div>
        <div class="config-buttons">
            {#if showConfig === true }
            <div on:click={ () => saveConfig() }>
                Save
            </div>            
            {:else}
            <div on:click={ () => { showConfig = true; } }>
                Config
            </div>
            {/if}
        </div>
    </div>
    
    {#if showConfig === true }
        <div>
            <div>Name <input bind:value={ config.name }></div>
            {#each Object.values(config.columns) as attribute (attribute.name) }
                <div>
                    <input type=checkbox bind:checked={ config.columns[attribute.name].display }> { attribute.name }
                </div>
            {/each}
            <div on:click={ () => deleteList()}>DELETE</div>
        </div>        
    {/if}

    <table class="lister">
        <thead>
            <tr>
                {#each displayedColumns as attribute (attribute.name) }
                    <th>
                        <div on:click={ () => sortColumn(attribute.name)}>{ attribute.name }</div>
                        <div>
                            <input class="filter-input" bind:value={ config.columns[attribute.name].filterValue } />
                        </div>
                    </th>
                {/each}
            </tr>            
        </thead>
        <tbody>
            {#each items as item (item[Object.values(config.columns)[0].name]) }
                <tr>
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