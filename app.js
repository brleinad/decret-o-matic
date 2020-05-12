const SUBDECS1 = [
    "evitate",
    "non recatevi ne",
    "recatevi ne",
    "non rimanete ne",
    "rimanete ne",
    "non chiuderemo",
    "chiuderemo",
    ];
const SUBDECS2 = [
    "i parchi pubblici",
    "i supermercati",
    "la propria abitazione",
    "il luogo di lavoro",
    "il comune di residenza",
    "i cantieri",
    "le scuole",
    ];
const SUBDECS3 = [
    "per esigenze lavorative",
    "per comprovate necessita'",
    "in piu' di due persone",
    "per motivi di salute",
    "a un metro di distanza",
    "per produzioni di interesse strategico",
    "per beni di prima necessita'",
    ];


/*
 * Class to represent a single decree made up of sub decrees.
 * */
function Decree (subDec1, subDec2, subDec3) {
   this.subDec1 = subDec1;
   this.subDec2 = subDec2;
   this.subDec3 = subDec3;

   this.dec2string = () => {
      return `${this.subDec1} ${this.subDec2} ${this.subDec3}`;
   }
}

/*
 * Initializes all the sub decree options for the three inputs
 * */
function setSubDecOptions (id, subDecs) {
   const subDecDatalist = document.querySelector(id);
   for (subDec of subDecs) {
      const subDecOption = document.createElement('option');
      subDecOption.setAttribute('value', subDec);
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
   validDecs.push(dec);

   console.log(validDecs);
   updateValidDecs(dec);
}


/*
 * Update the HTML list with the valid decrees.
 * */
function updateValidDecs (dec) {
   const decsList = document.querySelector('#valid-decrees');
   const newDec = document.createElement('li');
   newDec.textContent = dec.dec2string();
   decsList.appendChild(newDec);
}


/*
 * Initialization
 * */

// Initialize all three option lists
setSubDecOptions('#subdecrees1options', SUBDECS1);
setSubDecOptions('#subdecrees2options', SUBDECS2);
setSubDecOptions('#subdecrees3options', SUBDECS3);

validDecs = []

/* 
 * All the Event listeners
 * */
const makeDecButton = document.querySelector('#make-decree');
makeDecButton.addEventListener('click', makeDec);
