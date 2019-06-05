import { SpreadElement } from "estree";

export enum Screen {
    Home = "HOME",
    Concepts = "CONCEPTS",
    Concept = "CONCEPT",
    Instance = "INSTANCE",
    Articles = "ARTICLES",
}

export enum DataType {
    Identifier = "IDENTIFIER",
    Numeric = "NUMERIC",
    Categorical = "CATEGORICAL",
    Text = "TEXT",
} 

export interface FullState {
    ui: UI;
    data: Data;
}

export interface UI {
    openScreen: Screen;
    screenParameters: any;
    filteredItems: any[] | [];
}

export interface Data {
    concepts: { [key: string] : Concept };
    user: User;
}

export interface Concept {
    name: string;
    attributes: { [key: string] : Attribute };
    items: { [key: string] : any };
}

export interface Attribute {
    name: string;
    type: DataType;
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
    filters: [{ [key: string] : FilterConfig }];
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
    categories: { [key: string] : {
        selected: boolean;        
    } };
    from: number;
    to: number;
}