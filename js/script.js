//initialise focus on name field
const userName = document.getElementById('name');
userName.focus();

//Display 'other job' description ONLY if other job is selected as job roll
const jobRoll=document.getElementById('title');
jobRoll.addEventListener('change', () => {
    const otherJob = document.getElementById('other-job-role');
    if (event.target.value=='other'){
        otherJob.style.display="block";
    }else{
        otherJob.style.display="none";
    }
});


//Display shirt colour ONLE when a shirt style has been selected
//Filters design color options by selected desigen theme
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


//Update Costs
let totalCost;
const registerFieldSet = document.getElementById('activities');
const courses=registerFieldSet.querySelectorAll("[type='checkbox']");
registerFieldSet.addEventListener('change', () => {
    if(event.target.type='checkbox'){
        updateCost();
    }
});


//updateCost() takes no arguments but dynamically calculates the 
//totalCost global variable based off checked items
//Function also dynamically creates the total cost HTML and inserts 
//in to the DOM
function updateCost(){
    const p=document.getElementById('activities-cost');
    totalCost=0;
    for(let i=0; i<courses.length; i++){
        if(courses[i].checked)
        totalCost+=parseInt(courses[i].getAttribute('data-cost'))
    }
    const costHtml=`Total: $${totalCost.toString() }`;
    p.innerHTML=costHtml;
}

//filtering payment method
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



//Form Validation
const submitButton = document.querySelector("[type='submit']");
const userEmail = document.getElementById('email');
const cardNumber = document.getElementById('cc-num');
const zipCode = document.getElementById('user-zip');
const cvv = document.getElementById('user-cvv');
const cardPayment = document.getElementById('credit-card');

// const basicInfo=document.getElementById('basic-info');
// const activities=document.getElementById('activities');
// const paymentInfo=document.getElementById('payment-info');

//Submit validation and error handling
const form=document.getElementById("registration");
form.addEventListener('submit', (e) => {
    const requiredFields=document.querySelectorAll("[required]");
    for(let i=0; i<requiredFields.length; i++){
        const field=requiredFields[i];
        const testName=field.getAttribute('testName');
        const validator=validators[testName];
        const valid=validator(field.value);
        //validation and event listeners for text fields
        if(testName!="checkBox" && testName!="select"){
            if(!valid){
                event.preventDefault();
                notValidError(valid, field.parentElement);
                error(valid, field)
                field.addEventListener("keyup", createTextListener(notValidError, validator, field.parentElement));
                field.addEventListener("keyup", createTextListener(error, validator, field)); 
            }
            else{
                notValidError(valid, field.parentElement);
            }
        //validation for checkbox (exp date, exp month only)
        }else if(testName=="select"){
            if(!valid){
                event.preventDefault();
                error(valid, field)
                field.addEventListener("change", createTextListener(error, validator, field)); 
            }
            else{
                notValidError(valid, field.previousElementChild);
            }
        //validation for checkbox
        }else{
            const checkBoxFieldSet=document.getElementById('activities')
            if(!valid){
                event.preventDefault();
                checkBoxFieldSet.className="activities not-valid"
                checkBoxFieldSet.firstElementChild.nextElementSibling.style.display = "block";
                checkBoxFieldSet.addEventListener('click', createChangeListener(errorCheckbox, validator, checkBoxFieldSet));
                
                // (e) =>{
                //     if(mainCheckbox.checked)
                //     {
                //         checkBoxFieldset.className="activities"
                //         checkBoxFieldset.firstElementChild.nextElementSibling.style.display = "none";
                //     }
                // });
            }
        }
    }
    //focuses page on submit to first invlaid field
    const invalidField=document.querySelectorAll(".not-valid");
    const errorField=document.querySelectorAll(".error");
    if(invalidField){
        invalidField[0].focus();
    }else{
        errorField[0].focus();
    }
});


function createTextListener(testFunc, validator, element){
    return e => {
      const text = e.target.value;
      testFunc(validator(text), element);
    }
}

function createChangeListener(testFunc, validator, element){
    return e => {
        testFunc(validator, element);
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
        element.firstElementChild.nextElementSibling.style.display = "none";
    }else{
        element.className="activities not-valid";
        element.firstElementChild.nextElementSibling.style.display = "block";
    }
}


//Field Validation functions
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
    //this requires additional validation - no leading or trailing spaces - or perhaps reformat it.
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
        const mainCheckBox=document.querySelector('[name="all"]')
        if(!mainCheckBox.checked){
            return false;
        }
        else{
            return true;
        }
    }
};

//dynamic hint alerts for credit card details
if(paymentSelect.value=='credit-card'){
    cardPayment.addEventListener('keyup', createHintListener(hintDisplay));
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
    // show element when valid and hide when !valid
    // if the element argument is the email field, hintDisplay dynamically
    // changes the 'hint' to suit the issue with its value upon validation
    if (valid){
        element.style.display = "none";
    }else{
        element.style.display = "block";
        if(fieldName=="email" && !fieldValue){
            element.innerHTML="You must enter a valid email address"
        }else if(fieldName=="email" && fieldValue){
            element.innerHTML="Email address must be formatted correctly"
        }
    }
}
