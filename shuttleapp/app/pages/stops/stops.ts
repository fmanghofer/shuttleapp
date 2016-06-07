import {Page, NavController, NavParams} from 'ionic-angular';
import {Main} from '../main/main';
import {TranslateService} from '../../services/TranslateService';
import {DataService} from '../../services/DataService';


@Page({
  templateUrl: 'build/pages/stops/stops.html',
})
export class Stops {
  searchQuery: string = '';
  items;
  nav: NavController;
  navParams: NavParams;
  mainPage: Main;
  modus: string;
  headline: string;
  texts: any;
  dataService : DataService;
  
  constructor(nav: NavController, navParams: NavParams, translateService:TranslateService, dataService : DataService) {
    this.nav = nav;
    this.navParams = navParams;
    this.mainPage = this.navParams.get('mainpage');
    this.modus = this.navParams.get('modus');
	this.texts = translateService.getTexts();
	this.dataService = dataService;
    this.initializeItems();
	this.refreshHeadline();
  }
  
  refreshHeadline() {
	  if(this.modus == 'start'){
		  this.headline = this.texts.stops.title.start;
	  }else{
		  this.headline = this.texts.stops.title.target;
	  }
  }
  
  initializeItems() {
    this.items = this.dataService.stops;
  }
  
  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    var q = searchbar.value;

    // if the value is an empty string don't filter the items
    if (q.trim() == '') {
      return;
    }

    this.items = this.items.filter((v) => {
      if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })
  }
  
  onClick(val : any) : void{
    if(this.modus == 'start'){
		if(this.mainPage.targetVal == val){
			this.clearItem("targetVal");
		}
		this.mainPage.startVal.selected = false; 
		this.mainPage.startVal = val;
		this.mainPage.startVal.selected = true;
		this.mainPage.startVal.icon = this.mainPage.startIcon;
		this.modus = 'target';
		this.refreshHeadline();
    }else{
		if(this.mainPage.startVal != val){
			this.mainPage.targetVal.selected = false; 
			this.mainPage.targetVal = val;
			this.mainPage.targetVal.selected = true;
			this.mainPage.targetVal.icon = this.mainPage.targetIcon;
			this.nav.pop();
		}
    }
    console.log("mm" + val);
  }
  
  clearItem(source){
	  this.mainPage[source].selected = false;
	  this.mainPage[source] = {name : "", selected: false};
  }
  
}
