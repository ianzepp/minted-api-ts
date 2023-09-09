export interface HttpRes {
    status: number;
    length: number;
    schema: string | undefined;
    record: string | undefined;
    filter: any;
    result: any;
}
