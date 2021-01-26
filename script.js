const 
    card = document.querySelector('.card'),
    cardField = document.querySelectorAll('.card__field_value'),
    buttonLeft = document.querySelector('.arrow__left'),
    buttonRight = document.querySelector('.arrow__right');
let actual = localStorage.getItem('persona') ? JSON.parse(localStorage.getItem('persona')) : [1, 0];
let 
    homeLink,
    vehiclesLink = [],
    starshipsLink = [],
    filmsLink = [],
    speciesLink = [];

let filmsList = [];
//     starshipsList = [],
//     vehiclesList = [],
//     speciesList = [];

function getPerson(page, pers){

    fetch(`https://swapi.dev/api/people/?page=${page}`)
        .then(response => response.json())
        .then((data) => {
            const person=data.results[pers];
            console.log(person);
            // fetch(person.homeworld)
            //     .then(response => response.json())
            //     .then(home => {
            //         person.homeworld = home.name;
            //         fillInCard(person);
            //     });
            homeLink = person.homeworld;
            vehiclesLink = person.vehicles;
            starshipsLink = person.starships;
            filmsLink = person.films;
            speciesLink = person.species;

            getFilmsList(filmsLink);
            fillInCard(person);
        });
}

function getFilmsList(films){
    filmsList = [];
    films.map((link)=>{
        fetch(link)
            .then(response => response.json())
            .then((filmObject) => {
                filmsList.push(filmObject.title);
        })
    })
}

function fillInCard(data){
    cardField[0].textContent = data.name;
    cardField[1].textContent = data.birth_year;
    cardField[2].textContent = data.gender;
    cardField[3].textContent = data.height;
    cardField[4].textContent = data.mass;
    cardField[5].textContent = data.eye_color;
    cardField[6].textContent = data.hair_color;
    cardField[7].textContent = data.skin_color;
    cardField[8].textContent = data.homeworld;
    console.log(filmsList[0]);
    cardField[9].innerHTML = filmsList.map((film) => {
        return `
            <li>${film}</li>`});
}

function nextPerson(pers) {
    if(pers==9){
        actual[0]+=1;
        actual[1] = 0;
    }else{
        actual[1]+=1;
    }
    getPerson(actual[0], actual[1]);
    localStorage.setItem('persona', JSON.stringify(actual));
}

function prevPerson(pers){
    if(pers==0){
        if (actual[0]>1){
            actual[0]-=1;
            actual[1] = 9;
        }else{
            actual[0]=1;
            actual[1]=0;
        }
    }else{
        actual[1]-=1;
    }
    getPerson(actual[0], actual[1]);
    localStorage.setItem('persona', JSON.stringify(actual));
}


buttonRight.addEventListener('click', () => nextPerson(actual[1]));
buttonLeft.addEventListener('click', () => prevPerson(actual[1]));


getPerson(actual[0], actual[1]);