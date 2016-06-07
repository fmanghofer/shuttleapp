/// <reference path="../../../typings/tsd.d.ts" />
import {Page, Platform} from 'ionic-angular';


@Page({
  templateUrl: 'build/pages/map/map.html',
})

export class Map {
	map: any;
	headline: string = "Map";
	platform : Platform;
	
	
  constructor(platform : Platform) {
	this.platform = platform;
	this.platform.ready().then(() => {
	mapboxgl.accessToken = 'pk.eyJ1IjoiZm1hbmdob2ZlciIsImEiOiJjaWxzODM2ejUwMDh5eG5tMDJ5bTFnbmlkIn0.kQN4yzOKJSV47OmsUmrsXg';
	this.map = new mapboxgl.Map({
      container: 'map_canvas',
      style: 'mapbox://styles/mapbox/streets-v8'
	});
	});
  }
}

