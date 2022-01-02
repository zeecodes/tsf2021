//autofill the blank log
document.getElementById("log").innerHTML = "Enter patient data in the text field below";

//select the inputs
const input = document.querySelectorAll("input");
const ul = document.querySelector("ul");

//create a local storage key
const KEY = "K2n4-Eq35-ABCD-Xp69-z78b";

//save and load the list
const save = () => localStorage.setItem(KEY, ul.innerHTML);
ul.innerHTML = localStorage.getItem(KEY);

//create an empty object for the patient
let patient = {};

//update the patients current level
const update = (name, level) => {
    patient.name = name;
    patient.level = level;

    if (patient.level > 0.92) {
        patient.status = "Healthy"
    } else if (patient.level > 0.87) {
        patient.status = "Needs Care"
        swal({
            title: "WARNING!",
            text: `${name}'s OXYGEN LEVEL IS LOW! (${patient.level * 100 + "%"})`,
            icon: "warning",
        });
    } else {
        patient.status = "Urgent Care"
        swal({
            title: "WARNING!",
            text: `${name}'s OXYGEN LEVEL VERY IS LOW! (${patient.level * 100 + "%"})`,
            icon: "error",
        });
    }

    // determine the time
    let today = new Date();

    let day = today.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    let month = today.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    let year = today.getFullYear();
    if (year < 10) {
        year = "0" + year;
    }
    let hour = today.getHours();
    if (hour < 10) {
        hour = "0" + hour;
    }
    let minute = today.getMinutes();
    if (minute < 10) {
        minute = "0" + minute;
    }
    let second = today.getSeconds();
    if (second < 10) {
        second = "0" + second;
    }

    var datetime = day + "/" + month
        + "/" + year + " @ "
        + hour + ":"
        + minute + ":" + second;

    patient.time = datetime;

    save();
}

//Add the data and display it on the website
const createLog = (name, level) => {
    update(name, level);
    let block = document.createElement("div");
    block.className = "block";
    block.innerHTML = `<p> Name: ${name} <br> Status: ${patient.status} <br> Oxygen Level: ${level * 100 + "%"} <br> ${patient.time} <br> </p>`;
    document.getElementById("log").innerHTML = "";
    document.getElementById("log").appendChild(block);
}


//use the form to add data quickly 
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();

    //setup a log
    const text = document.querySelector("input[type='text']").value;
    const number = document.querySelector("input[type='number']").value;
    createLog(text, number);

    //add the log
    const newLi = document.createElement("li");
    newLi.innerHTML = text + ": " + patient.level * 100 + "%" + " : " + patient.time + "<br><hr>";

    if (patient.level > 0.92) {
        newLi.style.color = "green";
    } else if (patient.level > 0.87) {
        newLi.style.color = "orange";
    } else {
        newLi.style.color = "red";
    }

    ul.prepend(newLi);

    //save and reset
    text.value = "";
    number.value = "";
    createLog(text, number);
    save();
});


//save the local storage
save();


//save data as file
const saveText = () => {
    let data = ul.innerText;

    const saveTextAsBlob = new Blob([data], { type: 'text/plain' });
    const sFileName = 'patient-data.txt';

    let newLink = document.createElement("a");
    newLink.download = sFileName;

    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(saveTextAsBlob);
    }
    else {
        newLink.href = window.URL.createObjectURL(saveTextAsBlob);
        newLink.style.display = "none";
        document.body.appendChild(newLink);
    }

    newLink.click();
}


//verify if the user wants to reset all the date=a
const resetData = () => {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover the data",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                localStorage.removeItem(KEY);
                ul.innerHTML = "";
                location.reload();
            } else {
                swal("Your data is still safe");
            }
        });
}