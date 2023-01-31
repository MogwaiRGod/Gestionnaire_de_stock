/*  ////////////////////////////////   STOCK DISTRIBUTEUR ///////////////////////  */

//fonction qui vérifie que le stock distributeur est bien dans le local storage
function existeStock(id) {
    for (let i=0; i<localStorage.length; i++) {
        if (localStorage.getItem(`${id}${i}`)) {
            return 1;    
        }
    }
    return 0;
}

function itemsStock(nb_item, id) {
    nb_item=0;
    for (let i=0; i<localStorage.length; i++) {
        if (localStorage.getItem(`${id}${i}`)) {
            nb_item++;    
        }
    }
    return nb_item;

}

// le cas échéant, fonction qui envoie le stock distributeur dans le local storage
function setStock(stock, id){
    let index=0;
    stock.forEach(e => {
        localStorage.setItem(id+index, JSON.stringify(e));
        index++;
    })
    return;
}

//fonction qui récupère le stock distributeur du local storage
function getStock(stock, id){

    for (let i=0; i<localStorage.length; i++) {
        if (localStorage.getItem(`${id}${i}`)){
            stock[i]=JSON.parse(localStorage.getItem(`${id}${i}`));
        }
    }

    return stock;
}

//  fonction qui vérifie que l'item demandé en telle quantité est bien disponible dans le stock distributeur
function checkStockDistrib(stock, nom, qte) {
    let check = 1;
    stock.forEach(function(e){
        if (e.nom == nom) {
            if (parseInt(e.quantite) == 0) {
                check=0;
                alert("Le produit demandé n'est plus disponible.");
            } else if (parseInt(e.quantite) < parseInt(qte)) {
                check=0;
                alert(`Pas assez de produits en stock. Produits en stock : ${e.quantite}`);
            }
        }
    });
    return check;
}

// fonction qui met à jour le stock distributeur
function updateStockDistrib(stock, nom, qte, id){
    stock.forEach(e => {
        if (e.nom == nom){
            e.quantite -= qte;
            localStorage.setItem(id+e.index, JSON.stringify(e));
        }
    });
    
    return stock;
}