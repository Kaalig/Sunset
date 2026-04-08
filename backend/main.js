const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];


function show_tab(tabName){
    document.querySelector("Dashboard").style.display = "none";
    document.querySelector("Notes").style.display = "none";
    document.querySelector("Habits").style.display = "none";
    document.querySelector("Rendez-vous").style.display = "none";
    document.querySelector(tabname).style.display = "block";
  
}


