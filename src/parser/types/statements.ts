export interface Statement {
 type: StatementType; 
}



export interface QueryStatement extends Statement {
  // a query statement is what is used to actuary query the "dom" of the page
  stringValue: string
}

export interface SelectStatement extends Statement {
  // select statements are normally used after a query statement and set the value of the :element variavle to other values based on the given query
  // select a defined element that is relative to the current :element
  variable: string
}

export interface SelectChildStatement extends Statement {
  selectedChild: number
}

export interface ReadStatement extends Statement {
  variable: string
}

export interface ReadAttributeStatement extends Statement {
  attribute: string
}

export interface ToNumberStatement extends Statement {
  variable: string
}

export enum StatementType {
  QUERY,
  SELECT,
  SELECT_CHILD,
  READ,
  READ_ATTRIBUTE,
  TO_NUMBER
}
