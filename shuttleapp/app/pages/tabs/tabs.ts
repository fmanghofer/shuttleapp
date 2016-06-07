import {Page} from 'ionic-angular';
import {Main} from '../main/main';
import {Settings} from '../settings/settings';


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = Main;
  tab2Root: any = Settings;
}
