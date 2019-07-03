<script>
    import { State } from '../../stores';
    import { Screen, InstanceScreen } from '../../model';
    import Link from '../Link.svelte';

    export let item;
    export let conceptRelations;    
        
</script>

<style>
    .relations{
        display: flex;
        padding: 20px;
    }
    .block {
        padding: 20px;
    }
    .title {
        font-weight: bold;
        padding-bottom: 10px;
    }
    .link {
        padding-bottom: 5px;
        cursor: pointer;
    }
    .link:hover {
        text-decoration: cornflowerblue underline;
    }
</style>

<div class="relations">

    {#each conceptRelations || [] as relationType (relationType.name) }
        <div class="block">
            <div class="title">
                { relationType.name }
            </div>
            {#each item.__relations__[relationType.name] || [] as subject (subject.item) }
                <div class="link">
                    <Link screen={ Screen.Instance } params={ { concept: relationType.concept , instance: subject.item, widget: InstanceScreen.Mashups } }>
                        { subject.item }
                    </Link>
                </div>
            {/each}   
        </div>
    {/each}    
    
</div>