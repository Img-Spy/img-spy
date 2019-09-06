

export interface Immutable<T> {
    set<A extends keyof T>(name: A, value: T[A]): Immutable<T>;

    setIn<A extends keyof T,  _A extends T[A],
          B extends keyof _A, _B extends _A[B]>(name: [A, B], value: _B);
    setIn<A extends keyof T,  _A extends T[A],
          B extends keyof _A, _B extends _A[B], 
          C extends keyof _B, _C extends _B[C]>(name: [A, B, C], value: _C);

    withMutations(mutator: (state: Immutable<T>) => void): Immutable<T>;
}

interface Test {
    name: string;
    content: {
        value: number;
        child: {
            foo: string;
        }
    };
}
