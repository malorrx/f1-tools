
// Tableaux contenant les options pour chaque dropdown
const years = ["2023","2022","2021","2020","2019","2018"]



// Récupération des éléments HTML
const yearSelect = document.getElementById("year-select");
const raceSelect = document.getElementById("race-select");
const plotBtn = document.getElementById("plot-btn");


// Ajout des options aux dropdowns
years.forEach((year) => {
	const option = document.createElement("option");
	option.value = year;
	option.text = year;
	yearSelect.appendChild(option);
});

async function getRaces(){
	year = yearSelect.value;
	try {
		const response = await fetch(`https://api.f1tools.edmee.online/races/${year}`);
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


yearSelect.value = "2023";
getRaces();


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

  //Envoie de la requete
	try {
    hideError();
		const response = await fetch(`https://api.f1tools.edmee.online/table/results/race?year=${year}&race=${gp}`);
		const data = await response.json();
    drivers = data;
		console.log(data);
    tableContent.innerHTML = "<tr> \
                                      <th class='w3-center'>Position à l'arrivée</th> \
                                      <th class='w3-center'>Pilote</th> \
                                      <th class='w3-center'>Position sur la grille</th> \
                                      <th class='w3-center'>Points</th> \
                                      <th class='w3-center'>Info</th> \
                                      </tr>";
		// Continuez ici le traitement de votre code
        drivers.forEach(driver => {       
            raw = document.createElement("tr");
            raw.innerHTML += "<td>" + driver['Position'] + "</td>";
            raw.innerHTML += "<td>" + driver['FullName'] + "</td>";
            raw.innerHTML += "<td>" + driver['GridPosition'] + "</td>";
            raw.innerHTML += "<td>+" + driver['Points'] + "</td>";
            if (driver['Status'] == "Finished") {
            }
            else {
                raw.innerHTML += "<td>" + driver['Status'] + "</td>";
            }
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