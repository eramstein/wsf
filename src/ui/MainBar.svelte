<script>
    import { State } from '../stores';
    import { Screen, ConceptScreen } from '../model';
    import Link from './Link.svelte'
    import { FILTER_LABEL_WIDTH, FILTER_VALUE_WIDTH, FILTER_VALUE_PADDING } from './conceptsMany/filters';

    const filtersWidth = FILTER_LABEL_WIDTH + FILTER_VALUE_WIDTH + FILTER_VALUE_PADDING;
</script>

<style>
    .main-bar{
        height: 100%;
        background-color: rgba(33, 33, 33);
        color: white;
        display: flex;
        align-items: center;
        padding-left: 20px;
    }
    .home{
        font-weight: bold;
        cursor: pointer;
    }
    .menu {
        display: flex;
        height: 100%;
    }
    .menu div {
        height: 100%;
        border-left: 1px solid #5c5c5c;
    }
    .tab {
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
        background-color: #5c5c5c;
    }
    .tab:hover {
        background-color: #4b4b4b;
    }
</style>

<div class="main-bar">
    <div style="width: {filtersWidth-20}px">
        <Link screen={ Screen.Home } params={ null }>
            <div class="home">
                HOME
            </div>
        </Link>
    </div>
    <div class="menu">
        {#if $State.ui.openScreen === Screen.Concept}
            <div class="tab" class:selected="{ $State.ui.screenParameters.widget === ConceptScreen.Lists }">
                <Link screen={ Screen.Concept } params={ { concept: $State.ui.screenParameters.concept, widget: ConceptScreen.Lists } }>
                    Lists
                </Link>
            </div>
            <div class="tab" class:selected="{ $State.ui.screenParameters.widget === ConceptScreen.Charts }">
                <Link screen={ Screen.Concept } params={ { concept: $State.ui.screenParameters.concept, widget: ConceptScreen.Charts } }>
                    Charts
                </Link>
            </div>
        {/if}
    </div>
</div>