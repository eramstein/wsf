<script>
    import { State } from '../../stores';
    import FilterCategorical from './FilterCategorical.svelte';
    import { setFiltersData, setDefaultFilterConfig } from './Filters';    

    let concept = $State.data.concepts[$State.ui.screenParameters.concept];
    $: preferences = $State.data.user.preferences.concepts[$State.ui.screenParameters.concept];
    $: filters = preferences && preferences.filters;
    $: filteredItems = $State.ui.filteredItems;

    $: if (!filters) {
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
        align-items: center;
        justify-content: center;
        height: 40px;
    }
    .filter {
        margin-top: 20px;
    }
    .filter-name {
        font-weight: bold;
        margin-bottom: 10px;
    }
</style>

<div class="filters">
    <div class="filters-title">Filters</div>
    {#each chartsData as data (data.attribute) }
        <div class="filter">
            <div class="filter-name">{ data.attribute }</div>
            {#if data.type === "CATEGORICAL" }
                <FilterCategorical attribute={data.attribute} categories={data.categories} filters={filters[data.attribute]} />
            {/if}
        </div>        
    {/each}
</div>
