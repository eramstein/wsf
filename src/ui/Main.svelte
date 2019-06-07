<script>
    import { State } from '../stores';
    import MainBar from './MainBar.svelte'
    import Concepts from './conceptsManagement/Concepts.svelte';
    import List from './conceptsMany/List.svelte';
    import Filters from './conceptsMany/Filters.svelte';
    import { FILTER_LABEL_WIDTH, FILTER_VALUE_WIDTH } from './conceptsMany/filters';

    const filtersWidth = FILTER_LABEL_WIDTH + FILTER_VALUE_WIDTH + 40;
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
    .list {
        flex: 1 1 auto;
    }    
</style>

<div class="screen">

    <div class="top">
        <MainBar />
    </div>

    <div class="contents">

        {#if $State.ui.openScreen === "HOME" || $State.ui.openScreen === "CONCEPTS"}
            <Concepts concepts={$State.data.concepts} />
        {/if}

        {#if $State.ui.openScreen === "CONCEPT"}
            <div class="concept">
                <div class="filters"  style="width: {filtersWidth}px; max-width: {filtersWidth}px">
                    <Filters />
                </div>
                <div class="list">
                    <List />
                </div>                
            </div>
        {/if}    

    </div>   

</div>

