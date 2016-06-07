import {NavController, Page} from 'ionic-angular';
import {TranslateService} from '../../services/TranslateService';
import {DataService} from '../../services/DataService';


@Page({
  templateUrl: 'build/pages/settings/settings.html',
})
export class Settings {
	texts: any;
	headline: string;
	items;
	dataService : DataService;
	
  constructor(translateService:TranslateService,dataService: DataService) {
	this.texts = translateService.getTexts();
	this.headline = this.texts.settings.title;
	this.dataService = dataService;
	
	this.items = [{
		"name" : this.dataService.getLocation().name,
		"icon" : "pin",
		"page" : "location"
	},
	{	"name" : this.texts.languages[translateService.userLang],
		"icon" : "person",
		"page" : "language" 
	}];
  }
  
  openSettingsPage(item: any){
	  
  }
}

