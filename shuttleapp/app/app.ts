/// <reference path="../typings/tsd.d.ts" />
import {App, Platform, Storage, SqlStorage} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {TranslateService} from './services/TranslateService';
import {DataService} from './services/DataService';


@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [TranslateService, DataService]
  
})
export class MyApp {
  appVersion : string = '1.0';
  rootPage: any = TabsPage;
  translateService : TranslateService;
  dataService : DataService;
  onDevice : any;
  navigator: Navigator;
  
  constructor(platform: Platform, translateService : TranslateService, dataService : DataService) {
	this.translateService = translateService;
	this.dataService = dataService;
    platform.ready().then(() => {
		let online = this.isOnline();
		this.dataService.online = online;
		this.initApp();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
  
  isOnline(){
	  if(this.onDevice && navigator.connection){
			var networkState = navigator.connection.type;
			return networkState !== Connection.NONE;
		} else {
			return navigator.onLine;      
		}
  }
  
  initApp(){
	 this.dataService.storage = new Storage(SqlStorage); 
	 this.dataService.initialStart = true;
	 
	 //Setup Userstorage
	 this.dataService.storage.query('CREATE TABLE IF NOT EXISTS usersettings (name TEXT PRIMARY KEY, value TEXT)').then((data) => {
		console.log("USERSETTINGS TABLE CREATED -> " + JSON.stringify(data.res));
	 }, (error) => {
		console.log("ERROR CREATE TABLE USERSETTINGS -> " + JSON.stringify(error.err));
	 });
	 
	 //INIT Usersettings
	 this.dataService.storage.query("SELECT * FROM usersettings").then((data) => {
		 for(var i = 0; i < data.res.rows.length; i++){
			if(data.res.rows.item(i).name == "location"){
				this.dataService.locationID = data.res.rows.item(i).value;
			}
			
			if(data.res.rows.item(i).name == "initial"){
				this.dataService.initialStart = false;
			}
			
		 }
		 this.dataService.mainInstance.init();
	 }, (error) => {
		 console.log("ERROR INITIATING USERSETTINGS ->" + JSON.stringify(error.err));
	 });	 
	 
	 //Handle Version Control inAPP
	 this.dataService.storage.query('CREATE TABLE IF NOT EXISTS versions (name TEXT PRIMARY KEY, version TEXT)').then((data) => {
		console.log("VERSIONS TABLE CREATED -> " + JSON.stringify(data.res));
	 }, (error) => {
		console.log("ERROR -> " + JSON.stringify(error.err));
	 });
	 
	 //Create Locations Table
	 this.dataService.storage.query('CREATE TABLE IF NOT EXISTS locations (id TEXT PRIMARY KEY, name TEXT, longitude REAL, latitude REAL)').then((data2) => {
		console.log("LOCATIONS TABLE CREATED -> " + JSON.stringify(data2.res));
	}, (error) => {
		console.log("ERROR LOCATIONS TABLE -> " + JSON.stringify(error.err));
	});
	 
	 /*
	 //Fill initial Versions
	 this.dataService.storage.query("SELECT version FROM versions WHERE name='appversion'").then((data) => {
		 if(data.res.rows.length > 0) {
			if(data.res.rows.item(0).version != this.appVersion){
				this.dataService.storage.query("UPDATE versions SET VERSION = '"+this.appVersion+"' WHERE NAME = 'appversion'").then((data) => {
					console.log("UPDATE -> " + JSON.stringify(data.res));
				}, (error) => {
					console.log("ERROR UPDATE ->" + JSON.stringify(error));
				});
			}
			this.dataService.appVersion = this.appVersion;
		 }else{
			this.dataService.storage.query("INSERT INTO versions (name, version) VALUES ('appversion', '"+this.appVersion+"')").then((data2) => {
				console.log("Input -> " + JSON.stringify(data2.res));
			}, (error) => {
				console.log("ERROR INPUT ->" + JSON.stringify(error.err));
			}); 
		 }
	 }, (error) => {
		 console.log("ERROR INPUT ->" + JSON.stringify(error.err));
	 });
	 this.dataService.storage.query("SELECT version FROM versions WHERE name='contentversion_in'").then((data) => {
		 if(data.res.rows.length > 0) {
			this.dataService.contentVersion["in"] = data.res.rows.item(0).version;
		 }else{
			this.dataService.storage.query("INSERT INTO versions (name, version) VALUES ('contentversion_in', '"+this.initialContentVersion_in+"')").then((data2) => {
				console.log("Input -> " + JSON.stringify(data2.res));
			}, (error) => {
				console.log("ERROR INPUT ->" + JSON.stringify(error.err));
			}); 
		 }
	 }, (error) => {
		 console.log("ERROR INPUT ->" + JSON.stringify(error.err));
	 });
	 
	this.dataService.storage.query("SELECT version FROM versions WHERE name='contentversion_ne'").then((data) => {
		 if(data.res.rows.length > 0) {
			this.dataService.contentVersion["ne"] = data.res.rows.item(0).version;
		 }else{
			this.dataService.storage.query("INSERT INTO versions (name, version) VALUES ('contentversion_ne', '"+this.initialContentVersion_ne+"')").then((data2) => {
				console.log("Input -> " + JSON.stringify(data2.res));
			}, (error) => {
				console.log("ERROR INPUT ->" + JSON.stringify(error.err));
			}); 
		 }
	 }, (error) => {
		 console.log("ERROR INPUT ->" + JSON.stringify(error.err));
	 });
	
	//Locations Setup
	this.dataService.storage.query("SELECT * FROM sqlite_master WHERE name='locations' AND type='table'").then((data) => {
		if(data.res.rows.length <= 0){
			this.dataService.storage.query('CREATE TABLE IF NOT EXISTS locations (id TEXT PRIMARY KEY, name TEXT, longitude REAL, latitude REAL)').then((data2) => {
				console.log("LOCATIONS TABLE CREATED -> " + JSON.stringify(data2.res));
				this.dataService.storage.query("INSERT INTO locations (id, name, longitude, latitude) VALUES ('in', 'Ingolstadt', 123.123, 123.123)");
				this.dataService.storage.query("INSERT INTO locations (id, name, longitude, latitude) VALUES ('ne', 'Neckarsulm', 2.22, 12.12,)");
				this.dataService.readLocations();
			}, (error) => {
				console.log("ERROR LOCATIONS TABLE -> " + JSON.stringify(error.err));
			});
		}else{
			this.dataService.readLocations();
		}
	}, (error) => {
		console.log("ERROR CHECKING EXISTENCE LOCATIONS TABLE -> " + JSON.stringify(error.err));
	});
	
	//Stops Setup
	this.dataService.storage.query("SELECT * FROM sqlite_master WHERE name='stops' AND type='table'").then((data) => {
		if(data.res.rows.length <= 0){
			this.dataService.storage.query('CREATE TABLE IF NOT EXISTS stops (id INTEGER PRIMARY KEY,location TEXT, longitude REAL, latitude REAL, name TEXT)').then((data) => {
				console.log("STOPS TABLE CREATED -> " + JSON.stringify(data.res));
				this.dataService.storage.query("INSERT INTO stops (id, location, longitude, latitude, name) VALUES (1,'in', 123.123, 123.123, 'Halle N')");
				this.dataService.storage.query("INSERT INTO stops (id, location, longitude, latitude, name) VALUES (2,'in', 2.22,12.12, 'Halle L')");
			}, (error) => {
				console.log("ERROR STOPS TABLE -> " + JSON.stringify(error.err));
			});
		}
	}, (error) => {
		console.log("ERROR CHECKING EXISTENCE STOPS TABLE -> " + JSON.stringify(error.err));
	});
	*/
	
  }
}
