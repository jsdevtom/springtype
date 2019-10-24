
export type IVirtualNodeType = string;
export interface IVirtualNodeAttributes {
  key?: string;
  ref?: string;
  [attributeName: string]: any;
}

export interface ISlotChildren {
  // default can be an Array
  [slotName: string]: IVirtualNode|Array<IVirtualNode>
}

export interface IVirtualNode<A = IVirtualNodeAttributes> {
  type: IVirtualNodeType;
  attributes: A;
  children: IVirtualChildren;
  slotChildren?: ISlotChildren;
}

export type IVirtualKey = string | number | any;
export type IVirtualRefObject<T> = { current?: T | null };
export type IVirtualRefCallback<T> = (instance: T | null) => void;
export type IVirtualRef<T> = IVirtualRefObject<T> | IVirtualRefCallback<T>;

export type IVirtualChild = IVirtualNode<any> | object | string | number | boolean | null | undefined;

export type IVirtualChildren = IVirtualChild[];
