/*TODO:
 * Deletion of decrees
 * new game menu
 * style stuff better
 * improve grafics
 * generate graphs
 * */


/* Constants
 * */
const config = {
   "DECREE_BUTTON": "Decreta",
   "DAY_BUTTON": "Giorno",
   "DECREE_LIST_TITLE": "Decreti",
   "DAY_TITLE": "Giorno",
   "INFECTED_TITLE": "Contagi",
   "MAX_INFECTED":  500000, 
   "LAST_DAY": 14,
   "ALERT_DECREE_EXISTS": "Decreto esiste gia'!",
   "GAME_OVER": "Game Over!",
   "LOST_GAME": "Perso",
   "WON_GAME": "Vinto!",
   "SUB_DECS": {
      "SUB_DECS1": [
         "evitate",
         "non recatevi ne",
         "recatevi ne",
         "non rimanete ne",
         "rimanete ne",
         "non chiuderemo",
         "chiuderemo"
      ],
      "SUB_DECS2": [
         "i parchi pubblici",
         "i supermercati",
         "la propria abitazione",
         "il luogo di lavoro",
         "il comune di residenza",
         "i cantieri",
         "le scuole"
      ],
      "SUB_DECS3": [
         "per esigenze lavorative",
         "per comprovate necessita'",
         "in piu' di due persone",
         "per motivi di salute",
         "a un metro di distanza",
         "per produzioni di interesse strategico",
         "per beni di prima necessita'"
      ],
   },
};
//const config = JSON.parse(configIT);

/*
 * Helper functions
 * */
// Get a random int in a given range.
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// Get a random float in a given range.
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

/*
 * Class to represent a single decree made up of sub decrees.
 * */
class Decree  {
   constructor(subDec1, subDec2, subDec3) {
      this.subDec1 = subDec1;
      this.subDec2 = subDec2;
      this.subDec3 = subDec3;
      this.infectionFactor = this.getInfectionFactor();
   }

   // Return decree in a string.
   dec2string() {
      return `${this.subDec1} ${this.subDec2} ${this.subDec3}`;
   }

   // Compare the decree with an array of decrees.
   static inDecArray(dec, decArray) {
      for (let decOfA of decArray) {
         if (
            dec.subDec1 == decOfA.subDec1
            && dec.subDec2 == decOfA.subDec2
            && dec.subDec3 == decOfA.subDec3
         ) {
            return true;
         }

      }
      return false;
   }

   // Calculate the infection factor used to get the number of infected people per day.
   getInfectionFactor() {
      const max_power = 10.0;
      const fix_power = 2.5;
      const exp_power = 1.5;
      const max_good_bad = 10.0;
      const good_bad_thresh = 4.0;
      const rand_good_bad = getRandomInt(1, max_good_bad);
      const rand_power = getRandomInt(1, max_power);
      const factor_good_bad = -1.0 ? (rand_good_bad > good_bad_thresh) : 1.0;
      const factor_power = fix_power / (rand_power**exp_power);
      const factor = factor_good_bad * factor_power;

      console.log('Made Decree with factor: ' + factor);
     return factor
   }

}

/*
 * Initialize the HTML given a language config file\
 * */
function setLanguage() {
   const makeDecButton = document.querySelector('#make-decree');
   const nextDayButton = document.querySelector('#next-day');
   const decreesTitle = document.querySelector('#decrees-list-title');
   const dayTitle = document.querySelector('#day-title');
   const infectedTitle = document.querySelector('#infected-title');

   makeDecButton.textContent = config.DECREE_BUTTON;
   nextDayButton.textContent = config.DAY_BUTTON;
   decreesTitle.textContent = config.DECREE_LIST_TITLE;
   dayTitle.textContent = config.DAY_TITLE;
   infectedTitle.textContent = config.INFECTED_TITLE;
}

/*
 * Initializes all the sub decree options for the three inputs
 * */
function setSubDecOptions (id, subDecs) {
   const subDecDatalist = document.querySelector(id);
   for (subDec of subDecs) {
      const subDecOption = document.createElement('option');
      subDecOption.setAttribute('value', subDec);
      subDecOption.textContent = subDec;
      subDecDatalist.appendChild(subDecOption);
   }
}

/*
 * Create a new decree and add it to the list of valid decrees.
 * */
function makeDec () {
   const subDec1 = document.querySelector('#subdecree1');
   const subDec2 = document.querySelector('#subdecree2');
   const subDec3 = document.querySelector('#subdecree3');
   const dec = new Decree(subDec1.value, subDec2.value, subDec3.value);
   if (Decree.inDecArray(dec, validDecs)) {
      alert(config.ALERT_DECREE_EXISTS);
      return;
   }
   validDecs.push(dec);

   console.log(validDecs);
   updateValidDecs(dec);
   actions++;

   if (actions >= 3) {
      actions = 0;
      advanceDay();
   }
}

/*
 * Update the HTML list with the valid decrees.
 * */
function updateValidDecs (dec) {
   const decsList = document.querySelector('#valid-decrees');
   const newDec = document.createElement('li');
   newDec.textContent = dec.dec2string();
   newDec.setAttribute('class', 'list-group-item');
   decsList.appendChild(newDec);
}

/*
 * Advance day to tomorrow.
 * */
function advanceDay () {
   let gameLost = false;
   calcInfected();
   console.log('next day with new infected: ' + newInfected);
   if (newInfected > 0) {
      infected += Math.max(Math.floor(newInfected/10), 1);
      //chartData.push({x: day, y: infected});
      chartData.push([day, infected]);
   }else {
      reset = true;
   }
   day++;
   updateInfected();
   updateDay();
   updateGraph();

   if (day >= config.LAST_DAY) {
      if (infected >= config.MAX_INFECTED)
      {
         gameLost = true;
      }
      endGame(gameLost);
   }
}

/*
 * Update the day on the GUI
 * */
function updateDay () {
   const dayElement = document.querySelector('#day');
   dayElement.textContent = day;
}

/*
 * Calculate the number of infected people based on the valid decrees.
 * */
function calcInfected () {
   let reset = false; //UBBI???
   const standard_factor = 3.8 + infectionFactor + getRandomInt(0, 10) * 0.02;
   const decrees_factor = sumInfectionFactors();
   newInfected += 0.5 + (infected + newInfected) * (Math.max(0.0, (decrees_factor + standard_factor)-1.0));
   if (newInfected == 0) {
      infectionFactor += Math.max((-(0.5*(decrees_factor-1.0)), 0.1));
   }
}

/* 
 * Update the number of infected people.
 * */
function updateInfected () {
   const infectedElement = document.querySelector('#infected');
   infectedElement.textContent = infected;
}

/* 
 * Calculate the total sum of the infaction factors of all the valid decrees.
 * */
function sumInfectionFactors () {
  // array.reduce((a, b) => a + b, 0)
   let totalFactor = 0.0;
   for (dec of validDecs) {
      totalFactor += dec.infectionFactor;
   }
   return totalFactor;
}

/*
 * Call this to end the game.
 * */
function endGame (gameLost) {
   let gameOver = config.GAME_OVER;
   if (gameLost) {
      gameOver += ' ' + config.LOST_GAME;
   }else {
      gameOver += ' ' + config.WON_GAME;
   }
   alert(gameOver);
}

/*
 * Update the graph
 */
function updateGraph() {
    //Using Google graphs
    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawBackgroundColor);

    function drawBackgroundColor() {
        const data = new google.visualization.DataTable();
        data.addColumn('number', 'days');
        data.addColumn('number', 'cases');

        data.addRows(chartData);

        const options = {
            hAxis: {
            title: 'Day'
            },
            vAxis: {
            title: 'Cases'
            },
            backgroundColor: '#f1f8e9'
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart-container'));
        chart.draw(data, options);
        }
    /*
    // Using CanvasJS
    let chart = new CanvasJS.Chart("chartContainer", {
        title: {
            text: 'Infected'
        },
        axisY: {
            //includeZero: false
        },
        data: [{
            type: 'line',
            dataPoints: chartData 
        }]
    })
    chart.render();
    */
}


/*
 * Initialization
 * */
let validDecs = [];
let day = 1;
let actions = 0;
let infectionFactor = 0.0;
let infected = 1;
let chartData = [[1, 1]];
let newInfected = 0;

//Initialize HTML
setLanguage();
// Initialize all three option lists
setSubDecOptions('#subdecree1', config.SUB_DECS.SUB_DECS1);
setSubDecOptions('#subdecree2', config.SUB_DECS.SUB_DECS2);
setSubDecOptions('#subdecree3', config.SUB_DECS.SUB_DECS3);
updateInfected();
updateDay();
updateGraph();


/* 
 * All the Event listeners
 * */
const makeDecButton = document.querySelector('#make-decree');
makeDecButton.addEventListener('click', makeDec);

const nextDayButton = document.querySelector('#next-day');
nextDayButton.addEventListener('click', advanceDay);
