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

    let nextItem;
    let prevItem;

    $: {        
        if ($State.ui.openScreen === Screen.Instance) {
            const concept = $State.data.concepts[$State.ui.lastOpenConcept];
            const identifier = Object.entries(concept.attributes).filter(a => a[1].type === DataType.Identifier).map(a => a[0])[0];
            const index = $State.ui.filteredItems.map(i => i[identifier]).indexOf($State.ui.screenParameters.instance);
            nextItem = index >= $State.ui.filteredItems.length ? 0 : $State.ui.filteredItems[index + 1] && $State.ui.filteredItems[index + 1][identifier];
            prevItem = index === 0 ? $State.ui.filteredItems[$State.ui.filteredItems.length - 1] : $State.ui.filteredItems[index - 1] && $State.ui.filteredItems[index - 1][identifier];
        }          
    }

</script>

<style>
    .top-bar-container {
        height:50px;
        background-color: rgb(49, 15, 15);
        border-bottom: 1px solid #222;
    }
    .home-bar {
        height: 100%;
    }
    .home-icon {
        padding-right: 5px;
    }
    .menu {
        display: flex;
        height: 23px;
    }
    .breadcrumb {
        height: 20px;        
    }    
    .breadcrumb-delimiter, .breadcrumb-option {
        font-size: 12px;
        color: #eee;        
    }
    .breadcrumb-delimiter {
        padding-right: 5px;       
    }
    .breadcrumb-option {
        cursor: pointer;
        padding-right: 5px;
    }
    .breadcrumb-option-toneddown {
        color: #999;
        padding-left: 3px;
    }
    .breadcrumb-option-highlighted {
        color: #fff;
    }
    .home-bar, .breadcrumb {
        display: flex;
        align-items: center;
        padding-left: 16px;
    }
    .home-bar .tab {
        font-size: 20px !important;
    }
    .home-bar .menu {
        height: 100% !important;
    }
    .app-name {
        font-size: 24px;
        font-family: cursive;
        padding: 0px 40px 0px 20px;
        color: #eee;
    }    
    .tab {
        height: 15px;
        margin-top: 5px;
        border-right: 1px solid #999;
        display: flex;
        align-items: center;
        padding: 0px 16px;
        color: #999;
        cursor: pointer;
        justify-content: center;
    }
    .home-bar .tab {
        height: 100%;
        margin-top: 0px;
        border-right: none;
    }
    .selected {
        color: #eee;
    }
    .article-title {
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0px 16px;
        color: #eee;
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
            <Link screen={ Screen.Concepts } params={{}}>
                <div style="cursor:pointer" class="home-icon">
                    <img style="width:15px;height:15px;margin-top: 4px;filter: invert(90%);" alt="h" src={homeIconSrc} />
                </div>
            </Link>
            {#if $State.ui.openScreen === Screen.Concept}
                <div class="breadcrumb-delimiter">
                    >
                </div>
                {#each Object.values($State.data.concepts) as concept (concept.name) }
                    <Link screen={ Screen.Concept } params={{ concept: concept.name, widget: ConceptScreen.Lists }}>
                        <div class="breadcrumb-option"
                            class:breadcrumb-option-highlighted="{concept.name === $State.ui.screenParameters.concept}"
                            class:breadcrumb-option-toneddown="{concept.name !== $State.ui.screenParameters.concept}">
                            { capitalize(concept.name) }
                        </div>
                    </Link>
                {/each}
            {/if}
            {#if $State.ui.openScreen === Screen.Instance}
                <Link screen={ Screen.Concept } params={{ concept: $State.ui.screenParameters.concept, widget: ConceptScreen.Lists }}>
                    <div class="breadcrumb-option">
                        > { capitalize($State.ui.screenParameters.concept) } >
                    </div>
                </Link>
                <div class="breadcrumb-option breadcrumb-option-highlighted">
                    <Link screen={ Screen.Concept } params={ { concept: $State.ui.screenParameters.concept, widget: ConceptScreen.Lists } }>
                        <div>{ capitalize($State.ui.screenParameters.instance) }</div>
                    </Link>
                </div>
                {#if nextItem }
                <div class="breadcrumb-option breadcrumb-option-toneddown"
                    style="padding-right:100px"
                    on:click={ () => goToInstance(1) }>
                    { nextItem } ...
                </div>
                {/if}                               
            {/if}
            {#if $State.ui.openScreen === Screen.Article}
                {#if $State.ui.screenParameters.instance}
                    <Link screen={ Screen.Concept } params={{ concept: $State.ui.screenParameters.concept, widget: ConceptScreen.Lists }}>
                        <div class="breadcrumb-option">
                            > { capitalize($State.ui.screenParameters.concept) }
                        </div>
                    </Link>
                    <Link screen={ Screen.Instance } params={{ concept: $State.ui.screenParameters.concept, instance: $State.ui.screenParameters.instance, widget: InstanceScreen.Mashups }}>
                        <div class="breadcrumb-option">
                            > { capitalize($State.ui.screenParameters.instance) }
                        </div>
                    </Link>
                    <Link screen={ Screen.Instance } params={{ concept: $State.ui.screenParameters.concept, instance: $State.ui.screenParameters.instance, widget: InstanceScreen.Articles }}>
                        <div class="breadcrumb-option">
                            > Articles
                        </div>
                    </Link>                    
                {:else}
                    <Link screen={ Screen.Articles }>
                        <div class="breadcrumb-option">
                            > Articles
                        </div>
                    </Link>
                {/if}
            {/if}
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

            {#if $State.ui.openScreen === Screen.Article}
                <div class="article-title">
                    { $State.data.articles[$State.ui.screenParameters.articleID] &&
                      $State.data.articles[$State.ui.screenParameters.articleID].title }
                </div>
            {/if}

        </div>
    {/if}
</div>