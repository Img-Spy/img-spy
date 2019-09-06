export interface ApiRequest<R = any> {
    id: string;
    type: string;
    request: R;
}
