//https://restcountries.com/v2/all


let countryArr = [];
let sortedCountryArr = countryArr.sort();
let countryDetails = [];


const addInput = document.querySelector(".add-input");
const submit = document.querySelector(".submit")
const searchInput = document.querySelector(".search-input");
const inputBox = document.querySelector(".input");
const optionBox = document.querySelector(".option-box");
const searchContainer = document.querySelector(".search-container");
const note = document.querySelector("h5");
const chosenCountry = document.querySelector(".chosen-country");
const showListBtn = document.querySelector(".show-list");
const printList = document.querySelector(".list-display");
const listWrap = document.querySelector(".list-container");
const addContainer = document.querySelector(".add-container")
const countryFlag = document.querySelector(".flag")
const selectNote = document.querySelector(".select-note")

inputBox.value = "";
addInput.value = "";

searchInput.addEventListener("focusin", creatList)
addContainer.addEventListener("focusin", hideOptions)

let worldCountries = getCountriesNames();
let listLength = 0;

function getCountriesNames() {
    fetch(`https://restcountries.com/v2/all?fields=name`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            worldCountries = data;
            return worldCountries
        })
}

showListBtn.addEventListener("click", showList)

addInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        submit.click();
    }
});

submit.addEventListener("click", addCountry)

function addCountry() {
    let enteredCountry = addInput.value;
    let newCountry = fixCountryName(enteredCountry);

    hideCountryList()
    note.classList.remove("show");
    let countryExists = worldCountries.filter(x => x.name == newCountry)
    let same = countryArr.filter(x => x == newCountry)
    if (same.length > 0) {
        note.innerHTML = "*Country already listed";
        note.classList.add("show");
        addInput.value = "";
    } else if (newCountry.length == 0) {
        addInput.value = "";
        note.classList.remove("show");
    } else if (countryExists.length == 0) {
        note.innerHTML = "*Incorrect country name, check spelling";
        note.classList.add("show");
    } else {
        countryArr.push(newCountry);
        countryArr = countryArr.sort();
        addInput.value = "";
        listLength = countryArr.length
        let text = listLength == 0 ? `Country-list empty` : (listLength != 1 ? `${listLength} countries` : `see country`)
        if (listLength > 0) selectNote.classList.add("show")
        showListBtn.innerHTML = text
        note.classList.remove("show");
        changeCount(listLength)
    }
}

function creatList() {
    arr = [];
    if (countryArr && countryArr.length > 0) {
        arr = countryArr.map((data) => {
            return data = '<li>' + data + '</li>';
        });
        searchInput.classList.add("active");
    } else {
        searchInput.classList.remove("active");
    }
    showOptions(arr)
}



function showOptions(arr) {
    let flag = 0;
    let optionList;
    if (arr.length == 0) {
        userValue = inputBox.value;
        optionList = '<li>' + userValue + '</li>';


    } else {
        optionList = arr.join('');
        flag = 1;
    }
    optionBox.innerHTML = optionList;
    if (flag == 1) alowChoice()
    narrowList()
}

function hideOptions() {
    searchInput.classList.remove("active");
    inputBox.value = "";
}

function narrowList() {
    inputBox.onkeyup = (e) => {
        let reqCountry = e.target.value;
        let arr = [];
        if (reqCountry) {
            arr = countryArr.filter((countries) => {
                return countries.toLocaleLowerCase().startsWith(reqCountry.toLocaleLowerCase())

            });
            arr = arr.map((data) => {
                return data = '<li>' + data + '</li>';
            });
        }
        showOptions(arr)
    }
}

function showList() {
    let arr = [];
    let flag = 0;
    if (countryArr.length > 0) {
        arr = countryArr.map((data) => {
            return data = '<li>' + data + '</li>';
        });
        arr = arr.join('');
    } else {
        arr = "No countries entered"
        flag = 1;
    };
    printList.innerHTML = arr
    countryListColors(flag);
    listWrap.classList.add("display")
    showListBtn.innerHTML = "Hide list"
    showListBtn.addEventListener("click", hideCountryList)
}

function hideCountryList() {
    listWrap.classList.remove("display")
    showListBtn.innerHTML = "Show list"
    showListBtn.removeEventListener("click", hideCountryList)
    showListBtn.addEventListener("click", showList)
}

function alowChoice() {
    let liList = searchContainer.querySelectorAll("li");
    for (i = 0; i < liList.length; i++) {
        liList[i].addEventListener("click", function (event) {
            event.preventDefault();
            let element = event.target;
            let countryName = element.innerHTML;
            fetch(`https://restcountries.com/v2/name/${countryName}`, {
                    method: 'GET'
                })
                .then(res => res.json())
                .then(data => {
                    let flag = data[0].flag
                    return flag
                }).then(flag => {
                    let flagHtml = `<img src="${flag}" alt="country flag">`
                    countryFlag.innerHTML = flagHtml
                })
            chosenCountry.innerHTML = countryName
            searchInput.classList.remove("active");
            inputBox.value = "";
            element.style.color = "red"
        })
    }
}

function getCountryDetails(countryName) {
    fetch(`https://restcountries.com/v2/name/${countryName}`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            let countryDetails = data;
            return countryDetails
        })
}

function countryListColors(flag) {
    if (flag == 0) {
        let liList = printList.querySelectorAll("li");
        for (i = 0; i < liList.length; i++) {
            liList[i].addEventListener("click", changeColor);
        }
    }
}

function changeColor(e) {
    const country = e.target
    country.classList.add("yellow")
    country.removeEventListener("click", changeColor);
    country.addEventListener("click", changeColorBack);
}

function changeColorBack(e) {
    const country = e.target
    country.classList.remove("yellow")
    country.addEventListener("click", changeColor);
    country.removeEventListener("click", changeColorBack);
}

function fixCountryName(name) {
    const countryName = name;
    const words = countryName.split(" ");

    for (let i = 0; i < words.length; i++) {
        if (words[i] != "of" && words[i] != "in" && words[i] != "at") {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
    }

    let fixedName = words.join(" ");
    return fixedName
}

function changeCount(listLength) {

}