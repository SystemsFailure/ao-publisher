export interface PublisherStrategy {
    convert(adsData: any): any;
    publish(data: any): any;
}