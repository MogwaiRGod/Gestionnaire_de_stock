/*  /////////////           TABLEAU HTML            /////////// */

function ajouterRangee(item, couleur, nomtab){  // fonction qui ajoute et remplit une rangée
                                // du tableau HTML avec un item entré
    let rangee = document.createElement("tr");
    rangee.setAttribute('id', 'rangee'+item.index+nomtab)
    let props = ["nom", "ref", "quantite"]; // liste des propriétés de l'item

    for (let i = 0; i < 3; i++) {
        let cellule = document.createElement("td");  // création de la cellule
        if (init) {
            cellule.setAttribute("class", "init");
        }
        cellule.setAttribute("id", `table-${props[i]}-${item[`${props[0]}`]}-${item.index}-${nomtab}`);  // la cellule suit la convention de nommage "table-propriété-nom"
        cellule.innerText= item[`${props[i]}`];
        cellule.style.background = couleur;
        rangee.appendChild(cellule);
    }   // FIN POUR

    return rangee;
}   // FIN FX


function affichageStock (stock, tab, couleur, nomtab) {  //récupère les données du stock utilisateur afin d'afficher 
                                        // le tableau HTML du stock

    stock.forEach(e => { // pour chaque item e dans le stock
        updateAffichageStock(e, tab, couleur, nomtab);
    });   

    return;
}


function updateAffichageStock(item, tab, couleur, nomtab){   // quand on ajoute un item au stock,
                                        // cette fonction va servir à màj le tableau HTML
    tab.appendChild(ajouterRangee(item, couleur, nomtab)); // on le met dans une rangée qu'on ajoute au tableau HTML
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

/*      /////////////////////////       COMMANDE/PANIER             ////////////////////// */

function resetPanier(panier, tab, id) {
    for (let i=0; i<panier.length; i++){
        console.log("rangee"+panier[i].index+id_panier);
        document.getElementById("rangee"+panier[i].index+id_panier).style.display = 'none';
    }
    videStock(id, panier);
    index_panier=0;
    panier = [];
    tab = document.createElement("table");
    tab2.appendChild(tab);
    tab.setAttribute('id', 'tableau_panier');
    affichageStock(panier, tab, background_base, id_panier);
    affichageStock(stock_user, tableau_HTML, background_base, 'stock');

    return panier, tab;
};

function ajouterAuPanier(nom, ref, qte, panier, nomtab, tab){
    
    for (let i=0; i<panier.length; i++) {
        if (panier[i].nom == nom && panier[i].ref == ref) {
            console.log(panier[i]);
            panier[i].quantite += parseInt(qte);
            item_input = panier[i];
            document.getElementById(`table-quantite-${item_input.nom}-${item_input.index}-${nomtab}`).innerText = item_input.quantite;
            document.getElementById(`table-quantite-${item_input.nom}-${item_input.index}-${nomtab}`).style.background = background_ajout;
            return;
        }
    }

    item_input = {  // création d'un objet JSON de l'item commandé s'il n'existe pas déjà dans le panier
        "nom" : nom,
        "ref" : ref,
        "quantite" : parseInt(qte),
        "index" : parseInt(index_panier)
    };
    index_panier++;
    panier.push(item_input);
    updateAffichageStock(item_input, tab, background_ajout, nomtab);
    setStock(panier, id_panier, panier.index);
    console.log(panier);
    return panier;
}

function envoiPanier(stock, panier, tab, id) {
    stock = panier;
    resetPanier(panier, tab, id);

    return stock;
}

function traiterCmd(nom, ref, qte,tab, bdd_distrib, nomtab) {

    // fonction qui calcule le prix de l'item en quantité demandée
    function calculPrix(nom, qte, bdd){
        let tmp_pdt;
        bdd.forEach(e => {  // on va chercher le prix dans la bdd du distributeur
            if (e.nom === nom){
                tmp_pdt = e;
            }
        });
        let prix = tmp_pdt.prix*qte;
        return prix;
    }

    // on vérifie que le produit peut bien être commandé <=> est en stock chez le distributeur
    if (checkStockDistrib(bdd_distrib, nom, qte) === 0) { // s'il n'y en a plus ou pas assez -> erreur et on stoppe le traitement de la commande
        return;
    }

    // si oui, on calcule et affiche son prix + total du panier
    let prix=parseFloat(calculPrix(nom, qte, bdd_distrib),2);
    document.getElementById("prix").innerText=prix;
    total+=prix;
    total=parseFloat(total, 2);
    document.getElementById("total").innerText=total;


    // on enlève le produit du stock distributeur
    updateStockDistrib(bdd_distrib, nom, qte, id_item_distrib);
    // on l'ajoute au panier
    ajouterAuPanier(nom, ref, qte, panier, nomtab, tab);

    nb_item++;  // on incrémente le numéro d'item pour la suite de la commande        

    return;
}

function checkCmd(ref, qte) {   
    console.log("ok4");
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





