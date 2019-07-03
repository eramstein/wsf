<script>
    import { State } from '../stores';
    import { Screen, ConceptScreen, InstanceScreen } from '../model';
    import { capitalize } from '../utils';
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
        background-color: rgb(92, 92, 92);
    }
    .tab:hover {
        background-color: #4b4b4b;
    }
    .top-left {
        display: flex;
    }
    .page-name {
        text-align: center;
        flex-grow: 1;
    }
</style>

<div class="main-bar">
    <div class="top-left" style="width: {filtersWidth-20}px">
        <div class="page-name">    
            <Link screen={ Screen.Home } params={ null }>
                    {#if $State.ui.openScreen === Screen.Concept}
                        { capitalize($State.ui.screenParameters.concept) }
                    {/if}
                    {#if $State.ui.openScreen === Screen.Instance}
                        { capitalize($State.ui.screenParameters.instance) }
                    {/if}
                
            </Link>
        </div>
    </div>
    <div class="menu">

        {#if $State.ui.openScreen === Screen.Concept}
            <Link screen={ Screen.Concept } params={ { concept: $State.ui.screenParameters.concept, widget: ConceptScreen.Lists } }>
                <div class="tab" class:selected="{ $State.ui.screenParameters.widget === ConceptScreen.Lists }">                
                    Lists                
                </div>
            </Link>
            <Link screen={ Screen.Concept } params={ { concept: $State.ui.screenParameters.concept, widget: ConceptScreen.Charts } }>
                <div class="tab" class:selected="{ $State.ui.screenParameters.widget === ConceptScreen.Charts }">                
                    Charts                
                </div>
            </Link>
            <Link screen={ Screen.Concept } params={ { concept: $State.ui.screenParameters.concept, widget: ConceptScreen.Cards } }>
                <div class="tab" class:selected="{ $State.ui.screenParameters.widget === ConceptScreen.Cards }">                
                    Cards                
                </div>
            </Link>
        {/if}

        {#if $State.ui.openScreen === Screen.Instance}
            <Link screen={ Screen.Instance } params={ { concept: $State.ui.screenParameters.concept, instance: $State.ui.screenParameters.instance, widget: InstanceScreen.Mashups } }>
                <div class="tab" class:selected="{ $State.ui.screenParameters.widget === InstanceScreen.Mashups }">                
                    Mashups                
                </div>
            </Link>
            <Link screen={ Screen.Instance } params={ { concept: $State.ui.screenParameters.concept, instance: $State.ui.screenParameters.instance, widget: InstanceScreen.Relations } }>
                <div class="tab" class:selected="{ $State.ui.screenParameters.widget === InstanceScreen.Relations }">                
                    Relations                
                </div>
            </Link>
            <Link screen={ Screen.Instance } params={ { concept: $State.ui.screenParameters.concept, instance: $State.ui.screenParameters.instance, widget: InstanceScreen.Articles } }>
                <div class="tab" class:selected="{ $State.ui.screenParameters.widget === InstanceScreen.Articles }">                
                    Articles                
                </div>
            </Link>
        {/if}

    </div>
</div>