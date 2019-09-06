import { Builder } from "./builder";


export type BuilderFunction<T extends Builder<any>> = (builder: T) => void;
