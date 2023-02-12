import { Component, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CityList } from 'src/app/contracts/user-address/city-list';
import { DistrictList } from 'src/app/contracts/user-address/district-list';
import { NeighborhoodList } from 'src/app/contracts/user-address/neighborhood-list';
import { UserAddress } from 'src/app/contracts/user-address/user-address';
import { UserAddressService } from '../../common/models/user-address.service';
import { ScriptService } from '../../common/script.service';

declare var $: any;

const scriptPath = 'assets/scripts/user-address-form.js';

@Component({
  selector: 'app-user-address-modal',
  templateUrl: './user-address-modal.component.html',
  styleUrls: ['./user-address-modal.component.scss']
})
export class UserAddressModalComponent implements OnInit {

  constructor(
    private scriptService: ScriptService,
    private renderer: Renderer2,
    private userAddressService: UserAddressService,
    private formBuilder: FormBuilder
  ) {

  }

  @Output() userAddressModalSubmitEvent: EventEmitter<boolean> = new EventEmitter();

  addressId: string = null;

  cities: CityList[];
  districts: DistrictList[];
  neighborhoods: NeighborhoodList[];
  addressForm: FormGroup;
  submitted: boolean = false;
  isCorporate: boolean = false;

  get Controls() {
    return this.addressForm.controls
  }

  async ngOnInit(): Promise<void> {

    this.loadJsFiles();

    this.loadCities();

    this.addressForm = this.formBuilder.group({
      firstName: [null, [Validators.required, Validators.maxLength(30)]],
      lastName: [null, [Validators.required, Validators.maxLength(30)]],
      phoneNumber: ["0(5__) ___ __ __", [Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      provinceId: ["", [Validators.required]],
      districtId: ["", [Validators.required]],
      neighborhoodId: ["", [Validators.required]],
      addressDetail: [null, [Validators.required, Validators.maxLength(250)]],
      addressTitle: [null, [Validators.required, Validators.maxLength(30)]],
      tin: [null, [Validators.maxLength(11)]],
      taxOffice: [null, [Validators.maxLength(120)]],
      companyName: [null, [Validators.maxLength(120)]],
      isEInvoicePayer: [null],
    });

  }

  async onSubmit(userAddress: UserAddress) {
    this.submitted = true;

    // Javascript tarafında phoneNumber control'ünde ilk olarak mask işlemi için kullanılan keydown event'i tetiklenmektedir ve  
    // ReactiveForm'da da tanımlanan phoneNumber control'üne değişiklikler yansıMAMAktadır ve bu yüzden validator'lar da çalışmamaktadır.
    // Bu sebebden dolayı phoneNumber'ın güncel değerini jQuery ile yakalıyorum
    const currentPhoneNumber: string = $("#inputPhoneNumber").val();

    // Reactive Form içerisindeki herhangi bir control'e değer atamak için;
    this.addressForm.patchValue({
      phoneNumber: currentPhoneNumber
    });
    userAddress.phoneNumber = currentPhoneNumber.replace(/\s/g, '').replace(/_/g, '').replace('(', '').replace(')', '');

    if (!/[0-9]*/.test(userAddress.phoneNumber) || userAddress.phoneNumber.length !== 11)
      return;

    if (this.addressForm.invalid)
      return;

    if (this.isCorporate && (userAddress.tin == null || userAddress.taxOffice == null || userAddress.companyName == null))
      return;


    userAddress.zipCode = this.neighborhoods.find(n => n.id == userAddress.neighborhoodId).zipCode;

    if (this.addressId !== null) { // Edit işlemi yapılıyorsa
      userAddress.id = this.addressId;
      await this.userAddressService.updateUserAddress(userAddress);
    }
    else
      await this.userAddressService.addUserAddress(userAddress);

    $('#userAddressModal').modal('hide');

    this.userAddressModalSubmitEvent.emit();

  }

  async loadUserAddressModalToAdd() {

    this.submitted = false;
    this.addressId = null;

    this.addressForm.reset();
    this.addressForm.markAsTouched();
    this.addressForm.markAsPristine();
    $('#addressForm').removeClass("was-validated");
    $('#addressForm').removeClass("ng-submitted");


    $('#modalTitle').text('Add Address');
    $('#selectDistrict').addClass('select-disabled');
    $('#selectNeighborhood').addClass('select-disabled');

    this.loadCities();

    this.addressForm = this.formBuilder.group({
      firstName: [null, [Validators.required, Validators.maxLength(30)]],
      lastName: [null, [Validators.required, Validators.maxLength(30)]],
      phoneNumber: ["0(5__) ___ __ __", [Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      provinceId:["", Validators.required],
      districtId: ["", Validators.required],
      neighborhoodId: ["", Validators.required],
      addressDetail: [null, [Validators.required, Validators.maxLength(250)]],
      addressTitle: [null, [Validators.required, Validators.maxLength(30)]],
      tin: [null, [Validators.maxLength(11)]],
      taxOffice: [null, [Validators.maxLength(120)]],
      companyName: [null, [Validators.maxLength(120)]],
      isEInvoicePayer: [null],
    });

    $('#userAddressModal').modal('show');

  }

  async loadUserAddressModalToEdit(add: UserAddress) {

    this.addressId = add.id;

    $('#modalTitle').text('Edit Address');
    $('#selectDistrict').removeClass('select-disabled');
    $('#selectNeighborhood').removeClass('select-disabled');

    if (add.companyName !== null && add.tin !== null && add.taxOffice !== null)
      this.showCorporateSection();

    await this.loadCities();
    await this.loadDistricts(add.provinceId.toString());
    await this.loadNeighborhoods(add.districtId.toString());

    // Select'lerin doğru seçili değerler ile gelmesini sağlamak için küçük bir ms beklemem gerekti, aksi halde mahalle bilgisi modal ilk çağrımından sonra 
    // ilk değer ile gelmektedir, yani doğru değeri yansıtmamaktadır.
    setTimeout(() => {
      const pA = add.phoneNumber.split('');

      this.addressForm.patchValue({
        firstName: add.firstName,
        lastName: add.lastName,
        phoneNumber: pA[0] + "(" + pA[1] + pA[2] + pA[3] + ") " + pA[4] + pA[5] + pA[6] + " " + pA[7] + pA[8] + " " + pA[9] + pA[10],
        provinceId: add.provinceId,
        districtId: add.districtId,
        neighborhoodId: add.neighborhoodId,
        addressDetail: add.addressDetail,
        addressTitle: add.addressTitle,
        companyName: add.companyName,
        tin: add.tin,
        taxOffice: add.taxOffice,
        isEInvoicePayer: add.isEInvoicePayer
      });

      $('#userAddressModal').modal('show');

    }, 50);

  }

  async loadCities() {
    const obj: any = await this.userAddressService.getAllCities();
    this.cities = obj.cities;
  }

  async loadDistricts(cityId: string) {
    const obj: any = await this.userAddressService.getAllDistrictsByCityId(cityId);
    this.districts = obj.districts;
  }

  async loadNeighborhoods(districtId: string) {
    const obj: any = await this.userAddressService.getAllNeighborhoodsByDistrictId(districtId);
    this.neighborhoods = obj.neighborhoods;
  }

  onCitySelectedChange(event) {

    const cityId = event.target.value;

    this.loadDistricts(cityId);

    $("#selectDistrict").removeClass("select-disabled");
  }

  onDistrictSelectedChange(event) {

    const districtId = event.target.value;

    this.loadNeighborhoods(districtId);

    $("#selectNeighborhood").removeClass("select-disabled");
  }

  hideCorporateSection() {

    this.isCorporate = false;

    var btnToggle = $("#btnToggle");
    var btnInd = $("#btnIndividual");
    var btnCor = $("#btnCorporate");

    btnCor.removeClass("switch-selected");
    btnInd.addClass("switch-selected");
    btnToggle.css("left", "0px");

    $("#inputTin").removeAttr("required");
    $("#inputTaxOffice").removeAttr("required");
    $("#inputCompanyName").removeAttr("required");

    $("#corporate-section").removeClass("show");

  }

  showCorporateSection() {

    this.isCorporate = true;

    var btnToggle = $("#btnToggle");
    var btnInd = $("#btnIndividual");
    var btnCor = $("#btnCorporate");

    btnInd.removeClass("switch-selected");
    btnCor.addClass("switch-selected");
    btnToggle.css("left", "112px");

    $("#inputTin").attr("required", "required");
    $("#inputTaxOffice").attr("required", "required");
    $("#inputCompanyName").attr("required", "required");


    $("#corporate-section").addClass("show");

  }

  loadJsFiles() {
    const scriptElement = this.scriptService.loadJsScript(this.renderer, scriptPath);
    scriptElement.onload = () => {
      console.log('Validation Script load');

    }
    scriptElement.onerror = () => {
      console.log('Could not load the Validation Script!');
    }
  }

}

