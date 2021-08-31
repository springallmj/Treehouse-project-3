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

//updateCost() takes no arguments and calculates the totalCost off checked items
//Function also dynamically creates the total cost HTML and 
//@return a string containing calculated cost
function updateCost(){
    const registerFieldSet = document.getElementById('activities');
    const courses=registerFieldSet.querySelectorAll("[type='checkbox']");

    let totalCost=0;
    for(let i=0; i<courses.length; i++){
        if(courses[i].checked)
        totalCost+=parseInt(courses[i].getAttribute('data-cost'))
    }
    return `Total: $${totalCost.toString() }`;
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
    //enter key to 'check' focused checkbox
    //filter activities for conflicts
    activities[i].addEventListener('keypress', (e)=>{
        if(e.key=='Enter'){
            event.preventDefault();
            if(event.target.checked==true){
                event.target.checked=false
            }else{
                event.target.checked=true  
            }
            filterActivities(event.target);    
            document.getElementById('activities-cost').innerHTML=updateCost();
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
    //enables/disables boxs where an activitiy time conflict changes.
    activities[i].addEventListener('change', (e)=>{
        document.getElementById('activities-cost').innerHTML=updateCost();
        filterActivities(event.target);    
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
//applies or removes disabled attribute to checkbox where time/day conflicts are found
function filterActivities(check){
    const selectedTime=extractTime(check);
    for(let j=1; j<activities.length; j++){
        if(check!=activities[j]){
            if(timeConflict(selectedTime, extractTime(activities[j]))){
                if(check.checked){
                    activities[j].parentElement.className="disabled";
                    activities[j].setAttribute('disabled', "");
                }else{
                    activities[j].parentElement.className="";
                    activities[j].removeAttribute('disabled');
                }
            }
        }
    }
}

//compares 2 time periods and returns true if they are conflicting (overlapping)
//@param
//selectedTime, testTime == DAY - START HOUR (24hours) - FINISH HOUR (24hours)
function timeConflict(selectedTime, testTime){
    if(selectedTime[0]==testTime[0]){
        //if start time 1 is within start and end time 2
        if(selectedTime[1] >= testTime[1] && selectedTime[1] < testTime[2]){
            return true;
        //else if end time 1 is within start and end time 2
        }else if(selectedTime[2] > testTime[1] && selectedTime[2] <= testTime[2]){
            return true;
        }
    }
    return false;
}

//SUBMIT Form Validation------------------------------------------------------------------------------------
//validation and error handling is broken in to 3 types; text fields, checkbox fileds and select fields.
const form=document.getElementById("registration");
form.addEventListener('submit', (e) => {
    const requiredFields=document.querySelectorAll("[required]");
    for(let i=0; i<requiredFields.length; i++){
        const field=requiredFields[i];
        const testName=field.getAttribute('testName');
        const validator=validators[testName];
        const valid=validator(field.value);
        //text field validation
        //includes credit card number fields ONLY if credit card is selected as payment method
        if((i >= 0 && i <= 1) || (paymentSelect.value == "credit-card" && field.parentElement.parentElement.parentElement.className=="credit-card-box")){
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
        //checkbox field validation
        }else if(testName=="checkBox"){
            const checkBoxFieldSet=document.getElementById('activities');
            //add valid/not-valid styling
            errorCheckbox(valid, checkBoxFieldSet);
            if(!valid){
                event.preventDefault();
            }
            //add listeners to update valid/notvalid styling
            checkBoxFieldSet.addEventListener('change', createChangeListener(errorCheckbox, validator, checkBoxFieldSet));
            checkBoxFieldSet.addEventListener('keypress', createChangeListener(errorCheckbox, validator, checkBoxFieldSet));
        }
    }

    //focuses page to first invlaid field on submit event if fields are invalid.
    for (let i=0; i<requiredFields.length; i++){
        const className=requiredFields[i].className;
        if(/not-valid/.test(className) || /error$/.test(className)){
            if(i==2){
                document.querySelector('[type="checkbox"]').focus();
                break;
            }else{
                requiredFields[i].focus();
                break;
            }
        }
    }
});


//Real Time Error Messaging
//adds listeners to validate card details (card-number, card-exp-date and cvv) in real time IRRESPECTIVE of submit event
const paymentFieldSet=document.getElementById("payment-info");
const paymentTextFields=paymentFieldSet.querySelectorAll('[type="text"]');
for(let i=0; i<paymentTextFields.length; i++){
    paymentTextFields[i].addEventListener('focus', (e) =>{
        const field=event.target;
        const testName=field.getAttribute('testName');
        const validator=validators[testName];
        const valid=validator(field.value);
        event.target.addEventListener("keyup", createTextListener(notValidError, validator, field.parentElement));
        event.target.addEventListener("keyup", createHintListener(hintDisplay));
    });
};


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
        element.className="activities valid";
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
        const courses=document.querySelectorAll("[type='checkbox']");
        for (let i=0; i<courses.length; i++){
            if(courses[i].checked){
                return true;
            }
        }
        return false;
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
