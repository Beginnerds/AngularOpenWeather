import { Component } from '@angular/core';
import { DataFetchingService } from '../../src/util/data-fetching-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NgOpenWeather';

  errorMessage:string = "";
  panelItems : PanelItem[] = [];
  refreshInterval;
  LOCAL_STORAGE_KEY :string = "citydata";

  constructor(private dataService:DataFetchingService){}

  ngOnInit(){
    if(localStorage.getItem(this.LOCAL_STORAGE_KEY) !== null){
      this.panelItems = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY));
    }
    else{
      for(let i=0;i<9;i++){
        this.panelItems.push(new PanelItem());
      }
    }
    this.refreshInterval = setInterval(()=>{      // REFRESHES EVERY 20 SECONDS
      this.restartInterval();
    },20*1000);
  }
  
  ngOnDestroy(){
    clearInterval(this.refreshInterval);
  }

  submitData(index:number){
    let currentItem = this.panelItems[index];
    this.errorMessage = "";
    currentItem.hasError = false;

    console.log(currentItem);
    this.dataService.getCityData(currentItem.cityName)
    .subscribe(
      res =>{
        if(res === "NOT FOUND"){
          currentItem.hasError = true;
          this.errorMessage = "Invalid city name, try again"
        }
        else{
          this.panelItems = this.panelItems.map((item,i)=>{
            if(i === index){
              item.cityName = res["name"];
              item.temp = res["main"]["temp"];
              item.humidity = res["main"]["humidity"];
              item.weather = res["weather"][0]["main"];
            }
            return item;
          })
          currentItem.editing = false;
          currentItem.isModified = true;

          // Save data in local storage
          localStorage.setItem(this.LOCAL_STORAGE_KEY,JSON.stringify(this.panelItems));
        }
      },
      err =>{
        currentItem.hasError = true;
        this.errorMessage = "Something went wrong."
        console.log(err);
      }
    );
  }

  // refreshes weather information
  restartInterval(){
    this.panelItems.forEach((item,index)=>{
      if(item.isModified && !item.hasError){
        this.submitData(index);
      }
    })
    console.log("updated items");
  }

  setImage(index:number){
    let weathers: string[] = ["Clear","Clouds","Haze","Rain","Snow","Thunderstorm"];
    let currentItem = this.panelItems[index];
    
    let imgIndex = weathers.indexOf(currentItem.weather);
    if(imgIndex === -1){
      return "assets/images/Clear.jpg";
    }
    else{
      return `./assets/images/${weathers[imgIndex]}.jpg`;
    }
  }

}


class PanelItem{
  cityName : string = '';
  weather : string = '';
  temp : string = '';
  humidity : string = '';
  isModified : boolean = false;
  editing : boolean = false;
  hasError : boolean = false;
}
