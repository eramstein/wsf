<script>
    import { State } from '../../stores';
    import { Screen, ConceptScreen } from '../../model';
    import { csvIntoRelations } from '../../logic/import';

    $: concept = $State.data.concepts[$State.ui.screenParameters.concept];
    
    $: {
        if (!concept.banner) {
            concept.banner = '';
        }
        if (!concept.icon) {
            concept.icon = '';
        }
    }

    function save() {
        State.saveConcept(concept);
    }

    function loadItems(e) {
        e.preventDefault();
        // TODO
        return false;
    }

    // TODO: slow
    function loadRelations(e) {
        e.preventDefault();

        const input = e.dataTransfer;

        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const data = e.target.result;
                const relations = csvIntoRelations(data);                             
                relations.forEach(r => {
                    State.addRelation(concept.name, r.object, r.relation, r.subject, r.qualifiers);
                });                
            };

            reader.readAsText(input.files[0]);
        }
        return false;
    }

</script>

<style>
    .mgt {
        display: flex;
        padding: 20px;
    }
    .import {
        display: flex; 
        border: 1px solid #ccc;
        border-radius: 6px;        
        background-color: white;
        margin-bottom: 20px;
        padding: 20px;
        height: 200px;
        width: 300px;
        font-size: 25px;
        align-items: center;
        justify-content: center;
    }
    .attributes {
        margin-left: 50px;
    }
    .concept{
        display: flex;
    }
    .name {
        width: 150px;
        margin-right: 20px;
    }
    .images {
        margin-left: 50px;
    }
    .images div {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .image-title {
        width: 90px;
        padding-right: 10px;
        font-weight: bold;
    }
    .images div input {
        width: 300px;
    }
</style>

<div class="mgt">
    <div>
        <div>
            <div class="import" type="file"
                ondragenter="event.stopPropagation(); event.preventDefault();"
                ondragover ="event.stopPropagation(); event.preventDefault();"
                on:drop|preventDefault={ loadItems }>
                Import items
            </div>
        </div>
        <div>
            <div class="import" type="file"
                ondragenter="event.stopPropagation(); event.preventDefault();"
                ondragover ="event.stopPropagation(); event.preventDefault();"
                on:drop|preventDefault={ loadRelations }>
                Import relations
            </div>
        </div>
    </div>
    <div class="attributes">
        <div><b>Attributes</b></div>
        {#each Object.values(concept.attributes) as attribute }        
            <div class="concept">
                <div class="name">                
                    { attribute.name }
                </div>
                <div class="name">                
                    { attribute.type }
                </div>
            </div>        
        {/each}
    </div>
    <div class="images">
        <div>
            <div class="image-title">            
                Banner URL
            </div>
            <input bind:value={concept.banner} on:blur={() => save()}>
        </div>
        <div>
            <div class="image-title">            
                Icon URL
            </div>
            <input bind:value={concept.icon}>
        </div>
    </div>
</div>