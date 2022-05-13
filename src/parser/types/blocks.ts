import { Statement } from "./statements"

export enum BlockType {
  EXPRESSION_BLOCK,
  ARRAY_BLOCK,
  OBJECT_BLOCK
}

export interface Block {
  type: BlockType
  blockPrefix?: BlockPrefix
  // should there be a body property
}

export interface BlockPrefix {
  value: string
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
  key: string
  value: Block
}
