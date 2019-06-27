import { FilterData } from "./ui/conceptsMany/Filters";
import { ChartConfig } from "./ui/conceptsMany/Chart";

export enum Screen {
    Home = "HOME",
    Concepts = "CONCEPTS",
    Concept = "CONCEPT",
    Instance = "INSTANCE",
    Articles = "ARTICLES",
    WidgetAuthoring = "WIDGET_AUTHORING",
}

export enum ConceptScreen {
    Lists = "LISTS",
    Charts = "CHARTS",
    Cards = "CARDS",
}

export enum InstanceScreen {
    Mashups = "MASHUPS",
    Articles = "ARTICLES",
}

export enum DataType {
    Identifier = "IDENTIFIER",
    Numeric = "NUMERIC",
    Categorical = "CATEGORICAL",
    Text = "TEXT",
}

export enum Cardinality {
    One = "one",
    Many = "many",
}

export interface FullState {
    ui: UI;
    data: Data;
}

export interface UI {
    openScreen: Screen;
    screenParameters: any;
    filteredItems: any[] | [];
    filterData: FilterData[];
    chartConfig: ChartConfig;
    widgetAuthoring: WidgetAuthoring;
    lastOpenWidget?: string;
}

export interface Data {
    concepts: { [key: string] : Concept };
    user: User;
}

export interface WidgetAuthoring {
    widget: Widget;
    conceptName: string;
    cardinality: Cardinality;    
}

export interface Concept {
    name: string;
    attributes: { [key: string] : Attribute };
    items: { [key: string] : any };
    widgets: {
        one: { [key: string] : Widget },
        many: { [key: string] : Widget },
    };
}

export interface Attribute {
    name: string;
    type: DataType;
}

export interface Widget {
    name: string;
    template?: string;
    script?: string;
    computedNode?: string;
    width: string;
    height: number;
}

export interface User {
    name: string;
    preferences: Preferences;
}

export interface Preferences {
    concepts: { [key: string] : ConceptPreferences } | {};
}

export interface ConceptPreferences {
    lists: ListConfig[];
    filters: { [key: string] : FilterConfig };
    mashups: MashupConfig[];
}

export interface ListConfig {
    id: number;
    name: string;
    sortBy: string;
    sortDirection: string;
    columns: { [key: string] : Column } | {};
    pages: number;
}

export interface Column {
    name: string;
    filterValue: string;
    display: boolean,
}

export interface FilterConfig {
    collapsed: boolean;
    limited: boolean;
    categories: { [key: string] : {
        selected: boolean;        
    } };
    from: number;
    to: number;
}

export interface MashupConfig {
    id: number;
    name: string;
    widgets: string[];
}