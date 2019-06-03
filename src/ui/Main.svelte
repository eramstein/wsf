<script>
    import { State } from '../stores';
    import MainBar from './MainBar.svelte'
    import Concepts from './conceptsManagement/Concepts.svelte';
    import List from './conceptsMany/List.svelte';
</script>

<style>
    .screen{
        display: flex;
        flex-flow: column;
        height: 100%;
        color: #333;
    }
    .top {
        height: 40px;
        flex: 0 1 auto;
    }
    .contents {
        flex: 1 1 auto;
    }
</style>

<div class="screen">

    <div class="top">
        <MainBar />
    </div>

    <div class="contents">

        {#if $State.ui.openScreen === "HOME" || $State.ui.openScreen === "CONCEPTS"}
            <Concepts concepts={$State.data.concepts} />
        {/if}

        {#if $State.ui.openScreen === "CONCEPT"}
            <List concept={$State.data.concepts[$State.ui.screenParameters.concept]} />
        {/if}    

    </div>   

</div>

