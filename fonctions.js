/*  /////////////           TABLEAU HTML            /////////// */

function ajouterRangee(item, couleur){  // fonction qui ajoute et remplit une rangée
                                // du tableau HTML avec un item entré
    let rangee = document.createElement("tr");
    let props = ["nom", "ref", "quantite"]; // liste des propriétés de l'item

    for (let i = 0; i < 3; i++) {
        let cellule = document.createElement("td");  // création de la cellule
        if (init) {
            cellule.setAttribute("class", "init");
        }
        cellule.setAttribute("id", `table-${props[i]}-${item[`${props[0]}`]}-${item.index}`);  // la cellule suit la convention de nommage "table-propriété-nom"
        cellule.innerText= item[`${props[i]}`];
        cellule.style.background = couleur;
        rangee.appendChild(cellule);
    }   // FIN POUR

    return rangee;
}   // FIN FX


function affichageStock (stock, tab, couleur) {  //récupère les données du stock utilisateur afin d'afficher 
                                        // le tableau HTML du stock

    stock.forEach(e => { // pour chaque item e dans le stock
        updateAffichageStock(e, tab, couleur);
    });   

    return;
}


function updateAffichageStock(item, tab, couleur){   // quand on ajoute un item au stock,
                                        // cette fonction va servir à màj le tableau HTML
    tab.appendChild(ajouterRangee(item, couleur)); // on le met dans une rangée qu'on ajoute au tableau HTML
    return;
}





/*  //////////              STOCK UTILISATEUR       ///////////////////    */

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
    // fonction qui calcule le prix de l'item en quantité demandée
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

    // on vérifie que le produit peut bien être commandé 
    if (checkStockDistrib(stock_distributeur, nom, qte) === 0) { // s'il n'y en a plus ou pas assez -> erreur et on stoppe le traitement de la commande
        return;
    }

    // sinon, on peut procéder au traitement de la commande
    let prix=parseFloat(calculPrix(nom, qte, bdd_distrib),2);
    document.getElementById("prix").innerText=prix;
    total+=prix;
    total=parseFloat(total, 2);
    document.getElementById("total").innerText=total;
    let item_input;

    // on enlève le produit du stock distributeur
    updateStockDistrib(stock_distributeur, nom, qte, id_item_distrib);

    if (storage_init) {
        for (let i=0; i<stock.length; i++) {
            if ( stock[i].nom == nom && stock[i].ref == ref) {
                stock[i].quantite += parseInt(qte);
                localStorage.setItem('item'+i, JSON.stringify(stock[i]));
                item_input = stock[i];
                document.getElementById(`table-quantite-${item_input.nom}-${item_input.index}`).innerText = item_input.quantite;
                document.getElementById(`table-quantite-${item_input.nom}-${item_input.index}`).style.background = background_ajout;
                panier[0][nb_item] = [item_input, prix];
                panier[1] = total;
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
    updateAffichageStock(item_input, tab, background_ajout);

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





