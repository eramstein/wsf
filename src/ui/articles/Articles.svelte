<script>
    import { State } from '../../stores';
    import { Screen, InstanceScreen } from '../../model';
    import Link from '../Link.svelte';
    import { getNewID } from '../../utils';

    $: aboutItems =  $State.ui.screenParameters && $State.ui.screenParameters.concept &&  $State.ui.screenParameters.instance ?
        [{ concept: $State.ui.screenParameters.concept, item: $State.ui.screenParameters.instance }]
    :
        null;
             
    $: articles = Object.values($State.data.articles);

    $: concept = null;
    $: instance = null;
    
    $: {        
        if (aboutItems) {
            articles = articles.filter(a => {            
                return a.aboutItems.map(i => i.concept + i.item).indexOf(aboutItems[0].concept + aboutItems[0].item) >= 0;
            });
            if (aboutItems.length === 1) {
                concept = aboutItems[0].concept;
                instance = aboutItems[0].item;
            }
        }
    }    

    function newArticle() {
        let newArticleID = getNewID();
        State.updateArticle(newArticleID, {
            id: newArticleID,
            title: null,
            content: '',
            aboutItems: aboutItems || [],
        });
        State.goTo(
            Screen.Article,
            {
                articleID: newArticleID,
                concept: $State.ui.screenParameters && $State.ui.screenParameters.concept,
                instance: $State.ui.screenParameters && $State.ui.screenParameters.instance,
            }
        );
    }

</script>

<style>
    .articles {
        padding-top: 20px;
    }
    .new-button {
        margin-left: 20px;
    }
    .article {
        padding: 20px;
        margin-top: 10px;
        cursor: pointer;
        height: 95px;
        border-top: 1px solid #ccc;
        position: relative;
        overflow: hidden;
    }
    .about-items {
        position: absolute;
        top: 10px;
        right: 10px;
        float: right;
    }
    .item {
        margin: 0px 5px;
        border: 1px solid #ccc;
        background-color: #eee;
        padding: 3px 10px;
        font-size: 13px;
        display: flex;
    }
    .item img {
        height: 20px;
        width: 15px;
        margin-right: 5px;
    }
    .item:hover {
        background-color: rgb(184, 208, 228);
    }
    .title {
        font-weight: bold;
        padding-bottom: 5px;
    }
    .content {
        overflow: hidden;
    }
</style>

<div class="articles">

    <div class="new-button">
        <button on:click={ () => newArticle() }>New Article</button>
    </div>    

    {#each articles as article (article.id) }        
        <Link screen={ Screen.Article }
            params={{ 
                articleID: article.id,
                concept: concept,
                instance: instance,
            }}>
            <div class="article">
                <div class="title">
                    { article.title }
                </div>
                <div class="about-items">
                    {#each article.aboutItems as aboutItem }
                        <Link screen={ Screen.Instance }
                            params={{
                                widget: InstanceScreen.Mashups,
                                concept: aboutItem.concept,
                                instance: aboutItem.item,
                            }}>
                            <div class="item">
                                <img
                                    src={$State.data.concepts[aboutItem.concept].icon}
                                    alt="" />
                                { aboutItem.item }
                            </div>
                        </Link>
                    {/each}
                </div>
                {#if article.summary || article.content }
                <div class="content">
                    { article.summary || article.content.substr(0, 600) }
                </div>
                {/if}
            </div>
        </Link>        
    {/each}

</div>

