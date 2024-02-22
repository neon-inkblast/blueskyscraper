import { scrape } from "./scrape";

let progress = 0;

let updateProgress = function(updatedState){
  progress = updatedState;
}

scrape(updateProgress);
