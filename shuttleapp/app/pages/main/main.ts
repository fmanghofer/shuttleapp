import {App, Platform, Page, NavController, NavParams, Alert, Loading, Modal, ViewController} from 'ionic-angular';
import { Component } from 'angular2/core';  
import { FORM_DIRECTIVES, FormBuilder,  ControlGroup, Validators, AbstractControl } from 'angular2/common';
import {Stops} from '../stops/stops';
import {Map} from '../map/map';
import {TranslateService} from '../../services/TranslateService';
import {DataService} from '../../services/DataService';

 


@Page({
  templateUrl: 'build/pages/main/main.html',
  directives: [FORM_DIRECTIVES]
})
export class Main {
    searchForm: ControlGroup;
    start: AbstractControl;
    target: AbstractControl;
    startVal: any = {name : "", selected : false};
    targetVal: any = {name : "", selected : false};
    nav: NavController;
    texts: any;
	dataService : DataService;
	contentUpdate: boolean = false;
	loading: Loading;
	startIcon : string = "disc";
	targetIcon : string = "flag";
 
    constructor(platform: Platform, fb: FormBuilder, nav: NavController, translateService:TranslateService, dataService: DataService) {
        this.searchForm = fb.group({  
            'start': ['', Validators.compose([Validators.required])],
            'target': ['', Validators.compose([Validators.required])]
        });
        this.start = this.searchForm.controls['start'];     
        this.target = this.searchForm.controls['target'];  
        this.nav = nav;
        
        this.texts = translateService.getTexts();
		this.dataService = dataService;
		this.dataService.mainInstance = this;
    }
	
	//Depends on initial start
	init(){
		if(this.dataService.initialStart == true){
			this.setup(); //very first start
		}else{
			this.initPage();
		}
	}
	
	setup(){
		
	}
	
	initPage(){
		console.log("check");
		if(this.dataService.locationID == ""){
			let modal = Modal.create(LocationModal);
			modal.onDismiss(data => {
				 this.checkVersions();
			   });
			this.nav.present(modal);
		}else{
			this.checkVersions();
		}
	}
	
	checkVersions(){
			this.dataService.checkVersions().subscribe(
				data => {
					if(data.status == true){
						if(data.versions.appversion != this.dataService.appVersion){
							this.showAppUpdate();
						}
						if(data.versions.contentversion != this.dataService.contentVersion){
							this.contentUpdate = true;
						}
					}else{
						console.log("Version load status false");
					}
				},
				err => {
					console.log(err);
				},
				() => console.log('Version load complete'));
	}
	
	showAppUpdate(){	
		let alert = Alert.create({
			title: this.texts.main.appUpdate.title,
			message: this.texts.main.appUpdate.text,
			buttons: [this.texts.main.appUpdate.btn]
		});
		this.nav.present(alert);
	}
 
    onSubmit(value: string): void { 
        if(this.searchForm.valid) {
            console.log('Submitted value: ', value);
            console.log('sometest', this.startVal);
        }
    }

	onUpdateContent(): void{
	  this.loading = Loading.create({
		spinner: 'bubbles',
		content: this.texts.main.contentUpdate.loading
	  });
	  this.nav.present(this.loading);
	  this.dataService.loadContent().subscribe(
				data => {
					if(data.status == true){
						//this.dataService.updateStops(data.stops);
						//this.dataService.updateContentVersion(data.version);
						this.contentUpdate = false;
					}else{
						console.log("Update loaded status false");
					}
					this.loading.dismiss();
				},
				err => {
					this.loading.dismiss();
					console.log(err);
				},
				() => console.log('Update Payload complete'));
				
	    //setTimeout(() => {
			//loading.dismiss();
			//var texts = document.getElementsByClassName("loading-content");
			//texts[0].innerHTML = "ABC";
		  //}, 3000);
	}
	
	onMapClick() : void{
		this.nav.push(Map);
	}
	
    onChooseStart() : void{
        this.nav.push(Stops, {
            modus: 'start',
            mainpage: this
        });
    }
    
    onChooseTarget() : void{
        this.nav.push(Stops, {
            modus: 'target',
            mainpage: this 
        });
    }
    
}

@Page({
  templateUrl: 'build/pages/main/modal.html'
})
class LocationModal {
  items;
  viewCtrl : ViewController;
  params : NavParams;
  dataService : DataService;
  headline : string;

  constructor(params: NavParams, viewCtrl: ViewController, dataService : DataService,translateService:TranslateService) {
	this.viewCtrl = viewCtrl;
	this.params = params;
	this.dataService = dataService;
	this.items = dataService.locations;
	this.headline = translateService.getTexts().locationmodal.title;
  }
  
  onClick(val : any){
	  this.dataService.setLocationID(val.id);
	  this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
