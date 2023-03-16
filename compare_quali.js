
// Tableaux contenant les options pour chaque dropdown
const years = ["2023","2022","2021","2020","2019","2018"]



// Récupération des éléments HTML
const yearSelect = document.getElementById("year-select");
const raceSelect = document.getElementById("race-select");
const driver1Select = document.getElementById("driver1-select");
const driver2Select = document.getElementById("driver2-select");
const plotBtn = document.getElementById("plot-btn");
const plotContainer = document.getElementById("plot-container");


// Ajout des options aux dropdowns
years.forEach((year) => {
	const option = document.createElement("option");
	option.value = year;
	option.text = year;
	yearSelect.appendChild(option);
});


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
	driver1Select.innerHTML = "";
	driver2Select.innerHTML = "";

	drivers.forEach((driver) => {
		const option1 = document.createElement("option");
		option1.value = driver;
		option1.text = driver;
		driver1Select.appendChild(option1);
		
		const option2 = document.createElement("option");
		option2.value = driver;
		option2.text = driver;
		driver2Select.appendChild(option2);
	});
}

//
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


yearSelect.value = "2023";
getRaces();
getDrivers();







// Fonction pour envoyer la requête et afficher l'image
function plotGraph() {
	// Afficher l'icône de chargement
	document.getElementById("loader").style.display = "block";
	plotBtn.disabled = true;
	// Récupération des valeurs des dropdowns
	const year = yearSelect.value;
	const race = races.indexOf(raceSelect.value) + 1;
	const driver1 = driver1Select.value;
	const driver2 = driver2Select.value;

	// Cacher l'erreur
	hideError();

	// Construction de l'URL avec les valeurs des dropdowns
	const url = `https://api.f1tools.fr/plot/compare/qualif/${year}/${race}/${driver1}/${driver2}`;
  
	// Envoi de la requête
	fetch(url)	
		.then((response) => {
			if (!response.ok) {
				return response.text().then(text => {throw new Error(text)})
			}
			return response.blob();
	  	})
	  	.then((blob) => {
			// Création de l'élément image
			let img = plotContainer.querySelector("img");
			if (!img) {
		
				img = document.createElement("img");
				img.classList.add("plot");
				img.alt = `Graphique comparant la qualification de ${driver1} et ${driver2} à ${race} en ${year}`;
				plotContainer.appendChild(img);
			}
  
			img.onload = () => {
			// Masquer l'icône de chargement
			document.getElementById("loader").style.display = "none";
			};
			img.src = URL.createObjectURL(blob);
			plotBtn.disabled = false;
		})
		.catch((error) => {
			plotBtn.disabled = false;
			console.error(error);
			// Afficher l'erreur dans la div "error"
			json_error = JSON.parse(error.message);
			showError(`Erreur: ${json_error.error}`);
			// Masquer l'icône de chargement
			document.getElementById("loader").style.display = "none";
		});
  }
  

// Ajout de l'événement au bouton
plotBtn.addEventListener("click", plotGraph);

// Ajout de l'événement au selecteur de date
yearSelect.addEventListener("change", getDrivers);
yearSelect.addEventListener("change", getRaces);





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

