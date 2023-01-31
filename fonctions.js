/*  /////////////           TABLEAU HTML            /////////// */

function ajouterRangee(item){  // fonction qui ajoute et remplit une rangée
                                // du tableau HTML avec un item entré

    let rangee = document.createElement("tr");  // création de la rangée
    rangee.setAttribute("id", `rangee-${item.nom}`);
    let props = ["nom", "ref", "quantite"]; // liste des propriétés de l'item

    for (let i = 0; i < 3; i++) {
        let cellule = document.createElement("td");  // création de la cellule
        if (init) {
            cellule.setAttribute("class", "init");;
        }
        cellule.setAttribute("id", `table-${props[i]}-${item[`${props[0]}`]}-${item.index}`);  // la cellule suit la convention de nommage "table-propriété-nom"
        cellule.innerText= item[`${props[i]}`];
        rangee.appendChild(cellule);
    }   // FIN POUR

    return rangee;
}   // FIN FX


function affichageStock (stock, tab) {  //récupère les données du stock utilisateur afin d'afficher 
                                        // le tableau HTML du stock

    stock.forEach(e => { // pour chaque item e dans le stock
        updateAffichageStock(e, tab);
    });   

    return;
}


function updateAffichageStock(item, tab){   // quand on ajoute un item au stock,
                                        // cette fonction va servir à màj le tableau HTML
    tab.appendChild(ajouterRangee(item)); // on le met dans une rangée qu'on ajoute au tableau HTML
    return;
}





/*  //////////              STOCK UTILISATEUR       ///////////////////    */

function recupItems (stock){    // récupération des items du stock utilisateur
                                // dans le local storage
          
    for (let i=0; i<localStorage.length; i++) {
        stock.push(JSON.parse(localStorage.getItem(`item${i}`)));
    }
        
    return stock;
}



function updateStockUser(stock, item) {

    // on vérifie s'il y a déjà ce produit dans le stock
    for (let i=0; i<stock_user.length; i++) {

        if (stock[i].nom === item.nom){

            // si oui, on va le mettre à jour
            stock[i].quantite += item.quantite;
            return stock;
        }
    }

    // si le produit n'est pas encore dans le stock, on va l'ajouter
    stock.push(item);

    return stock;
}




/*      /////////////////////       COMMANDE             ////////////////////// */

function traiterCmd(nom, ref, qte, stock, tab, bdd_distrib) {
    function calculPrix(nom, qte, bdd){
        let tmp_pdt;
        bdd.forEach(e => {
            if (e.nom === nom){
                tmp_pdt = e;
            }
        });
        let prix = tmp_pdt.prix*qte;
        return prix;
    }

    let prix=calculPrix(nom, qte, bdd_distrib);
    document.getElementById("prix").innerText=prix;
    total+=prix;
    document.getElementById("total").innerText=total;
    let item_input;

    if (storage_init) {
        for (let i=0; i<stock.length; i++) {
            if ( stock[i].nom == nom && stock[i].ref == ref) {
                stock[i].quantite += parseInt(qte);
                localStorage.setItem('item'+i, JSON.stringify(stock[i]));
                item_input = stock[i];
                document.getElementById(`table-quantite-${item_input.nom}-${i}`).innerText = item_input.quantite;
                document.getElementById(`table-quantite-${item_input.nom}-${i}`).style.background = 'rgb(166, 84, 69)';
                return;
            }
        }
    }
    storage_init=true;
    item_input = {  // création d'un objet JSON de l'item commandé
        "nom" : nom,
        "ref" : ref,
        "quantite" : parseInt(qte),
        "index" : parseInt(nb_item)
    };
    localStorage.setItem('item'+nb_item, JSON.stringify(item_input));
    stock.push(item_input);
    updateAffichageStock(item_input, tab);

    nb_item++;  // on incrémente le numéro d'item pour la suite de la commande        

    return;
}


function checkCmd(ref, qte) {   
    // vérification des entrées
    if (qte == 0 || qte == "") {
        window.alert("Veuillez entrer une quantité valide");
        return 0;
    } else if (ref == ""){
        window.alert ("Veuillez entrer une référence valide");
        return 0;
    }
    else {
        return 1;
    }
}





