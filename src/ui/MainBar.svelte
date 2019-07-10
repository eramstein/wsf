<script>
    import { State } from '../stores';
    import { Screen, ConceptScreen, InstanceScreen, DataType } from '../model';
    import { capitalize } from '../utils';
    import Link from './Link.svelte'
    import { FILTER_LABEL_WIDTH, FILTER_VALUE_WIDTH, FILTER_VALUE_PADDING } from './conceptsMany/filters';

    const filtersWidth = FILTER_LABEL_WIDTH + FILTER_VALUE_WIDTH + FILTER_VALUE_PADDING;

    function goToInstance(v) {
        const concept = $State.data.concepts[$State.ui.lastOpenConcept];
        const identifier = Object.entries(concept.attributes).filter(a => a[1].type === DataType.Identifier).map(a => a[0])[0];
        const index = $State.ui.filteredItems.map(i => i[identifier]).indexOf($State.ui.screenParameters.instance);
        let targetIndex = index + v;
        if (targetIndex < 0) {
            targetIndex = $State.ui.filteredItems.length - 1;
        }
        if (targetIndex >= $State.ui.filteredItems.length) {
            targetIndex = 0;
        }
        const targetInstance = $State.ui.filteredItems[targetIndex][identifier];                
        State.goTo(
            Screen.Instance,
            { concept: $State.ui.lastOpenConcept, instance: targetInstance, widget: $State.ui.screenParameters.widget }
        );
    }

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
    .instance-browser {
        display: flex;
        justify-content: space-between;
        padding-right: 20px;
        align-items: center;
    }
    .instance-arrow {
        font-weight: bold;
        padding-right: 8px;
        cursor: pointer;
        font-family: monospace;
        font-size: 21px;
    }
</style>

<div class="main-bar">
    <div class="top-left" style="width: {filtersWidth-20}px">
        <div class="page-name">
            {#if $State.ui.openScreen === Screen.Article}
                <Link screen={ Screen.Articles } params={ null }>
                    { $State.ui.screenParameters.articleID ?
                      $State.data.articles[$State.ui.screenParameters.articleID].title
                      :
                      'Articles List'
                    }
                </Link>
            {/if}          
            {#if $State.ui.openScreen === Screen.Concept}
                <Link screen={ Screen.Home } params={ null }>
                    { capitalize($State.ui.screenParameters.concept) }
                </Link>
            {/if}
            {#if $State.ui.openScreen === Screen.Instance}
                <div class="instance-browser">
                    <div class="instance-arrow" on:click={ () => goToInstance(-1) }>&lt;</div>
                    <Link screen={ Screen.Concept } params={ { concept: $State.ui.screenParameters.concept, widget: ConceptScreen.Lists } }>
                        <div>{ capitalize($State.ui.screenParameters.instance) }</div>
                    </Link>
                    <div class="instance-arrow" on:click={ () => goToInstance(1) }>&gt;</div>
                </div>                                
            {/if}
        </div>
    </div>
    <div class="menu">

        {#if $State.ui.openScreen === Screen.Home || $State.ui.openScreen === Screen.Concepts || $State.ui.openScreen === Screen.Articles }
            <Link screen={ Screen.Concepts } params={{}}>
                <div class="tab" class:selected="{ $State.ui.openScreen === Screen.Concepts }">                
                    Concepts                
                </div>
            </Link>
            <Link screen={ Screen.Articles } params={{}}>
                <div class="tab" class:selected="{ $State.ui.openScreen === Screen.Articles }">             
                    Articles                
                </div>
            </Link>
        {/if}

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