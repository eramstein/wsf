import { Concept, Attribute, DataType } from "../model";

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
            obj[headers[j]] = currentline[j];
        }
        items[obj[Object.keys(obj)[0]]] = obj;
    }

    for(let j=0;j<headers.length;j++){
        attributes[headers[j]] = {
            name: headers[j],
            type: null,
        }
        for(let i=1;i<lines.length;i++){
            const val = lines[i].split(",")[j];
            if (val) {                
                if (!isNaN(parseFloat(val)) && isFinite(val)) {                    
                    attributes[headers[j]].type = DataType.Numeric;
                } else {
                    attributes[headers[j]].type = DataType.Categorical;
                }
                break;
            }
        }       
    }
    
    return {
        name,
        items,
        attributes,
    };
}