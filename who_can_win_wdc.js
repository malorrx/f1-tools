
// Récupération des éléments HTML
const tableContent = document.getElementById("table-content");



//
async function get_table(){
	try {
		const response = await fetch(`https://api.f1tools.edmee.online/table/can_win_chamionship`);
		const data = await response.json();
        drivers = data[0].drivers;
		console.log(drivers);
		// Continuez ici le traitement de votre code
        drivers.forEach(driver => {       
            raw = document.createElement("tr");
            raw.innerHTML += "<td>" + driver['Driver']['givenName'] + " " + driver['Driver']['familyName'] + "</td>";
            raw.innerHTML += "<td>" + driver['points'] + "</td>";
            raw.innerHTML += "<td>" + driver['max_points'] + "</td>";
            if (driver['can_win'] == "Yes") {
                raw.innerHTML += "<td style='color: #005ca9;'>Oui</td>";
            }
            else {
                raw.innerHTML += "<td  style='color: gray;'>Non</td>";
            }
            tableContent.appendChild(raw)

        });
	} catch (error) {
	  console.error('Une erreur s\'est produite :', error);
	}
}


get_table();

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