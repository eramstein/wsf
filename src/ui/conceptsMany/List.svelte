<script>
    import { State } from '../../stores';
    import Link from '../Link.svelte';
    import { filterItem, sortBy, getColumnsFromAttributes, getColumnSorting, getDefaultConfig, getList } from './List';

    export let concept;

    let showConfig = false;
    const config = getDefaultConfig(concept.attributes);    

    function sortColumn(name) {
        const newConfig = getColumnSorting(name, config);
        config.sortBy = newConfig.sortBy;
        config.sortDirection = newConfig.sortDirection;
    }

    $: items = getList(concept, config);

    $: displayedColumns = Object.values(config.columns).filter(c => c.display);

    $: console.log(config);
    
        
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
</style>

<div>
    
    {#if showConfig === true }
        <div>
            <button on:click={ () => { showConfig = !showConfig; } }>
                Save
            </button>
            {#each Object.values(config.columns) as attribute (attribute.name) }
                <div>
                    <input type=checkbox bind:checked={ config.columns[attribute.name].display }> { attribute.name }
                </div>
            {/each}
        </div>
    {:else}
        <div>
            <button on:click={ () => { showConfig = !showConfig; } }>
                Config
            </button>
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