<script>
    import { State } from '../../stores';
    import { Screen } from '../../model';
    import Link from '../Link.svelte';
    import { getNewID } from '../../utils';

    $: aboutItems =  $State.ui.screenParameters && $State.ui.screenParameters.concept &&  $State.ui.screenParameters.instance ?
        [{ concept: $State.ui.screenParameters.concept, item: $State.ui.screenParameters.instance }]
    :
        null;
           
    $: articles = Object.values($State.data.articles);
    
    $: {        
        if (aboutItems) {
            articles = articles.filter(a => {            
                return a.aboutItems.map(i => i.concept + i.item).indexOf(aboutItems[0].concept + aboutItems[0].item) >= 0;
            });
        }
    }    

    function newArticle() {
        let newArticleID = getNewID();
        State.updateArticle(newArticleID, {
            id: newArticleID,
            title: 'New Article',
            content: '',
            aboutItems: aboutItems || [],
        });
        State.goTo(
            Screen.Article,
            { articleID: newArticleID, concept: $State.ui.screenParameters.concept, instance: $State.ui.screenParameters.instance  }
        );
    }

</script>

<style>
    .articles {
        padding: 20px;
    }
    .article {
        margin-top: 10px;
        cursor: pointer;
    }
</style>

<div class="articles">

    <button on:click={ () => newArticle() }>New Article</button>

    {#each articles as article (article.id) }        
        <Link screen={ Screen.Article } params={{ articleID: article.id }}>
            <div class="article">
                <a>
                    { article.title }
                </a>
            </div>
        </Link>
        
    {/each}

</div>

