import { MashupConfig, Widget } from "../../model";

export function getDefaultConfig(widgets : { [key: string] : Widget }, mashups : MashupConfig[]) : MashupConfig {
    const allWidgets = Object.values(widgets).map(w => w.name);
    if (!mashups || mashups.length === 0) {
        return {
            id: 0,
            name: "Mashup",
            widgets: allWidgets,
        };
    }
    return mashups[0];
};

function getNewID() : number {
    return Math.floor(Math.random() * 1000000000000);
}

export function addDefaultIfNeeded(oldMashups : MashupConfig[], mashupConfig : MashupConfig) : MashupConfig[] {
    const isDefault = mashupConfig.id === 0 ? true : false;
    let newMashups = oldMashups || [];

    if (isDefault) {
        mashupConfig.id = getNewID();
        newMashups = [mashupConfig];
    }

    return newMashups;
};

export function getNewMashup() : MashupConfig {
    return {
        id: getNewID(),
        name: "New Mashup",
        widgets: [],
    }
};