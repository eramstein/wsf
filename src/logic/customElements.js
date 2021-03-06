// NOTE: this is a JS file instead of TS to avoid transpiling issues
import { get } from "svelte/store";
import { State } from '../stores';

export function defineCustomElements(d) {
    Object.values(d).forEach(concept => {
        Object.values(concept.widgets.one).forEach(widget => {
            if (widget.nestable) {
                const name = 'wsf-' + widget.name.replace(/ /g, '-').toLowerCase();
                customElements.define(name, class extends HTMLElement {
                    constructor() {
                        super();                    
                        const shadowRoot = this.attachShadow({mode: 'open'});
                        let { script, template, computedNode } = widget;
                        let data = this.dataset;

                        let computed = {};
                        let createdNode;
                        let filledTemplate;
                        
                        if (script) {
                            computed = eval(script);
                        }
                        if (computedNode) {
                            createdNode = eval(computedNode)(data, State, get);
                        } else {
                            const allData = { ...data, ...computed };
                            function replacer(match, p1) {
                                return allData[p1];                
                            }        
                            filledTemplate = template.replace(/{{(.+?)}}/g, replacer);
                        }
                        
                        if (computedNode) {
                            shadowRoot.appendChild(createdNode);
                        } else {
                            shadowRoot.innerHTML = filledTemplate;
                        }
                    }
                });
            }
        });
    });
}

export function defineDataElement(get, State) {
    customElements.define('wsf-data', class extends HTMLElement {
        constructor() {
            super();
                              
            const shadowRoot = this.attachShadow({mode: 'open'});     
            
            // timeout to let Svelte set the data attributes
            setTimeout(() => {
                const { concept, instance, attribute, defval } = this.dataset;                
                const value = defval || get(State).data.concepts[concept].items[instance][attribute] || '';

                const inputNode = document.createElement('div');
                inputNode.contentEditable = true;
                inputNode.innerText = value;
                inputNode.onblur = e => {
                    // TODO - this is a fragile way to get the input's value
                    const inputValue = e.path[0].innerText;
                    State.setData(concept, instance, attribute, inputValue);
                }
                shadowRoot.appendChild(inputNode);
            }, 2);            
            
        }
    });
}