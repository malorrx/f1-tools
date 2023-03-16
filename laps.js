
// Tableaux contenant les options pour chaque dropdown
const years = ["2023","2022","2021","2020","2019","2018"]

const sessions = ["Qualifications","Course","Essais libres 3","Essais libres 2","Essais libres 1"]
const sessionsID = ["Q","R","FP3","FP2","FP1"]

// Récupération des éléments HTML
const yearSelect = document.getElementById("year-select");
const raceSelect = document.getElementById("race-select");
const driverSelect = document.getElementById("driver-select");
const plotBtn = document.getElementById("plot-btn");
const sessionSelect = document.getElementById("session-select");

// Ajout des options aux dropdowns
years.forEach((year) => {
	const option = document.createElement("option");
	option.value = year;
	option.text = year;
	yearSelect.appendChild(option);
});

// Ajout des options aux dropdowns
sessions.forEach((session) => {
	const option = document.createElement("option");
	option.value = sessionsID[sessions.indexOf(session)];
	option.text = session;
	sessionSelect.appendChild(option);
});

async function getRaces(){
	year = yearSelect.value;
	try {
		const response = await fetch(`https://api.f1tools.fr/races/${year}`);
		const data = await response.json();
		races = data[0].races;
		console.log(data);
		// Continuez ici le traitement de votre code
	} catch (error) {
	  console.error('Une erreur s\'est produite :', error);
	}

	// Suppression des options existantes
	raceSelect.innerHTML = "";

	races.forEach((race) => {
		const option = document.createElement("option");
		option.value = race;
		option.text = race;
		raceSelect.appendChild(option);
	});
}

async function getDrivers() {
	year = yearSelect.value;
	try {
		const response = await fetch(`https://api.f1tools.fr/drivers/${year}`);
		const data = await response.json();
		drivers = data[0].drivers;
		console.log(data);
		// Continuez ici le traitement de votre code
	} catch (error) {
	  console.error('Une erreur s\'est produite :', error);
	}

	// Suppression des options existantes
	driverSelect.innerHTML = "";


	drivers.forEach((driver) => {
		const option = document.createElement("option");
		option.value = driver;
		option.text = driver;
		driverSelect.appendChild(option);
		

	});
}


yearSelect.value = "2023";
getRaces();
getDrivers();

// Récupération des éléments HTML
const tableContent = document.getElementById("table-content");



//
async function get_table(){
  // Afficher l'icône de chargement
	document.getElementById("loader").style.display = "block";
	plotBtn.disabled = true;

  // Récupération des données
  year = yearSelect.value;
  const gp = races.indexOf(raceSelect.value)+1;
  ses = sessionSelect.value;
  driver = driverSelect.value;
  //Envoie de la requete
	try {
    hideError();
		const response = await fetch(`https://api.f1tools.fr/table/laps?year=${year}&race=${gp}&session=${ses}&driver=${driver}`);
		const data = await response.json();
    laps = data;
		console.log(data);
    tableContent.innerHTML = "<tr> \
                                      <th class='w3-center'>Tour</th> \
                                      <th class='w3-center'>Temps</th> \
                                      <th class='w3-center'>Secteur 1</th> \
                                      <th class='w3-center'>Secteur 2</th> \
                                      <th class='w3-center'>Secteur 3</th> \
                                      <th class='w3-center'>Speed Trap</th> \
                                      <th class='w3-center'>Usure</th> \
                                      <th class='w3-center'>Pneu</th> \
                                      </tr>";
		// Continuez ici le traitement de votre code
        laps.forEach(lap => {      
            raw = document.createElement("tr");
            raw.innerHTML += "<td>" + lap['LapNumber'] + "</td>";
            raw.innerHTML += "<td>" + convertirMillisecondes(lap['LapTime']) + "</td>";
            raw.innerHTML += "<td>" + convertirMillisecondes(lap['Sector1Time']) + "</td>";
            raw.innerHTML += "<td>" + convertirMillisecondes(lap['Sector2Time']) + "</td>";
            raw.innerHTML += "<td>" + convertirMillisecondes(lap['Sector3Time']) + "</td>";
            raw.innerHTML += "<td>" + lap['SpeedST'] + " km/h</td>";
            raw.innerHTML += "<td>" + lap['TyreLife'] + " Tours</td>";
			
			// Gestion des composé de pneu avec les images
			img = document.createElement("img");
			img.classList.add("wheel-img");
			if (lap['Compound'] == "SOFT")
				img.src = "icons/wheel_soft.png";
			else if (lap['Compound'] == "MEDIUM")
				img.src = "icons/wheel_medium.png";
			else if (lap['Compound'] == "HARD")
				img.src = "icons/wheel_hard.png";
			else if (lap['Compound'] == "INTERMEDIATE")	
				img.src = "icons/wheel_intermediate.png";
			else if (lap['Compound'] == "WET")	
				img.src = "icons/wheel_wet.png";
			else
				img.src = "icons/wheel_unknown.png";
			td = document.createElement("td");
			td.appendChild(img);
			raw.appendChild(td);
			if (lap['IsAccurate'] == false)
            	raw.style.color = "gray";
            tableContent.appendChild(raw);
        });
        plotBtn.disabled = false;
        document.getElementById("loader").style.display = "none";
	} catch (error) {
	  console.error('Une erreur s\'est produite :', error);
    showError(error);
    plotBtn.disabled = false;
    document.getElementById("loader").style.display = "none";
	}
}

function convertirMillisecondes(chaineMillisecondes) {
	// Vérifier si la chaîne de caractères représente un nombre valide
	if (isNaN(chaineMillisecondes) || chaineMillisecondes == null) {
	  	return '/'
	}
  
	// Convertir la chaîne de caractères en nombre entier
	const millisecondes = parseInt(chaineMillisecondes, 10);
  
	// Vérifier si le nombre de millisecondes est positif
	if (millisecondes < 0) {
	  throw new Error("Le nombre de millisecondes doit être positif");
	}
  
	// Calculer le nombre de minutes, de secondes et de millisecondes
	const minutes = Math.floor(millisecondes / 60000);
	const secondes = Math.floor((millisecondes % 60000) / 1000);
	const millisecondesRestantes = millisecondes % 1000;
	
	if(minutes == 0)
		return `${secondes}.${millisecondesRestantes}`;
	// Retourner la chaîne de caractères représentant le temps
	return `${minutes}:${secondes}.${millisecondesRestantes}`;
  }
  

// Ajout de l'événement au bouton
plotBtn.addEventListener("click", get_table);

// Getsion des erreurs
const errorDiv = document.querySelector(".error");
const errorText = document.querySelector(".error-text");
const closeBtn = document.querySelector(".close-btn");

function showError(message) {
  errorText.innerHTML = message;
  errorDiv.style.display = "block";
}

function hideError() {
  errorDiv.style.display = "none";
}

closeBtn.addEventListener("click", hideError);

yearSelect.addEventListener("change", getRaces);