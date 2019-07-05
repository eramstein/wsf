<script>
    import { State } from '../../stores';
    import { Screen } from '../../model';
    import Link from '../Link.svelte';
    
    let articles = Object.values($State.data.articles);

</script>

<style>
</style>

<div>

    {#each articles as article (article.id) }
        <Link screen={ Screen.Article } params={{ articleID: article.id }}>
            <div class="article">
                { article.title }
            </div>
        </Link>        
    {/each}

</div>

