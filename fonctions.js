/*  /////////////           TABLEAU HTML            /////////// */

function ajouterRangee(item, tab){  // fonction qui ajoute et remplit une rangée
                                // du tableau HTML avec un item entré

    let rangee = document.createElement("tr");  // création de la rangée
    let props = ["nom", "ref", "quantite"]; // liste des propriétés de l'item

    for (let i = 0; i < 3; i++) {
        let cellule = document.createElement("td");  // création de la cellule
        cellule.setAttribute("id", `table-${props[i]}-${item[`${props[0]}`]}`);  // la cellule suit la convention de nommage "table-propriété-nom"
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
    tab.appendChild(ajouterRangee(item, tab)); // on le met dans une rangée qu'on ajoute au tableau HTML
    return;
}



/*  //////////              STOCK UTILISATEUR       ///////////////////    */

function updateStockUser(stock, item) {

    // on vérifie s'il y a déjà ce produit dans le stock
    for (let i=0; i<stock_user.length; i++) {

        if (stock[i].nom === item.nom){

            // si oui, on va le mettre à jour
            stock[i].quantite += item.qte;
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

    let item_input = {  // création d'un objet JSON de l'item commandé
        "nom" : nom,
        "ref" : ref,
        "quantite" : qte
    };

    // envoi de l'item dans le stockage local
    localStorage.setItem('item'+nb_item, JSON.stringify(item_input));

    nb_item++;  // on incrémente le numéro d'item pour la suite de la commande

    //  update du stock actuel
    stock=updateStockUser(stock_user, item_input);

    // màj du tableau HTML du stock
    updateAffichageStock(item_input, tab);

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
    return 'erreur 2';
}



