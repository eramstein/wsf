import { Position, Zone } from "./engine/world";
import { GameState } from "./engine/game";

export function zoneFromPosition(gs : GameState, position : Position) : Zone {    
    return gs.world.regions[position.region].places[position.place].zones[position.zone];
}