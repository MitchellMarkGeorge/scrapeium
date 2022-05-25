export interface Statement {
  type: StatementType;
}

export interface QueryStatement extends Statement {
  // a query statement is what is used to actuary query the "dom" of the page
  selectorString: string;
}

export interface SelectStatement extends Statement {
  // select statements are normally used after a query statement and set the value of the :element variavle to other values based on the given query
  // select a defined element that is relative to the current :element
  variable: string;
}

export interface SelectChildStatement extends Statement {
  selectedChild: number;
}

export interface ReadStatement extends Statement {
  variable: string;
}

export interface ReadAttributeStatement extends Statement {
  attribute: string;
}

export interface ToNumberStatement extends Statement {
  variable: string;
}

export enum StatementType {
  QUERY = "QUERY_STATEMENT",
  SELECT = "SELECT_STATEMENT",
  SELECT_CHILD = "SELECT_CHILD_STATEMENT",
  READ = "READ_STATEMENT",
  READ_ATTRIBUTE = "READ_ATTRIBUTE_STATEMENT",
  TO_NUMBER = "TO_NUMBER_STATEMENT",
}
