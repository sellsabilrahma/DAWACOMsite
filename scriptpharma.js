const dropdownBtn = document.getElementById("drop-text");
const list = document.getElementById("list");
const span = document.getElementById("span");


const BACKEND_URL = "https://dawa-backend.onrender.com";


dropdownBtn.onclick = function(e) {
    e.stopPropagation();
    list.classList.toggle("list-show");
};


fetch('./wilayas.json')
    .then(res => {
        if (!res.ok) throw new Error("Impossible de charger wilayas.json");
        return res.json();
    })
    .then(data => {
        list.innerHTML = "";
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

                liCommune.onclick = function(e) {
                    e.stopPropagation();
                    console.log("Clic détecté sur :", commune);
                    span.innerText = commune; 
                    list.classList.remove("list-show"); 
                    chercherPharmacies(commune); 
                };
                subUl.appendChild(liCommune);
            });

            liWilaya.onclick = function(e) {
                e.stopPropagation();
                subUl.style.display = (subUl.style.display === "none") ? "block" : "none";
            };

            liWilaya.appendChild(subUl);
            list.appendChild(liWilaya);
        });
    })
    .catch(err => console.error("Erreur chargement wilayas:", err));


async function chercherPharmacies(nomCommune) {
    const communeMaj = nomCommune.toUpperCase();
    const resultsDiv = document.getElementById("results-container");

    if (!resultsDiv) return console.error("ID results-container introuvable !");

    resultsDiv.innerHTML = "<p>Recherche en cours...</p>";

    try {
        // Fetch depuis le backend Render
        const response = await fetch(`${BACKEND_URL}/api/garde/${communeMaj}`);
        if (!response.ok) throw new Error("Erreur réseau ou commune non trouvée");

        const pharmacies = await response.json();
        resultsDiv.innerHTML = ""; // on vide avant affichage

        if (!pharmacies || pharmacies.length === 0) {
            resultsDiv.innerHTML = `<p>Aucune pharmacie de garde trouvée à ${communeMaj}.</p>`;
            return;
        }

        pharmacies.forEach(ph => {
            resultsDiv.innerHTML += `
                <div class="pharmacie-card">
                    <h4>${ph.pharmacieName || 'Nom inconnu'}</h4>
                    <p><i class="fa-solid fa-location-dot"></i> ${ph.pharmacieadresse || 'Adresse non renseignée'}</p>
                    <p><i class="fa-solid fa-phone"></i> ${ph.pharmaciePhone || 'Non renseigné'}</p>
                    ${ph.pharmaciePhone ? `<a href="tel:${ph.pharmaciePhone}" class="btn-call">Appeler</a>` : ''}
                </div>
            `;
        });
    } catch (err) {
        console.error("Erreur fetch pharmacies:", err);
        resultsDiv.innerHTML = "<p style='color:red;'>Désolé, une erreur est survenue lors de la connexion au serveur.</p>";
    }
}
