// 1. Sélection des éléments fixes
const dropdownBtn = document.getElementById("drop-text");
const list = document.getElementById("list");
const span = document.getElementById("span");

// 2. Ouvrir/Fermer le menu Wilayas
dropdownBtn.onclick = function(e) {
    e.stopPropagation();
    list.classList.toggle("list-show");
};

// 3. Charger les Wilayas et Communes depuis le JSON
fetch('./wilayas.json')
    .then(res => res.json())
    .then(data => {
        list.innerHTML = ""; // On vide la liste HTML

        data.forEach(wilaya => {
            let liWilaya = document.createElement("li");
            liWilaya.className = "dropdown-list-item";
            liWilaya.innerHTML = `${wilaya.nom} <i class="fa-solid fa-chevron-right" style="float:right; font-size:0.7rem;"></i>`;
            
            let subUl = document.createElement("ul");
            subUl.className = "sub-list";
            subUl.style.display = "none";

            wilaya.communes.forEach(commune => {
                let liCommune = document.createElement("li");
                liCommune.className = "sub-list-item";
                liCommune.innerText = commune;

                // --- LE CLIC CRUCIAL EST ICI ---
                liCommune.onclick = function(e) {
                    e.stopPropagation();
                    console.log("Clic détecté sur :", commune);
                    span.innerText = commune; // Change le texte du bouton
                    list.classList.remove("list-show"); // Ferme le menu
                    
                    // APPEL DE LA FONCTION DE RECHERCHE
                    chercherPharmacies(commune); 
                };

                subUl.appendChild(liCommune);
            });

            // Ouvrir les communes au clic sur la Wilaya
            liWilaya.onclick = function(e) {
                e.stopPropagation();
                subUl.style.display = (subUl.style.display === "none") ? "block" : "none";
            };

            liWilaya.appendChild(subUl);
            list.appendChild(liWilaya);
        });
    });

// 4. La fonction qui affiche la carte de la pharmacie
async function chercherPharmacies(nomCommune) {
    // On force en MAJUSCULE pour correspondre à la base de données
    const communeMaj = nomCommune.toUpperCase();
    const resultsDiv = document.getElementById("results-container");
    
    if (!resultsDiv) return console.error("ID results-container introuvable !");

    resultsDiv.innerHTML = "<p style='color:white;'>Recherche...</p>";

    try {
        const response = await fetch(`/api/garde/${communeMaj}`);
        const pharmacies = await response.json();

        resultsDiv.innerHTML = ""; 

        if (pharmacies.length === 0) {
            resultsDiv.innerHTML = `<p style='color:white;'>Aucune garde à ${communeMaj}.</p>`;
            return;
        }

        pharmacies.forEach(ph => {
            resultsDiv.innerHTML += `
                <div class="pharmacie-card">
                    <h4>${ph.pharmacieName}</h4>
                    <p><i class="fa-solid fa-location-dot"></i> ${ph.pharmacieadresse}</p>
                    <p><i class="fa-solid fa-phone"></i> ${ph.pharmaciePhone || 'Non renseigné'}</p>
                    <a href="tel:${ph.pharmaciePhone}" class="btn-call">Appeler</a>
                </div>`;
        });
    } catch (err) {
        resultsDiv.innerHTML = "<p style='color:red;'>Erreur serveur.</p>";
    }
}
