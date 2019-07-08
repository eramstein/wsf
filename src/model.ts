import { FilterData } from "./ui/conceptsMany/Filters";
import { ChartConfig } from "./ui/conceptsMany/Chart";

export enum Screen {
    Home = "HOME",
    Concepts = "CONCEPTS",
    Concept = "CONCEPT",
    Instance = "INSTANCE",
    Articles = "ARTICLES",
    Article = "ARTICLE",
    WidgetAuthoring = "WIDGET_AUTHORING",
}

export enum ConceptScreen {
    Lists = "LISTS",
    Charts = "CHARTS",
    Cards = "CARDS",
    Management = "MANAGEMENT",
}

export enum InstanceScreen {
    Mashups = "MASHUPS",
    Articles = "ARTICLES",
    Relations = "RELATIONS",
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
    lastOpenConcept?: string;
    lastOpenWidget?: string;
    history: NavigationStep[];
}

export interface Data {
    concepts: { [key: string] : Concept };
    articles: { [key: string] : Article };
    user: User;
}

export interface Article {
    id: string;
    title: string;
    aboutItems: { concept: string; item: string; }[];
    content: string;
}

export interface NavigationStep {
    openScreen: Screen;
    screenParameters: any;  
}

export interface WidgetAuthoring {
    widget: Widget;
    conceptName: string;
    cardinality: Cardinality;    
}

export interface Concept {
    name: string;
    attributes: { [key: string] : Attribute };
    items: { [key: string] : Item };
    widgets: {
        one: { [key: string] : Widget },
        many: { [key: string] : Widget },
    };
    relations: ConceptRelation[];
}

export interface Attribute {
    name: string;
    type: DataType;
}

export interface Item {
    __relations__?: { [key: string] : ItemRelation[] };
}

export interface Widget {
    name: string;
    template?: string;
    script?: string;
    computedNode?: string;
    width: string;
    height: number;
    inMashups: boolean;
    inLists: boolean;
    nestable: boolean;
    props?: string[];
}

export interface ConceptRelation {
    name: string;
    concept: string;
    cardinality: Cardinality;
    qualifiers: { name: string; type: string; }[];
}

export interface ItemRelation {
    item: string;
    qualifiers: { [key: string] : any };
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
    widgets: { [key: string] : boolean } | {};
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