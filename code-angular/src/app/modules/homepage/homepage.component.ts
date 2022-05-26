import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UploadFileService } from '../dashboard/shared/upload/upload-file.service';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  

  countries: any = [{country : "AFGHANISTAN", code: '+93'},{ country: "ALASKA (USA)",code: '+1 - 907'},{ country :  "ALBANIA",code : '+355'},{ country :  "ALGERIA",code : '+213'},{ country : 
"AMERICAN SAMOA",code : '+1 - 684'},{ country :  "ANDORRA",code : '+376'},{ country :  "ANGOLA",code : '+244'},{ country :  "ANGUILLA",code : '+1 - 264'},{ country : 
"ANTIGUA & BARBUDA",code : '+1 - 268'},{ country :  "ARGENTINA",code : '+54'},{ country :  "ARMENIA",code : '+374'},{ country :  "ARUBA",code : '+297'},{ country :  "ASCENSION",code : '+247'},{ country : 
"AUSTRALIA",code : '+61'},{ country :  "AUSTRIA",code : '+43'},{ country :  "AZERBAIJAN",code : '+994'},{ country :  "BAHAMAS",code : '+1 - 242'},{ country :  "BAHRAIN",code : '+973'},{ country : 
"BANGLADESH",code : '+880'},{ country :  "BARBADOS",code : '+1 - 246'},{ country :  "BELARUS",code : '+75'},{ country :  "BELGIUM",code : '+32'},{ country :  "BELIZE",code : '+501'},{ country :  "BENIN",code : '+229'},{ country : 
"BERMUDA",code : '+1 - 441'},{ country :  "BHUTAN",code : '+975'},{ country :  "BOLIVIA",code : '+591'},{ country :  "BOSNIA / HERZEGOVINA",code : '+387'},{ country :  "BOTSWANA",code : '+267'},{ country : 
"BRAZIL",code : '+55'},{ country :  "BRITISH VIRGIN ISLANDS",code : '+1 - 284'},{ country :  "BRUNEI",code : '+673'},{ country :  "BULGARIA",code : '+359'},{ country : 
"BURKINA FASO",code : '+226'},{ country :  "BURUNDI",code : '+257'},{ country :  "CAMBODIA",code : '+855'},{ country :  "CAMEROON",code : '+237'},{ country :  "CANADA",code : '+1'},{ country : 
"CAPE VERDE",code : '+238'},{ country :  "CAYMAN ISLANDS",code : '+1 - 345'},{ country :  "CENTRAL AFRICAN REPUBLIC",code : '+236'},{ country :  "CHAD",code : '+235'},{ country : 
"CHILE",code : '+56'},{ country :  "CHINA",code : '+86'},{ country :  "COLOMBIA",code : '+57'},{ country :  "COMOROS",code : '+269'},{ country :  "CONGO",code : '+242'},{ country : 
"CONGO DEM. REP.(ZAIRE)",code : '+243'},{ country :  "COOK ISLAND",code : '+682'},{ country :  "COSTA RICA",code : '+506'},{ country :  "CROATIA",code : '+385'},{ country :  "CUBA",code : '+53'},{ country : 
"CYPRUS",code : '+357'},{ country :  "CZECH REPUBLIC",code : '+420'},{ country :  "DENMARK",code : '+45'},{ country :  "DIEGO GARCIA",code : '+246'},{ country :  "DJIBOUTI",code : '+253'},{ country : 
"DOMINICA",code : '+1 - 767'},{ country :  "DOMINICAN REPUBLIC",code : '+1 - 809'},{ country :  "EAST TIMOR",code : '+670'},{ country :  "ECUADOR",code : '+593'},{ country :  "EGYPT",code : '+20'},{ country : 
"EL SALVADOR",code : '+503'},{ country :  "EQUATORIAL GUINEA",code : '+240'},{ country :  "ERITREA",code : '+291'},{ country :  "ESTONIA",code : '+372'},{ country :  "ETHIOPIA",code : '+251'},{ country : 
"FALKLAND ISLANDS",code : '+500'},{ country :  "FAROE ISLANDS",code : '+298'},{ country :  "FIJI",code : '+679'},{ country :  "FINLAND",code : '+358'},{ country :  "FRANCE",code : '+33'},{ country : 
"FRENCH GUIANA",code : '+594'},{ country :  "FRENCH POLYNESIA",code : '+689'},{ country :  "GABON",code : '+241'},{ country :  "GAMBIA",code : '+220'},{ country :  "GEORGIA",code : '+995'},{ country : 
"GERMANY",code : '+49'},{ country :  "GHANA",code : '+233'},{ country :  "GIBRALTAR",code : '+350'},{ country :  "GREECE",code : '+30'},{ country :  "GREENLAND",code : '+299'},{ country :  "GRENADA",code : '+1 - 473'},{ country : 
"GUADALOUPE",code : '+590'},{ country :  "GUAM",code : '+1 - 671'},{ country :  "GUATEMALA",code : '+502'},{ country :  "GUINEA",code : '+224'},{ country :  "GUINEA BISSAU",code : '+245'},{ country : 
"GUYANA",code : '+592'},{ country :  "HAITI",code : '+509'},{ country :  "HAWAII (USA)",code : '+1 - 808'},{ country :  "HONDURAS",code : '+504'},{ country :  "HONG KONG",code : '+852'},{ country : 
"HUNGARY",code : '+36'},{ country :  "ICELAND",code : '+354'},{ country :  "INDIA",code : '+91'},{ country :  "INDONESIA",code : '+62'},{ country :  "IRAN",code : '+98'},{ country :  "IRAQ",code : '+964'},{ country : 
"IRELAND",code : '+353'},{ country :  "ISRAEL",code : '+972'},{ country :  "ITALY",code : '+39'},{ country :  "IVORY COAST",code : '+225'},{ country :  "JAMAICA",code : '+1 - 876'},{ country :  "JAPAN",code : '+81'},{ country : 
"JORDAN",code : '+962'},{ country :  "KAZAKHSTAN",code : '+7'},{ country :  "KENYA",code : '+254'},{ country :  "KIRIBATI",code : '+686'},{ country :  "KOREA (NORTH)",code : '+850'},{ country : 
"KOREA (SOUTH)",code : '+82'},{ country :  "KUWAIT",code : '+965'},{ country :  "KYRGHYZSTA",code : '+996'},{ country :  "LAOS",code : '+856'},{ country :  "LATVIA",code : '+371'},{ country :  "LEBANON",code : '+961'},{ country : 
"LESOTHO",code : '+266'},{ country :  "LIBERIA",code : '+231'},{ country :  "LIBYA",code : '+218'},{ country :  "LIECHTENSTEIN",code : '+423'},{ country :  "LITHUANIA",code : '+370'},{ country : 
"LUXEMBOURG",code : '+352'},{ country :  "MACAU",code : '+853'},{ country :  "MACEDONIA",code : '+389'},{ country :  "MADAGASCAR",code : '+261'},{ country :  "MALAWI",code : '+265'},{ country : 
"MALAYSIA",code : '+60'},{ country :  "MALDIVES",code : '+960'},{ country :  "MALI",code : '+223'},{ country :  "MALTA",code : '+356'},{ country :  "MARIANA IS.(SAIPAN)",code : '+1 - 670'},{ country : 
"MARSHALL ISLANDS",code : '+692'},{ country :  "MARTINIQUE(FRENCHANTILLES)",code : '+596'},{ country :  "MAURITANIA",code : '+222'},{ country :  "MAURITIUS",code : '+230'},{ country : 
"MAYOTTE",code : '+269'},{ country :  "MEXICO",code : '+52'},{ country :  "MICRONESIA",code : '+691'},{ country :  "MOLDOVA",code : '+373'},{ country :  "MONACO",code : '+377'},{ country :  "MONGOLIA",code : '+976'},{ country : 
"MONTSERRAT",code : '+1 - 664'},{ country :  "MOROCCO",code : '+212'},{ country :  "MOZAMBIQUE",code : '+258'},{ country :  "MYANMAR",code : '+95'},{ country :  "NAMIBIA",code : '+264'},{ country : 
"NAURU",code : '+674'},{ country :  "NEPAL",code : '+977'},{ country :  "NETHERLANDS",code : '+31'},{ country :  "NETHERLANDS ANTILLES",code : '+599'},{ country :  "NEW CALEDONIA",code : '+687'},{ country : 
"NEW ZEALAND",code : '+64'},{ country :  "NICARAGUA",code : '+505'},{ country :  "NIGER",code : '+227'},{ country :  "NIGERIA",code : '+234'},{ country :  "NIUE ISLAND",code : '+683'},{ country : 
"NORWAY",code : '+47'},{ country :  "OMAN",code : '+968'},{ country :  "PAKISTAN",code : '+92'},{ country :  "PALAU",code : '+680'},{ country :  "PALESTINE",code : '+970'},{ country :  "PANAMA",code : '+507'},{ country : 
"PAPUA NEW GUINEA",code : '+675'},{ country :  "PARAGUAY",code : '+595'},{ country :  "PERU",code : '+51'},{ country :  "PHILIPPINES",code : '+63'},{ country :  "POLAND",code : '+48'},{ country : 
"PORTUGAL",code : '+351'},{ country :  "PUERTO RICO (I) (USA)",code : '+1 - 787'},{ country :  "PUERTO RICO (II)(USA)",code : '+1 - 939'},{ country :  "QATAR",code : '+974'},{ country : 
"REUNION",code : '+262'},{ country :  "ROMANIA",code : '+40'},{ country :  "RUSSIA",code : '+7'},{ country :  "RWANDA",code : '+250'},{ country :  "SAMOA WESTERN",code : '+685'},{ country : 
"SAN MARINO",code : '+378'},{ country :  "SAO TOME &PRINCIPE",code : '+239'},{ country :  "SAUDI ARABIA",code : '+966'},{ country :  "SENEGAL",code : '+221'},{ country : 
"SEYCHELLES",code : '+248'},{ country :  "SIERRA LEONE",code : '+232'},{ country :  "SINGAPORE",code : '+65'},{ country :  "SLOVAKIA",code : '+421'},{ country :  "SLOVENIA",code : '+386'},{ country : 
"SOLOMON ISLANDS",code : '+677'},{ country :  "SOMALIA",code : '+252'},{ country :  "SOUTH AFRICA",code : '+27'},{ country :  "SPAIN",code : '+34'},{ country :  "SRI LANKA",code : '+94'},{ country : 
"ST HELENA",code : '+290'},{ country :  "ST KITTS & NEVIS",code : '+1 - 869'},{ country :  "ST LUCIA",code : '+1 - 758'},{ country : 
"ST VINCENT &GRENADINES",code : '+1 - 784'},{ country :  "ST. PIERRE &MIQUELON",code : '+508'},{ country :  "SUDAN",code : '+249'},{ country :  "SURINAM",code : '+597'},{ country : 
"SWAZILAND",code : '+268'},{ country :  "SWEDEN",code : '+46'},{ country :  "SWITZERLAND",code : '+41'},{ country :  "SYRIA",code : '+963'},{ country :  "TAIWAN",code : '+886'},{ country :  "TAJIKISTAN",code : '+992'},{ country : 
"TANZANIA",code : '+255'},{ country :  "THAILAND",code : '+66'},{ country :  "TOGO",code : '+228'},{ country :  "TOKELAU",code : '+690'},{ country :  "TONGA",code : '+676'},{ country : 
"TRINIDAD & TOBAGO",code : '+1 - 868'},{ country :  "TUNISIA",code : '+216'},{ country :  "TURKEY",code : '+90'},{ country :  "TURKMENISTAN",code : '+993'},{ country : 
"TURKS & CAICOSISLANDS",code : '+1 - 649'},{ country :  "TUVALU",code : '+688'},{ country :  "UGANDA",code : '+256'},{ country :  "UKRAINE",code : '+380'},{ country : 
"UNITED ARAB EMIRATES",code : '+971'},{ country :  "UNITED KINGDOM",code : '+44'},{ country :  "URUGUAY",code : '+598'},{ country :  "UZBEKISTAN",code : '+998'},{ country : 
"VANUATU",code : '+678'},{ country :  "VATICAN CITY",code : '+39'},{ country :  "VENEZUELA",code : '+58'},{ country :  "VIETNAM",code : '+84'},{ country :  "VIRGIN ISLAND (USA)",code : '+1 - 340'},{ country : 
"WALLIS & FUTUNA",code : '+681'},{ country :  "YEMEN",code : '+967'},{ country :  "YUGOSLAVIA (SERBIA)",code : '+381'},{ country :  "ZAMBIA",code : '+260'},{ country :  "ZANZIBAR",code : '+255'},{ country : 
"ZIMBABWE",code : '+263'}]

  constructor(
    private _ContactService : ContactService,
    private _UploadFileService : UploadFileService
  ) { }
  playVideo = false;
  contactForm !: FormGroup;
  submitted = false;
  msg = '';
  userName : string | null = '';
  showUserDetails = false;
  ngOnInit(): void {
    this.createForm();
    this.GetToken();
  }
  ngAfterViewInit(): void {
    const selectCountries = document.getElementById('formselect1');
    const selectCode = document.getElementById('formselect2');
    this.countries.forEach((obj : any) => {
      selectCountries!.innerHTML += `<option>${obj.country}</option>`;
      selectCode!.innerHTML += `<option>${obj.code}</option>`;
    });
  }
  GetToken(){
    if(localStorage.getItem('Token')){
      this.showUserDetails = true;
      this.userName = localStorage.getItem('user_Name');
    } else if(sessionStorage.getItem('Token')){
      this.showUserDetails = true;
      this.userName = sessionStorage.getItem('user_Name');
    } else{
      this.showUserDetails = false;
    }
  }
  playvideo(){
    this.playVideo = true;
  }
  @ViewChild('formselect2') formselect2 !: ElementRef ;
  @ViewChild('formselect1') formselect1 !: ElementRef ;
  onCountryChange(event : any){
    this.countries.forEach((obj : any, idx : number) => {
      if(`${obj.country}` === `${event.target.value}`){
        this.contactForm.value.code = `${obj.code}`;
        this.contactForm.value.country = `${obj.country}`;
        this.formselect2.nativeElement.selectedIndex = idx + 1;
      }
    });
  }
  onCodeChange(event : any){
    this.countries.forEach((obj : any, idx : number) => {
      if(`${obj.code}` === `${event.target.value}`){
        this.contactForm.value.code = `${obj.code}`;
        this.contactForm.value.country = `${obj.country}`;
        this.formselect1.nativeElement.selectedIndex = idx + 1;
      }
    });
  }
  get fname() {
    return this.contactForm.get('fname');
  }
  get lname() {
    return this.contactForm.get('lname');
  }
  get email() {
    return this.contactForm.get('email');
  }
  get country() {
    return this.contactForm.get('country');
  }
  get code() {
    return this.contactForm.get('code');
  }
  get phone() {
    return this.contactForm.get('phone');
  }
  get message() {
    return this.contactForm.get('message');
  }
  get subject() {
    return this.contactForm.get('subject');
  }
  createForm(){
    this.contactForm = new FormGroup({
      fname : new FormControl('', Validators.required),
      lname : new FormControl('', Validators.required),
      email : new FormControl('', [Validators.required, Validators.email]),
      subject : new FormControl('',Validators.required),
      country : new FormControl(''),
      code : new FormControl(''),
      phone : new FormControl('',Validators.required),
      message : new FormControl('',Validators.required)
    });
  }
  ThrowMessage(msg : string){
    this.msg = msg;
  }
  onSend(){
    this.submitted = true;
    if(this.contactForm.valid){
      let payload = new FormData;

      payload.append('first_name', this.contactForm.value.fname);
      payload.append('last_name', this.contactForm.value.lname);
      payload.append('email', this.contactForm.value.email);
      payload.append('country', this.contactForm.value.country);
      payload.append('contact', this.contactForm.value.phone);
      payload.append('subject', this.contactForm.value.subject);
      payload.append('message', this.contactForm.value.message);

      this._ContactService.ContactTeam(payload).subscribe(
        (res : any)=> {
          this.ThrowMessage(res.message);
          this.contactForm.value.fname = '';
          this.contactForm.value.email = '';
          this.contactForm.value.country = '';
          this.contactForm.value.phone = '';
          this.contactForm.value.subject = '';
          this.contactForm.value.message = '';
        },
        (err : HttpErrorResponse) => {
          if(err.error.non_field_errors){
            this.ThrowMessage(err.error.non_field_errors[0]);
          }
          else if(err.status === 0){
            this.ThrowMessage("Address Not Reachable.Please Try Again!")
          }
          else if(err.status === 504){
            this.ThrowMessage("Server Not Responding.Please Try Again!")
          }
          else if(err.status === 500){
            this.ThrowMessage("Internal Server Error.Please Try Again!")
          }
          else if(err.status === 400){
            this.ThrowMessage("Bad Request!")
          }
          else{
            this.ThrowMessage("Oops Something Went Wrong. Please Try Again!");
          };
        }
      );
    }
  }
  PreventChars(evt : any){
    if (evt.which < 48 || evt.which > 57)
    {
        evt.preventDefault();
    }
  }
  PreventDefault(ev : any){
    ev.preventDefault();
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
  }
  logout() {
    this._UploadFileService.videoFiles = [];
    this._UploadFileService.UploadedVideoFiles =[];
    this._UploadFileService.videoFeatures = [];
    this._UploadFileService.selectedVideoLabels = [];
    this._UploadFileService.totalPriceVideos = 0;
    this._UploadFileService.uploadVideoBtn = false;
    this._UploadFileService.currentComponentVideo = true;
    // Image data 
    this._UploadFileService.UploadedImageFiles = [];
    this._UploadFileService.imageFiles = [];
    this._UploadFileService.imageFeatures = [];
    this._UploadFileService.selectedImageLabels = [];
    this._UploadFileService.totalPriceImages = 0;
    this._UploadFileService.uploadImageBtn = false;
    this._UploadFileService.currentComponentImage = false;
    sessionStorage.removeItem('Token');
    localStorage.removeItem('Token');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('user_name');
    localStorage.removeItem('Date');
    localStorage.removeItem('imageUrl');
    localStorage.removeItem('imageID');
    localStorage.removeItem('imageName');
    localStorage.removeItem('isSample');
    localStorage.removeItem('OpenVideoTitle');
    localStorage.removeItem('OpenVideoDate');
    localStorage.removeItem('OpenVideoID');
    sessionStorage.removeItem('admin');
    localStorage.removeItem('admin');
    sessionStorage.clear();
    localStorage.clear();
    this.showUserDetails = false;
  }
}
