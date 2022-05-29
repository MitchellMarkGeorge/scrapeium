import { Block } from "./blocks";

export interface Query {
  type: "QUERY_ROOT"; // mainly for veiwing purposes
  rootBlock: Block;
}

export type Primitive = string |  number | null | Element ; // for now
