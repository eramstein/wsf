// NOTE: this is a JS file instead of TS to avoid transpiling issues

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
                            //TO TEST: can the computed node code use State.get() ? instead of passing all data, just an ID
                            createdNode = eval(computedNode)(data);
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