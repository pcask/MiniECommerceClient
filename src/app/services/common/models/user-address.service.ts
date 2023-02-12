import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CityList } from 'src/app/contracts/user-address/city-list';
import { DistrictList } from 'src/app/contracts/user-address/district-list';
import { UserAddress } from 'src/app/contracts/user-address/user-address';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class UserAddressService {

  constructor(
    private httpClientService: HttpClientService
  ) { }

  async getUserAddresses() {
    const allAddresses$ = this.httpClientService.get({
      controller: "UserAddresses",
      action: "GetUserAddresses"
    });

    return await lastValueFrom(allAddresses$);
  }

  async addUserAddress(beCreated: UserAddress) {
    const beCreated$ = this.httpClientService.post({
      controller: "UserAddresses",
      action: "AddUserAddress"
    }, beCreated);

    await lastValueFrom(beCreated$);
  }

  async setUserAddressToShowcase(id: string) {
    const beShowcase$ = this.httpClientService.put({
      controller: "UserAddresses",
      action: "SetUserAddressToShowcase"
    }, {id});

    await lastValueFrom(beShowcase$);
  }

  async updateUserAddress(address: UserAddress) {
    const beUpdated$ = this.httpClientService.put({
      controller: "UserAddresses",
      action: "UpdateUserAddress"
    }, address);

    await lastValueFrom(beUpdated$);
  }

  async getAllCities() {
    const cities$ = this.httpClientService.get<CityList[]>({
      controller: "UserAddresses",
      action: "GetAllCities",
    });

    return await lastValueFrom(cities$);

  }

  async getAllDistrictsByCityId(cityId: string) {
    const districts$ = this.httpClientService.get<DistrictList[]>({
      controller: "UserAddresses",
      action: "GetAllDistrictsByCityId",
      queryString: `cityId=${cityId}`
    });

    return await lastValueFrom(districts$);

  }

  async getAllNeighborhoodsByDistrictId(districtId: string) {
    const neighborhoods$ = this.httpClientService.get<DistrictList[]>({
      controller: "UserAddresses",
      action: "GetAllNeighborhoodsByDistrictId",
      queryString: `districtId=${districtId}`
    });

    return await lastValueFrom(neighborhoods$);

  }
}
