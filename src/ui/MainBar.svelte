<script>
    import { State } from '../stores';
    import { Screen, ConceptScreen, InstanceScreen, DataType } from '../model';
    import { capitalize } from '../utils';
    import Link from './Link.svelte'
    import { FILTER_LABEL_WIDTH, FILTER_VALUE_WIDTH, FILTER_VALUE_PADDING } from './conceptsMany/filters';

    const filtersWidth = FILTER_LABEL_WIDTH + FILTER_VALUE_WIDTH + FILTER_VALUE_PADDING;
    const homeIconSrc = "https://img.icons8.com/pastel-glyph/2x/home.png";    
    
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

    $: otherConcepts = $State.ui.openScreen === Screen.Concept ?
        Object.values($State.data.concepts).filter(c => c.name !== $State.ui.screenParameters.concept)    
    : [];

</script>

<style>
    .top-bar-container {
        height:100%;
        background-color: rgb(66, 21, 21);
    }
    .home-bar {
        height: 100%;
    }
    .breadcrumb {
        height: 33%;
        border-bottom: 1px solid #5c5c5c;
    }
    .breadcrumb-delimiter, .breadcrumb-option {
        font-size: 12px;
        color: #eee;
        padding: 0px 5px;
        cursor: pointer;
    }
    .home-bar, .breadcrumb {
        display: flex;
        align-items: center;
        padding-left: 28px;
    }
    .home-bar .tab {
        font-size: 20px !important;
    }
    .home-bar .menu {
        height: 100% !important;
        border-bottom: none  !important;
    }
    .app-name {
        font-size: 24px;
        font-family: cursive;
        padding: 0px 40px 0px 20px;
        color: #eee;
    }
    .menu {
        display: flex;
        height: 66%;
        border-bottom: 1px solid #5c5c5c;
    }
    .menu div {
        height: 100%;
        border-right: 1px solid #5c5c5c;
    }
    .tab {
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0px 20px;
        color: #eee;
        cursor: pointer;
        min-width: 100px;
        justify-content: center;
    }
    .selected, .selected:hover {
        background-color: rgb(92, 36, 36);
    }
    .tab:hover {
        background-color: rgb(92, 36, 36);
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

<div class="top-bar-container">
    {#if $State.ui.openScreen === Screen.Home || $State.ui.openScreen === Screen.Concepts || $State.ui.openScreen === Screen.Articles }
        <div class="home-bar">
            <div>
                <img style="width:30px;height:30px;filter: invert(90%);" src={homeIconSrc} />
            </div>
            <div class="app-name">
                MOSAIC
            </div>
            <div class="menu">
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
            </div>
        </div>
    {:else}
        <div class="breadcrumb">
            <Link screen={ Screen.Home } params={{}}>
                <div style="cursor:pointer">
                    <img style="width:15px;height:15px;filter: invert(90%);" src={homeIconSrc} />
                </div>
            </Link>
            {#if $State.ui.openScreen === Screen.Concept}
                <div class="breadcrumb-delimiter">
                    >
                </div>
                {#each Object.values($State.data.concepts) as concept (concept.name) }
                    <Link screen={ Screen.Concept } params={{ concept: concept.name, widget: ConceptScreen.Lists }}>
                        <div class="breadcrumb-option" style="font-weight:{concept.name === $State.ui.screenParameters.concept ? 'bold' : ''}">
                            { capitalize(concept.name) }
                        </div>
                    </Link>
                {/each}
            {/if}            
        </div>
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
    {/if}
</div>