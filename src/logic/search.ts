import { State } from '../stores';
import { get } from "svelte/store";
import { Data, SearchWordDefinition, Screen, ConceptScreen, InstanceScreen, SearchWordType, Cardinality, ConceptRelation, FullState } from "../model";

export enum NuggetType {
    Instance = "INSTANCE",
    Concept = "CONCEPT",
    Set = "SET",
    Attribute = "ATTRIBUTE",
    Widget = "WIDGET",
}

export interface Nugget {
    ID?: number;
    replaceID?: number;
    type: NuggetType;
    // note: the "any" is because of the polymorphism (annyoying with ts-ignore),
    // the rest is here just for documentation purpose
    props: any | NuggetPropsInstance | NuggetPropsConcept | NuggetPropsAttribute | NuggetPropsWidget | NuggetPropsSet;
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

    let key, keys = Object.keys(definitions);
    let n = keys.length;
    let lowerCaseDefinitions={}
    while (n--) {
        key = keys[n];
        lowerCaseDefinitions[key.toLowerCase()] = definitions[key];
    }

    words = Array.from(new Set(words));
    
    return {
        words: words.map(w => w.toLowerCase()),
        definitions: lowerCaseDefinitions,
    };
}

export function searchIndex(search : string, currentNuggets: Nugget[]) : Nugget[] {
    const savedData : FullState = get(State);
    const index = savedData.data.search;
    const curatedText = search.toLowerCase();

    let foundDefinitions : SearchWordDefinition[] = [];
    index.words.forEach(v => {
        if (curatedText.indexOf(v) >= 0 || v.indexOf(curatedText) >= 0) {                
            foundDefinitions = foundDefinitions.concat(index.definitions[v]);
        }
    });    

    let nuggets : Nugget[] = foundDefinitions.map(def => {
        if (def.type === SearchWordType.Instance) {
            return {
                type: NuggetType.Instance,
                props: { concept: def.concept, instance: def.value },
            };
        }
        if (def.type === SearchWordType.Attribute) {
            return {
                type: NuggetType.Attribute,
                props: { concept: def.concept, attribute: def.value },
            };
        }
        if (def.type === SearchWordType.AttributeValue) {
            return {
                type: NuggetType.Set,
                props: {
                    concept: def.concept,
                    attributeValues: [{ attribute: def.data, value: def.value }],
                },
            };
        }
        if (def.type === SearchWordType.Widget) {
            return {
                type: NuggetType.Widget,
                props: { concept: def.concept, widget: def.value },
            };
        }
        // TODO: once filters handle relations, add many to many relationships 
        if (def.type === SearchWordType.Relation
            && def.data.cardinality === Cardinality.One) {
            const foundRelation = findRelatedInstance(def, currentNuggets, savedData.data);
            if (foundRelation) {
                const { instance, replaceID } = foundRelation;
                return {
                    type: NuggetType.Instance,
                    props: {
                        concept: def.data.concept,
                        instance,
                    },
                    replaceID,
                };
            } else  {
                return null;
            }
            
        }
    });
    
    return nuggets.filter(n => !!n);
}

// relation has to be of cardinality One
function findRelatedInstance(relation : SearchWordDefinition, currentNuggets: Nugget[], data : Data) : { instance: string, replaceID: number } {
    // find an instance of the related concept in the current widgets
    const instances = currentNuggets.filter(
        nugget =>
            nugget.type === NuggetType.Instance
            && nugget.props.concept === relation.concept
    );
    if (instances.length === 0) {
        return null;
    }
    const foundInstance = instances[instances.length - 1];
    // @ts-ignore    
    const foundInstanceName = foundInstance.props.instance;
    // get its relation value
    const instanceData = data.concepts[relation.concept].items[foundInstanceName];
    const relatedInstance =
        instanceData.__relations__ &&
        instanceData.__relations__[relation.value] &&
        instanceData.__relations__[relation.value].length > 0 &&
        instanceData.__relations__[relation.value][0].item;
    if (!relatedInstance) {
        return null;
    }
    return { instance: relatedInstance, replaceID: foundInstance.ID };
}

export function addNugget(nugget : Nugget, currentNuggets: Nugget[]) : Nugget[] {
    let newNuggets = [];
    if (nugget.type === NuggetType.Attribute) {
        newNuggets = currentNuggets.concat(nugget);
    }
    if (nugget.type === NuggetType.Concept) {
        // TODO - not useful for now
    }
    if (nugget.type === NuggetType.Instance) {
        newNuggets = currentNuggets.concat(nugget);
    }
    if (nugget.type === NuggetType.Set) {
        // if there is already a set on the same concept, combine filters
        let conceptFilter = null;
        let conceptFilterIndex = null;      
        currentNuggets.forEach((n, i) => {
            if (n.type === NuggetType.Set && n.props.concept === nugget.props.concept) {
                conceptFilter = {
                    type: NuggetType.Set,
                    props: {
                        concept: nugget.props.concept,                        
                        attributeValues:
                            n.props.attributeValues
                                .concat(nugget.props.attributeValues),
                    },
                };
                conceptFilterIndex = i;
            }
        });
        if (conceptFilter) {
            currentNuggets[conceptFilterIndex] = conceptFilter;
            newNuggets = currentNuggets;
        } else {
            newNuggets = currentNuggets.concat(nugget);
        }
    }
    if (nugget.type === NuggetType.Widget) {
        newNuggets = currentNuggets.concat(nugget);
    }
    return newNuggets;
}

export function navigateFromSearch(nuggets: Nugget[]) {
    console.log(nuggets);

    // 1 instance => instance mashups
    if (nuggets.length === 1 &&
        nuggets[0].type === NuggetType.Instance) {            
            State.goTo(Screen.Instance, {
                concept: nuggets[0].props.concept,
                instance: nuggets[0].props.instance,
                widget: InstanceScreen.Mashups,
            });
    }
    
}

// example relation search: star wars director picture
// example of 1 -> many not doable yet (filters don't support relations)