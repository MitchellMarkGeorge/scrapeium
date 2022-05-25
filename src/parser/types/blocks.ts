import { Statement } from "./statements"

export enum BlockType {
  EXPRESSION_BLOCK = "EXPRESSION_BLOCK",
  ARRAY_BLOCK = "ARRAY_BLOCK",
  OBJECT_BLOCK = "OBJECT_BLOCK"
}

export interface Block {
  type: BlockType
  blockPrefix: BlockPrefix | null
  // should there be a body property
}

export interface BlockPrefix {
  value: string // should this be selector
}

export interface ArrayBlock extends Block {
  body: ExpressionBlock | ObjectBlock
}

export interface ExpressionBlock extends Block {
  body: Statement | Statement[] 
}

export interface ObjectBlock extends Block {
  body: KeyValue[]
}

export interface KeyValue {
  type: "KEY_VALUE"
  key: string
  value: Block // Block
}
