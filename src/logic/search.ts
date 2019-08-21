import { Data, SearchWordDefinition, ConceptScreen, InstanceScreen, SearchWordType } from "../model";

export enum NuggetType {
    Instance = "INSTANCE",
    Concept = "CONCEPT",
    Set = "SET",
    Attribute = "ATTRIBUTE",
    Widget = "WIDGET",
}

export enum OptionType {
    Endpoint = "ENDPOINT",
    Nugget = "NUGGET",
}

export interface Nugget {    
    type: NuggetType;
    props: NuggetPropsInstance | NuggetPropsConcept | NuggetPropsAttribute | NuggetPropsWidget | NuggetPropsSet;
}

export interface NuggetPropsInstance {    
    concept: string;
    instance: string;
}

export interface NuggetPropsConcept {    
    concept: string;
}

export interface NuggetPropsAttribute {    
    concept: string;
    attribute: string;
}

export interface NuggetPropsWidget {    
    concept: string;
    widget: string;
}

export interface NuggetPropsSet {    
    concept: string;
    attributeValues: [{ attribute: string; value: string; }];
}

export interface Option {    
    type: OptionType;
    nuggets: Nugget[];
    endpoint?: Endpoint;
}

export interface Endpoint {    
    text: string;
    destination: Screen | ConceptScreen | InstanceScreen;
}

export function buildSearchIndex(data : Data) {

    let words : string[] = [];
    let definitions : { [key: string] : SearchWordDefinition[] } = {};

    Object.values(data.concepts).forEach(c => {

        // CONCEPTS
        words = words.concat(c.name);
        if(!definitions[c.name]){
            definitions[c.name] = [];
        }
        definitions[c.name].push({
            type: SearchWordType.Concept,
            value: c.name,
        });        

        // INSTANCES
        words = words.concat(Object.keys(c.items));
        Object.keys(c.items).forEach(i => {
            if(!definitions[i]){
                definitions[i] = [];
            }
            definitions[i].push({
                type: SearchWordType.Instance,
                concept: c.name,
                value: i,
            });
        });

        // RELATIONS
        /*
            e.g. "actors" will be both a relation from movies and a concept
            "who played in" can be translated to "actors"
        */
        words = words.concat(c.relations.map(r => r.name));
        c.relations.forEach(r => {
            if(!definitions[r.name]){
                definitions[r.name] = [];
            }
            definitions[r.name].push({
                type: SearchWordType.Relation,
                concept: c.name,
                value: r.name,
                data: r,
            });
        });
            

        // ATTRIBUTES
        words = words.concat(Object.keys(c.attributes));
        Object.entries(c.attributes).forEach(a => {
            const attName = a[0];
            const v = a[1];
            if(!definitions[attName]){
                definitions[attName] = [];
            }
            definitions[attName].push({
                type: SearchWordType.Attribute,
                concept: c.name,                
                value: attName,
            });

            // ATTRIBUTE VALUES
            if (v.values) {
                words = words.concat(v.values);
                v.values.forEach(value => {
                    if(!definitions[value]){
                        definitions[value] = [];
                    }
                    definitions[value].push({
                        type: SearchWordType.AttributeValue,
                        value: value,
                        data: attName,
                        concept: c.name,
                    });
                });
            }            
            
        });

        // WIDGETS
        words = words.concat(Object.keys(c.widgets.one));
        words = words.concat(Object.keys(c.widgets.many));
        Object.keys(c.widgets.one).forEach(i => {
            if(!definitions[i]){
                definitions[i] = [];
            }
            definitions[i].push({
                type: SearchWordType.Widget,
                concept: c.name,                
                value: i,
            });
        });
        Object.keys(c.widgets.many).forEach(i => {
            if(!definitions[i]){
                definitions[i] = [];
            }
            definitions[i].push({
                type: SearchWordType.Widget,
                concept: c.name,                
                value: i,
            });
        });
        
    });
    
    Object.entries(data.user.preferences.concepts).forEach(concept => {
        const c = concept[0];
        const v = concept[1];

        // MASHUPS
        words = words.concat(v.mashups.map(m => m.name));
        v.mashups.forEach(m => {
            if(!definitions[m.name]){
                definitions[m.name] = [];
            }
            definitions[m.name].push({
                type: SearchWordType.Mashup,
                concept: c,                
                value: m.name,
            });
        });

        // LISTS
        words = words.concat(v.lists.map(m => m.name));
        v.lists.forEach(m => {
            if(!definitions[m.name]){
                definitions[m.name] = [];
            }
            definitions[m.name].push({
                type: SearchWordType.List,
                concept: c,                
                value: m.name,
            });
        });

    });

    return {
        words,
        definitions,
    };
}

// example relation search: star wars actors
// star wars => franchise value -> movies set
// actors => relations (lead roles, cameos, all...)

// words.forEach(v => {
//     if (search.indexOf(v) >= 0 || v.indexOf(search) >= 0) {                
//         results.push(dictionary[v]);
//     }
// });