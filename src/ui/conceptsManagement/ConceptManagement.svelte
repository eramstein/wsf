<script>
    import { State } from '../../stores';
    import { Screen, ConceptScreen } from '../../model';
    import { csvIntoRelations } from '../../logic/import';

    let concept = $State.data.concepts[$State.ui.screenParameters.concept];

    function loadItems(e) {
        e.preventDefault();
        // TODO
        return false;
    }

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
        margin-right: 20px;
        padding: 20px;
        height: 200px;
        width: 300px;
        font-size: 25px;
        align-items: center;
        justify-content: center;
    }
</style>

<div class="mgt">
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