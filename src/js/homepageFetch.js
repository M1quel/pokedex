let url = new URLSearchParams(window.location.search)
var fetchLink = "https://pokeapi.co/api/v2/pokemon";
let offset = url.get("offset");
var template = document.querySelector("template");
var homepageMain = document.querySelector(".homepageMain");
let searchOffset = 0;
let prevBtn = document.querySelector(".homepageFooter__previous")
let nextBtn = document.querySelector(".homepageFooter__next")


function getAllPokemons(){
    let allFetch = fetchLink;
    if(url.get("offset")) {
        allFetch = fetchLink + "?offset=" + offset;
    } else if (url.get("searchInput")) {
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
        search()
        return
    }
    
    
    else {
        offset = 0
        allFetch = fetchLink
    }
    console.log("we are here")
    return fetch(allFetch)
    .then(response => response.json())
    .then(function(data){
        
        let pokemons = data.results;
        for (let i = 0; i < pokemons.length; i++) {
            let pokemon = pokemons[i];
            let clone = document.getElementById("pokemonCardTemplate").content.cloneNode(true);
            clone.querySelector(".homepageMain__pokemonName").innerText = pokemon.name;
            clone.querySelector(".homepageMain__pokemonCard").href = "pokeview.html?id=" + pokemon.url.split("/")[6]
            document.querySelector(".homepageMain").appendChild(clone)        
        }
        if (data.previous == null){
            prevBtn.style.display = "none";
        } else {
            prevBtn.href = "?offset=" + (parseInt(offset) - 20);
        }
    
        if(data.next == null) {
            nextBtn.style.display = "none";
        } else {
            nextBtn.href = "?offset=" + (parseInt(offset) + 20);
        }
    }) 
}






// Observer

let options = {
    threshold: 1.0
}

let observer = new IntersectionObserver(observerCallback, options);

function observerCallback(entries) {
    let {target, intersectionRatio} = entries[0];
    if (intersectionRatio > 0) {
        searchOffset = searchOffset + 20;
        search();
        observer.unobserve(target)
    } else {
        return
    }
}









// Search functions

let searchIcon = document.querySelector(".homepageHeader__searchIcon")
let searchForm = document.querySelector(".homepageHeader__searchForm")

searchIcon.addEventListener("click", searchAppear)






function searchAppear () {
    if(searchForm.style.height == 0 || searchForm.style.height == "0px") {
        searchForm.style.height = "80px";
    } else {
        searchForm.style.height = "0";
    }
}

function search() {
    if(!url.get("searchInput")) {
        return
    }
    else {
        let userInput  = url.get("searchInput")
        fetch(fetchLink + `?limit=1050`)
        .then(response => response.json())
        .then(function(data) {
            let pokemons = data.results;
            pokemons.forEach(pokemon => {
                if(pokemon.name.includes(userInput)) {
                    let clone = template.content.cloneNode(true);

                    clone.querySelector(".homepageMain__pokemonName").innerText = pokemon.name;
                    clone.querySelector(".homepageMain__pokemonCard").href = "pokeview.html?id=" + pokemon.url.split("/")[6]

                    homepageMain.appendChild(clone);
                }
            });
        })

    }
}


getAllPokemons()
