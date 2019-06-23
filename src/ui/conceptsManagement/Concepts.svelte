<script>
    import { State } from '../../stores';
    import Link from '../Link.svelte';
    import Widget from '../Widget.svelte';
    import { Screen, ConceptScreen } from '../../model';

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

    const dawid = {
        name: "dawid",
        concept: "card",
        template:"<style> div{color:red;}</style><div>hello {{name}}, double is {{doubled}}</div>",
        script:"(() => { return { doubled: data.power*2 } })()",
        computedNode:`
            (() => data => { 
                const node = document.createElement('div');
                node.innerHTML='itsa me, ' + data.name;
                node.onclick=()=>{ alert('ciao'); };
                return node; 
            })()
        `,
    };

    const data = {
        name: "Mario",
        power: 4501,
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
        padding: 10px;
        box-sizing: border-box;
    }
    .concept {
        display: flex;
        align-items: center;
        justify-content: center;
        grid-column: 1;
        grid-row: 1;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 100px;
        color: steelblue;
        background-color: white;
        min-height: 300px;
        cursor: pointer;
    }
</style>

<div class="concepts">

    <Widget template={ dawid.template } script={ dawid.script } computedNode={ dawid.computedNode } data={ data } />

    <div class="concept" type="file"
        ondragenter="event.stopPropagation(); event.preventDefault();"
        ondragover ="event.stopPropagation(); event.preventDefault();"
        on:drop|preventDefault={ loadFile }>
        +
    </div>
    {#each Object.values(concepts) as concept (concept.name) }
        <Link screen={ Screen.Concept } params={ { concept: concept.name, widget: ConceptScreen.List } }>
            <div class="concept">
                { concept.name }
            </div>
        </Link>
    {/each}
</div>