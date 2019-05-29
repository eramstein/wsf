export enum Screen {
    Home = "HOME",
    Concepts = "CONCEPTS",
    Concept = "CONCEPT",
    Instance = "INSTANCE",
    Articles = "ARTICLES",
}

export enum DataType {
    Numeric = "NUMERIC",
    Categorical = "CATEGORICAL",
} 

export interface FullState {
    ui: UI;
    data: Data;
}

export interface UI {
    openScreen: Screen;
    screenParameters: any;
}

export interface Data {
    concepts: { [key: string] : Concept };
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