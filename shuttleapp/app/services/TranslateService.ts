import {Injectable} from 'angular2/core';  
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';


@Injectable()
export class TranslateService{  
    http : Http;
    texts : any;
    userLang: string;
    
    constructor( http: Http) {
        this.http = http;
		this.detectUserLang();
        this.loadTexts();
    }
	
	detectUserLang(){
		this.userLang = navigator.language.split('-')[0]; // use navigator lang if available
        this.userLang = /(de|en)/gi.test(this.userLang) ? this.userLang : 'de';
	}

    loadTexts() {
        this.http.get('assets/i18n/'+ this.userLang +'.json').map(res => res.json()).subscribe(data => {
            this.texts = data;
        });
    }
    
    getTexts(){
        return this.texts;
    }
    
    getUserLang(){
        return this.userLang;
    }
    
}