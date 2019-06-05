import { Concept, Attribute, DataType } from "../model";

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
    };
}