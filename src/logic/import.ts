import { Concept, Attribute, DataType } from "../model";

export interface RelationToPush {
    relation: string;
    object: string;
    subject: string;
    qualifiers: { [key: string] : any };
}

const TEXT_TYPE_TRESHOLD = 100;

// assumptions:
// - the first row is the attribute names
// - the first column is the unique identifier
// - the file name is the concept name
export function csvIntoConcept(csv: any, name: string) : Concept {
    const lines=csv.split("\n");
    const items = {};
    const headers = lines[0].split(",");
    const attributes = {};

    for(let i=1;i<lines.length;i++){
        const obj = {};
        const currentline = lines[i].split(",");
        for(let j=0;j<headers.length;j++){
            const val = currentline[j];
            if (!val || val === "") {
                obj[headers[j]] = null;
            } else {
                if (!isNaN(parseFloat(val)) && isFinite(val)) {
                    obj[headers[j]] = val*1;
                } else {
                    obj[headers[j]] = val;
                }
            }            
        }
        items[obj[Object.keys(obj)[0]]] = obj;
    }

    for(let j=0;j<headers.length;j++){
        attributes[headers[j]] = {
            name: headers[j],
            type: null,
            values: {},
        }
        if (j === 0) {
            attributes[headers[j]].type = DataType.Identifier;
        } else {
            for(let i=1;i<lines.length;i++){
                const val = lines[i].split(",")[j];
                if (val) {                
                    if (!isNaN(parseFloat(val)) && isFinite(val)) {                    
                        attributes[headers[j]].type = DataType.Numeric;
                    } else {
                        attributes[headers[j]].type = DataType.Categorical;
                        attributes[headers[j]].values[val] = true;
                    }
                    if (attributes[headers[j]].type === DataType.Numeric) {
                        break;
                    }
                    if (Object.keys(attributes[headers[j]].values).length > TEXT_TYPE_TRESHOLD) {
                        attributes[headers[j]].type = DataType.Text;
                        break;
                    }
                }
            }  
        }
        delete attributes[headers[j]].values;
    }
    
    return {
        name,
        items,
        attributes,
        widgets: { one:{}, many:{} },
        relations: [],
    };
}

// assumptions:
// - the first row is the attribute names
// - the first column is the relation name
// - the second column is the object name
// - the third column is the subject name
// - each subsequent column is a qualifier
export function csvIntoRelations(csv: any) : RelationToPush[] {
    const lines=csv.split("\n");
    const headers = lines[0].split(",").map(h => h.replace(/(\r\n|\n|\r)/gm, ""));
    const result = [];

    for(let i=1;i<lines.length;i++){
        const relationToPush = <RelationToPush>{};
        const currentline = lines[i].split(",");
        relationToPush.relation = currentline[0];
        relationToPush.object = currentline[1].replace(/(\r\n|\n|\r)/gm, "");
        relationToPush.subject = currentline[2].replace(/(\r\n|\n|\r)/gm, "");
        if (headers.length > 3) {
            for(let j=3;j<headers.length;j++){
                if (j === 3) {
                    relationToPush.qualifiers = {};
                }                
                relationToPush.qualifiers[headers[j]] =  currentline[j];           
            }
        }        
        result.push(relationToPush);
    }    
    return result;
}