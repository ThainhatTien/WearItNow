export interface UserAddress {
    addressId: number;
    userId: number;
    toName: string;
    toPhone: string;
    toWardCode: string;
    toAddress: string;
    toDistrictId: number;
    toWardName: string;
    toDistrictName: string;
    toProvinceId: number;
    toProvinceName: string;
    isActive: boolean;
    
}



export interface Province {
    ProvinceID: number;
    ProvinceName: string;
  }
  
export interface District {
    DistrictID: number;
    DistrictName: string;
  }
  
export interface Ward {
    WardCode: string; 
    DistrictID: number;
    WardName: string;
  
  }

export interface UserAddressResponse {
    code: number;
    result: UserAddress[];
  }