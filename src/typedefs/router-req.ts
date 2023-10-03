export interface RouterReq {
    verb: string;
    path: string;
    params: _.Dictionary<string>;
    search: _.Dictionary<string>;
    body: any;
}
