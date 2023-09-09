export interface HttpRes {
    status: number;
    length: number;
    schema: string | undefined;
    record: string | undefined;
    result: any;
}
