<script>
    import { State } from '../../stores';

    import { csvIntoConcept } from '../../logic/import';

    export let concepts;    

    function loadFile(e) {
        e.preventDefault();

        const input = e.dataTransfer;

        if (input.files && input.files[0]) {
            const reader = new FileReader();
            const conceptName = input.files[0].name.substr(0, input.files[0].name.indexOf("."));            

            reader.onload = function (e) {
                const data = e.target.result;
                const newConcept = csvIntoConcept(data, conceptName);
                State.addConcept(newConcept);
            };

            reader.readAsText(input.files[0]);
        }
        return false;
    }

</script>

<style>
    .concepts {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 10px;
        grid-auto-rows: minmax(100px, 300px);
        height: 100%;
        background-color: #eee;
    }
    .concept {
        display: flex;
        align-items: center;
        justify-content: center;
        grid-column: 1;
        grid-row: 1;
        border: 1px solid #ccc;
        font-size: 100px;
        color: steelblue;
    }
</style>

<div class="concepts">
    <div class="concept" type="file"
        ondragenter="event.stopPropagation(); event.preventDefault();"
        ondragover ="event.stopPropagation(); event.preventDefault();"
        on:drop|preventDefault={ loadFile }>
        +
    </div>
    {#each Object.values(concepts) as concept (concept.name) }
        <div class="concept" on:click={ () => State.openConcept(concept.name) }>
            { concept.name }
        </div>
    {/each}
</div>