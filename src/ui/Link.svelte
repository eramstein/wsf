<script>
    import { State } from '../stores';
    export let screen;
    export let params;
</script>

<div on:click={ () => State.goTo(screen, params) }>
	<slot></slot>
</div>