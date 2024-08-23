// Employees object
class Employees {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
        this.employees = {};
        this.employeeData = [];
        this.searchResults = {};
        this.states = {'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA','Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA','Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA','Kansas':'KS','Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD','Massachusetts':'MA','Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO','Montana':'MT','Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM','New York':'NY','North Carolina':'NC','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK','Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC','South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT','Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY'};
    }
    // method
    async fetchData() {
        fetch(this.apiUrl)
        .then(response => response.json())
        .then(data => { 
            this.employees = data.results;
            this.displayEmployees(data.results);
        })
        .catch(error => console.log(error));
    }
    // method
    displayEmployees(data) {
        let gallery = document.getElementById('gallery');
        // nuke the children elements of gallery
        gallery.replaceChildren();
        // loop through each employee returned
        data.forEach(employee => {
            // create employee card for each employee
            let employeeCard = `
                <div class="card" data-id='${this.employees.indexOf(employee)}'>
                    <div class="card-img-container">
                        <img class="card-img" src="${employee.picture.large}" alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                        <p class="card-text">${employee.email}</p>
                        <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
                    </div>
                </div>
            `;
            // add each employee card to the gallery div
            gallery.insertAdjacentHTML('beforeend', employeeCard);
        });
        // append search functionality if it doesnt exist
        !document.querySelector('.search-input') && this.appendSearch();
    }
    // method
    buildModal(id) {
        // clear the modal container if it exists already
        if (document.querySelector('.modal-container')) { document.querySelector('.modal-container').remove() }
        // set employee data equal to the id of the employee passed
        this.employeeData = this.employees[id];
        // create modal container
        let modalContainer = `
            <div class="modal-container" data-id='${id}'>
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${this.employeeData.picture.large}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${this.employeeData.name.first} ${this.employeeData.name.last}</h3>
                        <p class="modal-text">${this.employeeData.email}</p>
                        <p class="modal-text cap">${this.employeeData.location.city}</p>
                        <hr>
                        <p class="modal-text">${this.employeeData.phone}</p>
                        <p class="modal-text">${this.employeeData.location.street.number} ${this.employeeData.location.street.name} ${this.employeeData.location.city}, ${this.states[this.employeeData.location.state]} ${this.employeeData.location.postcode}</p>
                        <p class="modal-text">Birthday: ${new Date(this.employeeData.dob.date).toLocaleDateString()}</p>
                    </div>
                    <div class="modal-btn-container">
                        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                        <button type="button" id="modal-next" class="modal-next btn">Next</button>
                    </div>
                </div>
            </div>
        `;
        // insert modal container after gallery div
        document.getElementById('gallery').insertAdjacentHTML('afterend', modalContainer);
        // add click event listener to close the modal when x is clicked
        document.getElementById('modal-close-btn').addEventListener('click', this.modalClose);
        //
        document.getElementById('modal-prev').addEventListener('click', (e) => this.prevEmployee(e));
        //
        document.getElementById('modal-next').addEventListener('click', (e) => this.nextEmployee(e));
    }
    // method
    modalClose() {
        // remove modal container div when method is called
        document.querySelector('.modal-container').remove();
    }
    // method
    appendSearch() {
        // create input to append to page
        let search = `<input type="search" id="search-input" class="search-input" placeholder="Search...">`;
        // append to page
        document.querySelector('.search-container').insertAdjacentHTML('beforeend', search);
        // add keyup event so we can listen for what the user is typing
        document.getElementById('search-input').addEventListener('keyup', (e) => app.handleSearch(e));
    }
    // method
    searchEmployees(input) {
        // filter down the employees we fetched from the api to only those whose name include what is typed by the user
        this.searchResults = this.employees.filter(employee => `${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}`.includes(input));
        // display search results if not empty or input is greater than 0 and there are no matches, otherwise display initial employee results
        this.displayEmployees((this.searchResults.length > 0 || input.length > 0)? this.searchResults : this.employees);
    }
    // method
    prevEmployee(e) {
        // get all cards that are active on the screen and place their data-id values into an array
        let activeCards = [...document.querySelectorAll('#gallery .card')].map(card => +card.dataset.id);
        // get length of active cards
        let activeCardsLength = activeCards.length;
        // get the id of the employee that is currently shown in opened modal window
        let currentId = +e.target.closest('.modal-container').dataset.id;
        // if the id of the employee currently in modal window is equal to the id at index 0 in activeCards array
        // then we know the next index we need is from the last position in active cards
        // otherwise find index of employee we are on within active cards and get the index of the employee that is before it
        let newID = (currentId === activeCards[0]) ? activeCards[activeCardsLength - 1] : activeCards[activeCards.indexOf(currentId) - 1];
        this.buildModal(newID)
    }
    // method
    nextEmployee(e) {
        // get all cards that are active on the screen and place their data-id values into an array
        let activeCards = [...document.querySelectorAll('#gallery .card')].map(card => +card.dataset.id);
         // get length of active cards
        let activeCardsLength = activeCards.length;
          // get the id of the employee that is currently shown in opened modal window
        let currentId = +e.target.closest('.modal-container').dataset.id;
        // if the id of the employee currently in modal window is equal to the id at end of activeCards array
        // then we know the next index we need is from the first position in active cards
        // otherwise find index of employee we are on within active cards and get the index of the employee that is after it
        let newID = (currentId === activeCards[activeCardsLength - 1]) ? activeCards[0] : activeCards[activeCards.indexOf(currentId) + 1];
        this.buildModal(newID)
    }
}

// App Object
class App {
    constructor() {
        this.data = new Employees(`https://randomuser.me/api/?results=12&nat=US&inc=picture,name,email,location,phone,dob`);
    }
    // method
    displayLoading() {
        // loading message in case api is slow to load
        document.getElementById('gallery').innerHTML = 'Loading....'
    }
    // method
    startApp() {
        // call loading method to display loading message to user
        this.displayLoading();
        // fetch employee data
        this.data.fetchData();
        // add event listener to gallery div to listen for clicks on employee cards
        document.getElementById('gallery').addEventListener('click', (e) => this.handleCardClick(e));
    }
    // method
    handleCardClick(e) {
        // check that user clicked on an employee card, if so send that id to the build modal method
        e.target.id !== 'gallery' && this.data.buildModal(e.target.closest('.card').dataset.id);
    }
    //method
    handleSearch(e) {
        this.data.searchEmployees(e.target.value.toLowerCase());
    }
}

// instantiate app
// call startApp method
const app = new App();
app.startApp();