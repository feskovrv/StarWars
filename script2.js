const 
    card = document.querySelector('.card'),
    cardField = document.querySelectorAll('.card__field_value'),
    buttonLeft = document.querySelector('.arrow__left'),
    buttonRight = document.querySelector('.arrow__right');
let current = localStorage.getItem('person')? parseInt(JSON.parse(localStorage.getItem('person'))) : 1,
    old,
    count;
function getPerson(page){
    let person = new Promise((resolve, reject) => {
        //получаем персонаж
        fetch(`https://swapi.dev/api/people/${page}`)
            .then(response => {
                if(response.ok){
                    response.json()
                    .then(peopleObject => {
                        //получаем планету
                        getHomeworld(peopleObject);
                        //получаем список кораблей
                        getStarships(peopleObject);
                        //получаем список фильмов
                        getFilms(peopleObject);
                        //получаем список транспорта
                        getVehicles(peopleObject);
                        //получаем специализацию
                        getSpecies(peopleObject);
                        resolve(peopleObject);
                    })
                }else{
                    console.log('Не удалось загрузить данные');
                    current>old?nextPerson():prevPerson();
                }
            })

    })

    person.then((resolve)=>{
        fillInCard(resolve);
    });
}

function getHomeworld(person){
    fetch(person.homeworld)
        .then(response => response.json())
        .then(homeworld => {
            person.homeworld = homeworld.name;
            cardField[8].textContent = homeworld.name;
        })
}

function getStarships(person){
    let tempStarships = [];
    for(starship of person.starships){
        fetch(starship)
            .then(response => response.json())
            .then(starship => {
                tempStarships.push(starship.name);
                person.starships=[...tempStarships];  
                cardField[10].innerHTML = tempStarships.map((starship)=>{return `<li>${starship}</li>`}).join('');                        
            })
    }
}

function getFilms(person){
    let tempFilms = [];
    for(film of person.films){
        fetch(film)
            .then(response => response.json())
            .then(film => {
                tempFilms.push(film.title);
                person.films=[...tempFilms];
                cardField[9].innerHTML = tempFilms.map((film)=>{return `<li>${film}</li>`}).join('');
            })
    }
}
function getVehicles(person){
    let tempVehicles = [];
    for(vehicle of person.vehicles){
        fetch(vehicle)
            .then(response => response.json())
            .then(vehicle => {
                tempVehicles.push(vehicle.name);
                person.vehicles=[...tempVehicles];
                cardField[11].innerHTML = tempVehicles.map((vehicle)=>{return `<li>${vehicle}</li>`}).join('');
            })
    }
}
function getSpecies(person){
    let tempSpecies = [];
    for(specie of person.species){
        fetch(specie)
            .then(response => response.json())
            .then(specie => {
                tempSpecies.push(specie.name);
                person.species=[...tempSpecies];
            })
    }
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
    // cardField[8].textContent = data.homeworld;
    // cardField[9].innerHTML = data.films.map((film)=>{return `<li>${film}</li>`});
    // cardField[10].innerHTML = data.starships.map((starship)=>{return `<li>${starship}</li>`});
    cardField[11].innerHTML = data.vehicles.map((vehicle)=>{return `<li>${vehicle}</li>`});

    current==1 ? buttonLeft.classList.add('arrow__failed') : buttonLeft.classList.remove('arrow__failed');
    current==83 ? buttonRight.classList.add('arrow__failed') : buttonRight.classList.remove('arrow__failed');

}

buttonLeft.addEventListener('click', ()=>{
    prevPerson();
});
buttonRight.addEventListener('click', ()=>{
    nextPerson();
});

function nextPerson(){
    if(current<count+1){
        old = current;
        current+=1;
        getPerson(current);
        localStorage.setItem('person', JSON.stringify(current));
    }else{
        current=count+1;
    }

}
function prevPerson(){
    if(current>1){
        old = current;
        current-=1;
        getPerson(current); 
        localStorage.setItem('person', JSON.stringify(current));
    }else{
        current=1;
    }
}

function getCount(){
    fetch("http://swapi.dev/api/people/?page=1")
    .then(response=>response.json())
    .then(data=>count=data.count)
}
getCount();

getPerson(current);
