export interface IFilter {
    orderField?: string;
    orderDirection?: string ;
    page?: number;
    limit?: number;
    q?: string;
    startTime?: string;
    endTime?: string;
}