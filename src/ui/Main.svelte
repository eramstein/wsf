<script>
    import { State } from '../stores';
    import { Screen, ConceptScreen } from '../model';
    import MainBar from './MainBar.svelte'
    import Concepts from './conceptsManagement/Concepts.svelte';
    import List from './conceptsMany/List.svelte';
    import Chart from './conceptsMany/Chart.svelte';
    import Cards from './conceptsMany/Cards.svelte';
    import Filters from './conceptsMany/Filters.svelte';
    import { FILTER_LABEL_WIDTH, FILTER_VALUE_WIDTH, FILTER_VALUE_PADDING } from './conceptsMany/filters';

    const filtersWidth = FILTER_LABEL_WIDTH + FILTER_VALUE_WIDTH + FILTER_VALUE_PADDING;
</script>

<style>
    .screen{
        display: flex;
        flex-flow: column;
        height: 100%;
        color: #333;
    }
    .top {
        height: 40px;
        flex: 0 1 auto;
    }
    .contents {
        flex: 1 1 auto;
    }
    .concept {
        display: flex;
        height: 100%;
    }
    .filters {
        flex: 1 0 auto;
        border-right: 1px solid #ccc;
    }
    .contents {
        flex: 1 1 auto;
    }    
</style>

<div class="screen">

    <div class="top">
        <MainBar />
    </div>

    <div class="contents">

        {#if $State.ui.openScreen === Screen.Home || $State.ui.openScreen === Screen.Concepts}
            <Concepts concepts={$State.data.concepts} />
        {/if}

        {#if $State.ui.openScreen === Screen.Concept}
            <div class="concept">
                <div class="filters"  style="width: {filtersWidth}px; max-width: {filtersWidth}px">
                    <Filters />
                </div>
                <div class="contents">
                    {#if $State.ui.screenParameters.widget === ConceptScreen.Lists}
                        <List />
                    {:else if $State.ui.screenParameters.widget === ConceptScreen.Cards}
                        <Cards />
                    {:else if $State.ui.screenParameters.widget === ConceptScreen.Charts}
                        <Chart />
                    {/if}
                </div>                
            </div>
        {/if}    

    </div>   

</div>

