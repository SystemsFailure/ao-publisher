export interface PublisherStrategy {
    convert(adsData: any): any;
    valid(filePath?: string): any;
    publish(data: any): any;
}