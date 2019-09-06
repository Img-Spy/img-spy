export function filter<T>(input: T, f: (input: T) => boolean): T {
    return f(input) ? input : undefined;
}
