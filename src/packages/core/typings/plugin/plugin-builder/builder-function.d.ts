import { Builder } from "./builder";
export declare type BuilderFunction<T extends Builder<any>> = (builder: T) => void;
