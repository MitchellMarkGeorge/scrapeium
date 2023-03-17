import type { ReactNode } from "react";

  export const getValidChildren = (children: ReactNode): NonNullable<ReactNode>[]=> {
    if (Array.isArray(children)) {
        return children.filter(isValidChild)
    } else if (isValidChild(children)) {
        return [children] as NonNullable<ReactNode>[];
    } else return [];


  }

  const isValidChild = (child: React.ReactNode) => {
    return child !== undefined && child !== null && typeof child !== "boolean";
  }

