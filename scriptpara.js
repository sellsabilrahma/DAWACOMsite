let dropdownBtn = document.getElementById("drop-text");
let list = document.getElementById("list");
let icon = document.getElementById("icon");
let span = document.getElementById("span");
let input = document.getElementById("search-input");
let listItems = document.querySelectorAll(".dropdown-list-item");

dropdownBtn.onclick = function(){
    if(list.classList.contains("list-show")) {
        icon.style.rotate = "0deg";
    } else {
        icon.style.rotate = "-180deg";
    }
    list.classList.toggle("list-show");
};

window.onclick = function (e) {
    if (
         e.target.id !== "drop-text" &&
         e.target.id !== "span" &&
         e.target.id !== "icon"
        ) {
            list.classList.remove("list-show");

            icon.style.rotate = "0deg";
        }
};

for(item of listItems){
item.onclick=function(e){
    span.innerText = e.target.innerText;

    if(e.target.innerText == "Willayas"){
        input.Placeholder = "Chercher un produit";
    } else {
        input.Placeholder = "Chercher un produit a " + e.trget.innerText + "...";
  };
};
}

