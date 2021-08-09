//initialise focus on name field
const nameField = document.getElementById('name');
nameField.focus();

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


const form=document.getElementById("registration");
form.addEventListener('submit', (e) => {
    event.pereventDefault();
    isValidEmail(userEmail);
});


//Field Validation functions
function isValidName (text){
    if (text)
        return true;
    else
        return false;
}

function isValidEmail (email){
    return /^[^@]+@+[^@.]+.com$/i.test(email);
}

const cardFieldsTest = {
    cardNumber: function (number){
        return /^[\d]{13,16}$/.test(number);
    },
    cvv: function (cvv){
        return /^[\d]{3}$/.test(cvv);
    },
    zipCode: function (zip){
        return /^[\d]{5}$/.test(zip);
    }
};

if(paymentSelect.value=='credit-card'){
    cardPayment.addEventListener('keyup', (e) =>{
        const field = event.target.getAttribute('testName');
        const fieldValue=event.target.value;
        console.log(cardFieldsTest[field](fieldValue));
    });
    
}

//Validation
// submitButton.addEventListener('click', (e) => {
//     event.pereventDefault();
// });