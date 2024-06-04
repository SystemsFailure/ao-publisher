export interface ConvertInXMLOptions {
    outputPath?: string;
    fileName?: string;
    xmlOptions?: any;
}

export interface AuthorizationResponse {
    access_token: string;
}

export interface Credentials {
    client_id: string;
    client_secret: string;
}

export interface AdData {
    Id: number;
    AdStatus: string;
    Category: string;
    OperationType: string;
    Address: string;
    DateBegin: string;
    DateEnd: string;
    Title: string;
    Description: string;
    Rooms: string;
    Square: string;
    Floor: string;
    Floors: string;
    TypeHome: string;
    PropertyRights: string;
    LeaseType: string;
    LeaseCommissionSize: string;
    LeaseDeposit: string;
    Price: number;
    ContactMethod: string;
    ManagerName: string;
    ContactPhone: string;
    ImageNames: string;
    ImageUrls: string;
    ParkingType: string;
    RoomType: string;
    Renovation: string;
    KitchenSpace: number;
    UtilityMeters: string;
    OtherUtilities: string;
    OtherUtilitiesPayment: number;
    SmokingAllowed: string;
    ChildrenAllowed: string;
    PetsAllowed: string;
    LeaseComfort: string;
    LeaseMultimedia: string;
    LeaseBeds: string;
    LivingSpace: string;
    Documents: string;
    BuiltYear: number;
    Furniture: string;
    BathroomMulti: string;
    Parking: string;
    PassengerElevator: string;
    FreightElevator: string;
    Status: string;
    LeaseAppliances: string;
    BalconyOrLoggiaMulti: string;
    SafeDemonstration: string;
    // 'Вариант платного размещения': string;
}