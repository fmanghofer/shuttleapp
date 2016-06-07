import {Injectable} from 'angular2/core';  
import {App, Platform, Storage, SqlStorage} from 'ionic-angular';
import {Http, Headers} from 'angular2/http';
import { TranslateService } from './TranslateService';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService{  
    http : Http;
	contentVersion: any = {};
	mainInstance : any;
	appVersion: string;
	locationID: string = "";
	online : boolean;
	translateService: TranslateService;
	storage: Storage;
	stops: any = [];
	locations: any = [];
	tempStops : any = [];
	
	initialStart : boolean;
	
	
    
    constructor( http: Http, translateService : TranslateService) {
        this.http = http;   
		this.translateService = translateService;
    }
	
	checkVersions(){
		return this.http.get('/backend'+'?action=versions').map(res => res.json());
	}
	
	loadContent(){
		return this.http.get('/backend'+'?action=contentupdate&lang='+this.translateService.userLang+'&location='+this.locationID).map(res => res.json());
	}
	
	loadLocations(){
		return this.http.get('/backend'+'?action=locations&lang='+this.translateService.userLang).map(res => res.json());
	}
	
	loadSetup(){
		return this.http.get('/backend'+'?action=setup').map(res => res.json());
	}
	
	readLocations(){
		this.storage.query("SELECT * FROM locations").then((data) => {
			for(var i = 0; i < data.res.rows.length; i++){
				this.locations.push({id: data.res.rows.item(i).id, name: data.res.rows.item(i).name, longitude: data.res.rows.item(i).longitude, latitude: data.res.rows.item(i).latitude});
			}
		 }, (error) => {
			 console.log("ERROR READING LOCATIONS ->" + JSON.stringify(error.err));
		 });	
	}
	
	setLocationID(id : string){
		this.locationID = id;
		this.storage.query("insert or replace into usersettings (name, value) values('location','"+id+"')");
	}
	
	getLocation(){
		for(var i = 0;i<this.locations.length;i++){
			if(this.locations[i].id == this.locationID){
				return this.locations[i];
			}
		}
	}
	
	
	
	setUpStopsTable(initial){
		this.storage.query('CREATE TABLE IF NOT EXISTS stops (id INTEGER PRIMARY KEY, longitude REAL, latitude REAL, name TEXT)').then((data) => {
			console.log("STOPS TABLE CREATED -> " + JSON.stringify(data.res));
			if(initial){
				this.setUpStopsEntries(true);
			}else{
				this.doUpdate();
			}
		 }, (error) => {
			console.log("ERROR STOPS TABLE -> " + JSON.stringify(error.err));
		 });
	}
	
	setUpStopsEntries(initialValues){
		this.storage.query("SELECT * FROM stops").then((data) => {
			if(data.res.rows.length  > 0) {
				console.log("Entries available");
				this.stops = [];
				for(var i = 0; i < data.res.rows.length; i++){
					this.stops.push({id: data.res.rows.item(i).id, longitude: data.res.rows.item(i).longitude, latitude: data.res.rows.item(i).latitude, name: data.res.rows.item(i).name, selected : false, icon : 'disc'});
				}
			}else{
				if(initialValues == true){
					this.storage.query("INSERT INTO stops (id, longitude, latitude, name) VALUES (1, 123.123, 123.123, 'Halle N')");
					this.storage.query("INSERT INTO stops (id, longitude, latitude, name) VALUES (2,2.22,12.12, 'Halle L')");
					this.setUpStopsEntries(false);
				}				
			}
		 }, (error) => {
			 console.log("ERROR STOPS SELECT ->" + JSON.stringify(error.err));
		 });	
	}
	
	updateContentVersion(version : string, loc : string){
		let cname = 'contentversion_'+loc;
		this.storage.query("UPDATE versions SET version = '"+version+"' WHERE name='"+cname+"'").then((data) => {
			console.log("Version updated locally");
		}, (error) => {
			console.log("ERROR INPUT ->" + JSON.stringify(error.err));
		});
	}
	
	updateStops(stops){
		if(stops.length > 0){
			this.storage.query("DELETE FROM stops").then((data) => {
				console.log("Deleted");
			}, (error) => {
				console.log("ERROR UPDATE DELETE TABLE STOPS ->" + JSON.stringify(error.err));
			});
			this.storage.query("DROP TABLE stops").then((data) => {
				console.log("Dropped");
				this.tempStops = stops;
				this.setUpStopsTable(false);
			}, (error) => {
				console.log("ERROR UPDATE DELETE TABLE STOPS ->" + JSON.stringify(error.err));
			});
			
			//this.setUpStopsEntries(false);
		}
	}
	
	doUpdate(){
		for(var i =0;i<this.tempStops.length;i++){
			var sql = "INSERT INTO stops (id, longitude, latitude, name) VALUES ("+this.tempStops[i].id+", "+this.tempStops[i].long+", "+this.tempStops[i].lat+", '"+this.tempStops[i].text+"')";
			console.log(sql);
			this.storage.query(sql)
			console.log("Insert");
		}
		this.setUpStopsEntries(false);
	}
}