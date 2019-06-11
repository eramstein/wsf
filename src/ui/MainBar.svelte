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
    }
    .menu div {
        padding-right: 20px;
    }
</style>

<div class="main-bar">
    <div style="width: {filtersWidth}px">
        <Link screen={ Screen.Home } params={ null }>
            <div class="home">
                HOME
            </div>
        </Link>
    </div>
    <div class="menu">
        {#if $State.ui.openScreen === Screen.Concept}
            <Link screen={ Screen.Concept } params={ { concept: $State.ui.screenParameters.concept, widget: ConceptScreen.Lists } }>
                <div class="tab">
                    Lists
                </div>
            </Link>
            <Link screen={ Screen.Concept } params={ { concept: $State.ui.screenParameters.concept, widget: ConceptScreen.Charts } }>
                <div class="tab">
                    Charts
                </div>
            </Link>  
        {/if}
    </div>
</div>