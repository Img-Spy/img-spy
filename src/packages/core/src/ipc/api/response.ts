export interface ApiResponse<R = any> {
    id: string;
    type: string;
    code: number;
    finished: boolean;
    response?: R;
}
