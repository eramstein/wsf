<script>
    /*
        LEVEL 1: simple template
            pass HTML in the template prop. double mustaches like {{ mana_cost }} get replaced with the content of data
            example of template:
            <style>div{color:red;}</style>
            <div>hello {{name}}</div>

        LEVEL 2: computed props
            pass HTML in the template prop + a script in the script prop
            the script is a self-executing anonymous function which return an object
            this function can assume a data variable in its containing scope which holds the entity's data
            the returned object properties can then be used as data in the template
            example of template and script:
            <div>hello {{name}}, double is {{doubled}}</div>
            (() => { return { doubled: data.power*2 } })()

        LEVEL 3: computed node
            pass a function that will compute the whole node to be rendered directly
            it is a self-executing anonymous function returning another f2 function
            f2 receives the entity's data and State as a parameters and returns the node
            example:
            (() => (data, State, get) => { 
                const node = document.createElement('div');
                node.innerHTML='itsa me, ' + data.name;
                node.onclick=()=>{ State.sayHello('ciao'); };
                return node; 
            })()

        // TODO
        LEVEL 4: a web component
            widgets which reference a web component will load these on app launch or after the widget is updated
            these web components can assume to receive data in a "data" property
            (or a function to get the data from the database if this is too much deserializing, TBD)
    */

    import { afterUpdate } from 'svelte';
    import { get } from "svelte/store";
    import { State } from '../stores';
    export let data;
    export let template;
    export let script;
    export let computednode;

    let container;
    let shadowRoot;   
    
    afterUpdate(() => {        

        if (!shadowRoot) {
            shadowRoot = container.attachShadow({mode: 'open'});
        }

		let computed = {};
        let createdNode;
        let filledTemplate;

        if (script) {
            computed = eval(script);
        }
        if (computednode) {
            // fully created nodes can use State store functions and get(State)        
            createdNode = eval(computednode)(data, State, get);
        } else {
            const allData = { ...data, ...computed };
            function replacer(match, p1) {
                return allData[p1];                
            }        
            filledTemplate = template.replace(/{{(.+?)}}/g, replacer);
        }        
        
        if (computednode) {
            console.log(shadowRoot.children.length);
            if (shadowRoot.children.length === 0) {
                console.log('APPEND');
                shadowRoot.appendChild(createdNode);
            }            
        } else {
            shadowRoot.innerHTML = filledTemplate;
        }        
        
	});

</script>

<div bind:this={container}>
</div>