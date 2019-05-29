<script>
    import { State } from '../stores';
    import Concepts from './conceptsManagement/Concepts.svelte';
</script>

<style>
    .screen{
        height: 100vh;
        color: #333;
    }
</style>

<div class="screen">
    {#if $State.ui.openScreen === "HOME" || $State.ui.openScreen === "CONCEPTS"}
        <Concepts concepts={$State.data.concepts} />
    {/if}
</div>

