<script>
    import { State } from '../../stores';
    import { getFiltersData, getDefaultFilterConfig, filterData } from './Filters';

    let concept = $State.data.concepts[$State.ui.screenParameters.concept];
    $: preferences = $State.data.user.preferences.concepts[$State.ui.screenParameters.concept];
    $: savedFilters = preferences && preferences.filters;
    $: filteredItems = $State.ui.filteredItems;

    $: chartsData = getFiltersData(concept, filteredItems);    

</script>

<style>
</style>

<div class="filters" on:click={ () => filterData(filteredItems) }>
    FILTERS
</div>
