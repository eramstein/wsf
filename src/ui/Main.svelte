<script>
    import { State } from '../stores';
    import { Screen, ConceptScreen, InstanceScreen } from '../model';
    import MainBar from './MainBar.svelte'
    import Concepts from './conceptsManagement/Concepts.svelte';
    import ConceptManagement from './conceptsManagement/ConceptManagement.svelte';
    import List from './conceptsMany/List.svelte';
    import Chart from './conceptsMany/Chart.svelte';
    import Cards from './conceptsMany/Cards.svelte';
    import Filters from './conceptsMany/Filters.svelte';
    import Mashup from './conceptsOne/Mashup.svelte';
    import Relations from './conceptsOne/Relations.svelte';
    import WidgetAuthoring from './widgetAuthoring/WidgetAuthoring.svelte';
    import { LEFT_BAR_WIDTH } from '../constants';   

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
                {#if $State.ui.widgetAuthoring}
                    <WidgetAuthoring />
                {:else if $State.ui.screenParameters.widget === ConceptScreen.Management}
                    <ConceptManagement />
                {:else}
                    <div class="filters" style="width: {LEFT_BAR_WIDTH}px; max-width: {LEFT_BAR_WIDTH}px">
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
                {/if}             
            </div>
        {/if}

        {#if $State.ui.openScreen === Screen.Instance}
            {#if $State.ui.screenParameters.widget === InstanceScreen.Mashups}
                <Mashup />
            {:else if $State.ui.screenParameters.widget === InstanceScreen.Relations}
                <Relations
                    conceptRelations={$State.data.concepts[$State.ui.screenParameters.concept].relations}
                    item={$State.data.concepts[$State.ui.screenParameters.concept].items[$State.ui.screenParameters.instance]}
                />
            {/if}
        {/if}

    </div>   

</div>

