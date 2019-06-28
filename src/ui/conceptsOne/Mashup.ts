import { MashupConfig, Widget } from "../../model";
import { GRID_COLUMNS } from "../../constants";

interface WidgetPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Row {
    open: boolean;
    height: number;
    freeWidth: number;
    cols: Column[];
}

interface Column {
    width: number;
    freeHeight: number;
    widgets: WidgetPosition[];
}

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

// TODO - make better use of space, for now just sort by height
export function getLayoutSimplified(widgetsData) {
    return widgetsData
        .sort((a, b) => a.height - b.height)
        .map(w =>{        
            return {
                ...w,
                height: null,
                width: null,
            }
        });
}

export function getLayout(widgets : Widget[], width : number) : { [key: string] : WidgetPosition } {
    let layout = {};
    return layout;
}