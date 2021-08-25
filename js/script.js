//focus userName field on page load
const userName = document.getElementById('name');
userName.focus();

//Display 'other job' description when 'other job' is selected as job roll
const jobRoll=document.getElementById('title');
jobRoll.addEventListener('change', () => {
    const otherJob = document.getElementById('other-job-role');
    if (event.target.value=='other'){
        otherJob.style.display="block";
    }else{
        otherJob.style.display="none";
    }
});


//Display shirt colour ONLY when a shirt style has been selected
//Filters design color options to display only those that apply to the selected desigen theme
const shirtColorDiv=document.getElementById('shirt-colors');
const colorSelect=document.getElementById('color');
const designSelect=document.getElementById('design');
designSelect.addEventListener('change', () => {
    const shirtSelection=event.target.value;
    if (shirtSelection){
        shirtColorDiv.style.display="block";
        const punsTheme = shirtColorDiv.querySelectorAll("[data-theme='js puns']");
        const heartTheme = shirtColorDiv.querySelectorAll("[data-theme='heart js']");
        if(shirtSelection=="js puns"){  
            colorSelect.selectedIndex='0'
            for(let i=0; i<punsTheme.length; i++){
                punsTheme[i].hidden=false;
            }for(let i=0; i<heartTheme.length; i++){
                heartTheme[i].hidden=true;
            }
        }else if(shirtSelection=="heart js"){
            colorSelect.selectedIndex='0'
            for(let i=0; i<punsTheme.length; i++){
                punsTheme[i].hidden=true;
            }for(let i=0; i<heartTheme.length; i++){
                heartTheme[i].hidden=false;
            }
        }
    }else{
        shirtColorDiv.style.display="none";
    }
});


//Dynamically update registration cost from activities selection------------------------------------------
let totalCost;
const registerFieldSet = document.getElementById('activities');
const courses=registerFieldSet.querySelectorAll("[type='checkbox']");
registerFieldSet.addEventListener('change', () => {
    if(event.target.type='checkbox'){
        document.getElementById('activities-cost').innerHTML=updateCost();
    }
});


//updateCost() takes no arguments but dynamically calculates the 
//totalCost global variable based off checked items
//Function also dynamically creates the total cost HTML and inserts 
//in to the DOM
function updateCost(){
    if (!courses[0].checked){
        return "Total: $0";
    }else{
        
        totalCost=0;
        for(let i=0; i<courses.length; i++){
            if(courses[i].checked)
            totalCost+=parseInt(courses[i].getAttribute('data-cost'))
        }
        return `Total: $${totalCost.toString() }`;
    }
}

//filtering payment method----------------------------------------------------------------------------
//hides payment method details for methods NOT selected
const paymentSelect=document.getElementById('payment');
const paymentMethods=document.querySelectorAll("[name='payment-type']");
paymentSelect.addEventListener('change', (e) => {   
    for(let i=0; i<paymentMethods.length; i++){
        if (event.target.value==paymentMethods[i].id){
            paymentMethods[i].style.display="block";
        }else{
            paymentMethods[i].style.display="none";
        }
    }   
});

//ACTIVITIES LISTENERS ---------------------------------------------------------------
const activities=document.querySelectorAll('[type="checkbox"]');



for(let i=0; i<activities.length; i++){
    //add's enter key listener to use the enter key to 'check' focused checkbox
    activities[i].addEventListener('keypress', (e)=>{
        if(e.key=='Enter')
        {
            event.preventDefault();
            if(event.target.checked==true){
                event.target.checked=false
            }else{
                event.target.checked=true
            }
        }
    });
    //adds focus styling to 'box' when checkbos is in focus
    activities[i].addEventListener('focus', (e) =>{
        event.target.parentElement.className="focus";
    });
    //removes focus styling to 'box' when focus is removed
    activities[i].addEventListener('blur', (e) =>{
        event.target.parentElement.className="";
    });
    //disables boxs where an activitiy time conflict exists.
    //enables boxs upon de-selection of the checkbox which triggered the conflict styling.
    activities[i].addEventListener('change', (e)=>{
        const check=event.target;
        if(check==activities[0]){
            disableAllActivities(check)
        }else{
            filterActivities(check);
        }
    });
}

//Converts data-day-and-time attribute to an Array of "day", "start time" and "end time" in 24 hour time.
function extractTime(activity){
    let time=activity.getAttribute('data-day-and-time');

    time=time.replace("-", " ");
    time=time.split(" ");
    for(let j=0; j<time.length; j++){
        if(time[j].includes("pm")){
            time[j]=parseInt(time[j].replace("pm", ""));
            if(time[j]!=12){
                time[j]=time[j]+12; 
            }
        }else if(time[j].includes("am")){
            time[j]=parseInt(time[j].replace("am", ""));
            if(time[j]==12){
                time[j]=0
            }
        }

    }
    return time;
}


//compares converted data-day-and-time array.
//applies or removes disabled attribute where time/day conflicts are found
function filterActivities(check){
    const selectedTime=extractTime(check);
    if(check.checked){
        for(let j=1; j<activities.length; j++){
            const testTime=extractTime(activities[j]);
            if(check!=activities[j] && selectedTime[0]==testTime[0] && ((selectedTime[1] >= testTime[1] && selectedTime[1] < testTime[2]) || (selectedTime[2] > testTime[1] && selectedTime[2] <= testTime[2]))){
                activities[j].parentElement.className="disabled";
                activities[j].setAttribute('disabled', "");
            }
        }
    }else if(!check.checked){
        for(let j=1; j<activities.length; j++){
            const testTime=extractTime(activities[j]);
            if(check!=activities[j] && selectedTime[1] >= testTime[1] && selectedTime[1] < testTime[2] || selectedTime[2] > testTime[1] && selectedTime[2] <= testTime[2]){
                activities[j].parentElement.className="";
                activities[j].removeAttribute('disabled');
            }
        }
    }
}

//Function disables or enables all checkboxes (activities) except the first activity (Main Conference)
//when Main Conference (activity[0]) is toggled
function disableAllActivities(check){
    for(let j=1; j<activities.length; j++){
        if(!check.checked){
            activities[j].parentElement.className="disabled";
            activities[j].setAttribute('disabled', "");
        }else{
            activities[j].parentElement.className="";
            activities[j].removeAttribute('disabled');
        }
    }
    if(check.checked){
        for(let i=1; i<activities.length; i++){
            if(activities[i].checked){
                //re applies previous conflict styling prior to main conference being 'de-selected'
                //user cannot register for conflicting activites
                filterActivities(activities[i]);
            }
        }
    }
}




//SUBMIT Form Validation------------------------------------------------------------------------------------
const submitButton = document.querySelector("[type='submit']");
const userEmail = document.getElementById('email');
const payment = document.getElementById('payment');
const cardNumber = document.getElementById('cc-num');
const zipCode = document.getElementById('user-zip');
const cvv = document.getElementById('user-cvv');
const cardPayment = document.getElementById('credit-card');

//validation and error handling
const form=document.getElementById("registration");
form.addEventListener('submit', (e) => {
    const requiredFields=document.querySelectorAll("[required]");
    for(let i=0; i<requiredFields.length; i++){
        const field=requiredFields[i];
        const testName=field.getAttribute('testName');
        const validator=validators[testName];
        const valid=validator(field.value);

        //text field validation
        if((i >= 0 && i <= 1) || (payment.value == "credit-card" && field.parentElement.parentElement.parentElement.className=="credit-card-box")){
            if(!valid){
                event.preventDefault();
                //add error styling/not-valid
                notValidError(valid, field.parentElement);
                error(valid, field);
                //display hints
                hintDisplay(valid, field.nextElementSibling, testName, field.value);
                //dynamically update hints as well as error styling
                field.addEventListener("keyup", createTextListener(notValidError, validator, field.parentElement));
                field.addEventListener("keyup", createTextListener(error, validator, field)); 
                field.addEventListener('keyup', createHintListener(hintDisplay));
            }
            else{
                notValidError(valid, field.parentElement);
            }
        //select field validation
        }else if(payment.value == "credit-card" && testName=="select"){
            if(!valid){
                event.preventDefault();
                error(valid, field);
                field.addEventListener("change", createTextListener(error, validator, field)); 
            }
            else{
                notValidError(valid, field);
            }
        //checkbox field validation
        }else if(testName=="checkBox"){
            const checkBoxFieldSet=document.getElementById('activities');
            if(!valid){
                event.preventDefault();
                checkBoxFieldSet.className="activities not-valid";
                checkBoxFieldSet.lastElementChild.style.display = "block";
            }
            checkBoxFieldSet.addEventListener('change', createChangeListener(errorCheckbox, validator, checkBoxFieldSet));
            checkBoxFieldSet.addEventListener('keypress', createChangeListener(errorCheckbox, validator, checkBoxFieldSet));
        }
    }

    //focuses page to first invlaid field
    for (let i=0; i<requiredFields.length; i++){
        const className=requiredFields[i].className;

        if(/not-valid/.test(className) || /error$/.test(className)){
                requiredFields[i].focus();
                break;
        }
    }
});


//Listener functions and error/not-valid styling functions
function createTextListener(testFunc, validator, element){
    return e => {
      const text = e.target.value;
      testFunc(validator(text), element);
    }
}

function createChangeListener(testFunc, validator, element){
    return e => {
        testFunc(validator(), element);
    }
}

function notValidError(valid, element){
    if(valid){
        element.className="valid";
    }else{
        element.className="not-valid";
    }
}

function error(valid, element){
    if(valid){
        element.className="";
    }else{
        element.className="error";
    }
}

function errorCheckbox(valid, element){
    if(valid){
        element.className="activities";
        element.lastElementChild.style.display = "none";
    }else{
        element.className="activities not-valid";
        element.lastElementChild.style.display = "block";
    }
}


//individual field Validation functions for 'required' fields
const validators = {
    cardNumber: function (number){
        return /^[\d]{13,16}$/.test(number);
    },
    cvv: function (cvv){
        return /^[\d]{3}$/.test(cvv);
    },
    zipCode: function (zip){
        return /^[\d]{5}$/.test(zip);
    },
    email: function (email){
        return /^[^@ ]+@+[^@. ]+.com$/i.test(email);
    },
    emailHint: function (email){

    },
    //this would benefit from additional validation - no leading or trailing spaces - or perhaps reformat it.
    name: function (text){
        if (text)
            return true;
        else
            return false;
    },
    select: function(selection){
        if (selection!='Select Date' && selection!='Select Year')
            return true;
        else
            return false;
    },
    checkBox: function(){
        if(!document.querySelector('[name="all"]').checked){
            return false;
        }
        else{
            return true;
        }
    }
};

function createHintListener(display) {
    return (e) => {
        const field = event.target
        const fieldName=field.getAttribute('testName');
        const fieldValue=event.target.value;
        const element = field.nextElementSibling;
        const valid = validators[fieldName](fieldValue);
        display(valid, element, fieldName, fieldValue);
    }
};

function createErrorListener(){
    return (e) => {
        const field = event.target
        const fieldName=field.getAttribute('testName');
        const fieldValue=event.target.value;
        const valid = validators[fieldName](fieldValue);
        notValidError(valid, field, fieldName);
    }
};


function hintDisplay(valid, element, fieldName, fieldValue){
    // show element when !valid and hide when valid
    // hintDisplay function also dynamically sets the hint content
    if (valid){
        element.style.display = "none";
    }else{
        element.style.display = "block";
    }

    //Set hints for differing validation cases
    if(fieldName=="zipCode"){
        if(!fieldValue){
            element.innerHTML="You must enter a Zip code";
        }else if(/[\D]+/.test(fieldValue)){
            element.innerHTML="Zip code must be digits only";
        }else{      
            element.innerHTML="Zip code must be 5 digits";
        }
    }
    if(fieldName=="cvv"){
        if(!fieldValue){
            element.innerHTML="You must enter a cvv number";
        }else if(/[\D]+/.test(fieldValue)){
            element.innerHTML="cvv must be digits only";
        }else{      
            element.innerHTML="cvv must be 3 digits";
        }
    }
    if(fieldName=="cardNumber"){
        if(!fieldValue){
            element.innerHTML="You must enter a card number";
        }else if(/[\D]+/.test(fieldValue)){
            element.innerHTML="Card number must be digits only";
        }else{      
            element.innerHTML="Card number must be 13-16 digits";
        }
    }
    if(fieldName=="email"){
        if(!fieldValue){
            element.innerHTML="You must enter a valid email address";
        }else{
            element.innerHTML="Email address must be formatted correctly";
        }
    }
}
