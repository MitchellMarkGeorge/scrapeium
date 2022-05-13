import { Block } from "./blocks";

export interface Query {
  rootBlock: Block;
}

export type Primitive = string | null | number | boolean
