<script>
    import { State } from '../../stores';
    import FilterCategorical from './FilterCategorical.svelte';
    import FilterNumeric from './FilterNumeric.svelte';
    import { setFiltersData, setDefaultFilterConfig, toggleAttribute } from './Filters';    

    $: concept = $State.data.concepts[$State.ui.screenParameters.concept];
    $: preferences = $State.data.user.preferences.concepts[$State.ui.screenParameters.concept];
    $: filters = preferences && preferences.filters;
    $: filteredItems = $State.ui.filteredItems;

    $: if (!filters || Object.keys(filters).length === 0) {
        setDefaultFilterConfig(concept);
    }

    $: setFiltersData(concept, Object.values(concept.items), filters);
    $: chartsData = $State.ui.filterData;    

</script>

<style>
    .filters {
        padding-left: 10px;
    }
    .filters-title {
        display: flex;
        align-items: flex-end;
        height: 40px;
        margin-bottom: 15px;
        justify-content: center;
    }
    .concept-count {
        font-size: 28px;
        color: steelblue;
    }
    .concept-name {
        margin-left: 6px;
        margin-bottom: 3px;
    }
    .filter {
        margin-bottom: 20px;
    }
    .filter-name {
        font-weight: bold;
        margin-bottom: 10px;
        cursor: pointer;
    }
</style>

<div class="filters">
    <div class="filters-title">
        <span class="concept-count">
            {filteredItems.length.toLocaleString('fr', {useGrouping:true})} {concept.name}
        </span>
    </div>
    {#each chartsData as data (data.attribute) }
        <div class="filter">
            <div class="filter-name" on:click={ () => toggleAttribute(data.attribute) }>            
                { data.attribute }
            </div>
            <div style="display:{ filters[data.attribute] && filters[data.attribute].collapsed ? 'none': 'block'}">
            {#if data.type === "CATEGORICAL" }
                <FilterCategorical attribute={data.attribute} categories={data.categories} filters={filters[data.attribute]} />
            {/if}
            {#if data.type === "NUMERIC" }
                <FilterNumeric attribute={data.attribute} spread={data.spread} filters={filters[data.attribute]} />
            {/if}
            </div>
        </div>        
    {/each}
</div>
