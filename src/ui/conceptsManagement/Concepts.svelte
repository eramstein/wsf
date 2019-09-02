<script>
    import { State } from '../../stores';
    import Link from '../Link.svelte';
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
        flex-direction: column;        
        box-shadow: 0 2px 12px #b7c9dd;
        border-radius: 6px;        
        background-color: white;
        min-height: 300px;
        overflow: hidden;
        transition: all .16s linear;
        cursor: pointer;            
    }
    .concept:hover {
        box-shadow: 0 4px 16px #8f99a5;
        top: -1px;
        position: relative;    
    }
    .name {
        font-size: 40px;
    }
    .stats {
        display: flex;
        flex-direction: column;
        align-self: flex-end;
        height: 80px;
        background-color: rgba(255, 255, 255, 0.8);
        width: 100%;
        bottom: 0;
        left: 0;
        position: absolute;
        padding-left: 20px;
        padding-top: 10px;
    }
    .plus {
        font-size: 100px;
        color: steelblue;
        align-items: center;
        justify-content: center;
    }
    .inside {
        display: flex;
        flex-direction: column;
        min-height: 300px;
        position: relative;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;  
    }
</style>

<div class="concepts">    
    {#each Object.values(concepts) as concept (concept.name) }        
        <div class="concept">
            <Link screen={ Screen.Concept } params={ { concept: concept.name, widget: ConceptScreen.Lists } }>
                <div class="inside" style="background-image: url({concept.banner})">
                    <div class="stats">
                        <div class="name">                
                            { Object.keys(concept.items).length.toLocaleString('fr', {useGrouping:true}) } { concept.name }
                        </div>
                        <div class="metadata">
                            <Link screen={ Screen.Concept } params={ { concept: concept.name, widget: ConceptScreen.Management } }>
                                { Object.keys(concept.attributes).length } attributes, { concept.relations.length.toLocaleString('fr', {useGrouping:true}) } relations
                            </Link>
                        </div>              
                    </div>
                </div>
            </Link>        
        </div>
    {/each}
    <div class="concept plus" type="file"
        ondragenter="event.stopPropagation(); event.preventDefault();"
        ondragover ="event.stopPropagation(); event.preventDefault();"
        on:drop|preventDefault={ loadFile }>
        +
    </div>
</div>