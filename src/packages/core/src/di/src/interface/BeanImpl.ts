export interface BeanImpl<T> extends Function {
    new(...args: any[]): T;
}