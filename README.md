This is my TREEHOUSE PROJECT 3; INTERACTIVE FORM.
Completed for Submission 26/08/2021

Project authored by Matthew Springall.

This page dynamically updates and validates a form in the browser.

Please grade this project for 'EXCEEDS EXPECTATIONS' ONLY

-----------------
PROJECT FEATURES;

VALIDATION;
Each 'required' field is validated to the briefed specification.
At submit event, invalid entries will result in prevention of the submit behaviour and invalid/error styling applied to the invalid field(s). Additionally Valid styling is applied to valid required fields at submit.

At submit event, event listeners are also applied to each requried field for both styling and hint messages. Should a field become valid, it's styling changes to valis dynamically and should it be changed to an invalid entry its styling becomes invalid.

Hints are applied to invalid fields on submit. Post submit, the following field's hint messages then update dynamically depending on their content;
    Email,
    Credit Card Number,
    Credit Card CVV,
    Credit Card ZIP

Any other required field hints are static in content.

N.B.
As per brief requirement, all card text field (number, zip and cvv) hints have been applied in real time as the user enters their data (pre or post submit event).
The appropriate listeners are applied when the individual field comes in to focus and updates on the 'keyup' event - i.e. will only appear after first key stroke in the specific field.
    conditional messages and priority;
        1) Field is blank; "You must enter a ____ "
        2) field contains something other than digits; "______ must be digits only"
        3) field contains digits only but is not the correct length; "___ must be ____ digits"

Listeners are therefore doubled up as they are applied again at validation. This has been left in code but depending on 'client' requirement, would easily be refactored out to simplify the validation sequence.

--------------------
Additional features;

ACTIVITES;
All activities are disabled until Main Confrence is selected. If Main conference is deselected, activites become disabled again and total cost reverts to 0.
On third toggle of Main Conference (selecting for the second time), if any additional activities where previously selected at time of Main Conference deselect, the conflict styling remains applied (you cannot register for conflicting events in this scenario).

In Summary; Submit cannot occur without one activity being selected however it is not possible to select an activity other than main conference if no other activity is selected. It is therefore also not possible to submit without main conference being selected.

ENTER KEY-ACTIVITIES;
Enter key will check/un-check a checkbox when in focus.
Registration form can be completed with keyboard only - benefiting screen reader/visually impaired.

CARD VALIDATION;
Exp Month and CVV prevent submit if no selection is made and error styling is applied. 
Not 'briefed' as required, can be removed from code but depending on the payment client, these fields are often required to process.

SUBMIT-NOT-VALID Re-Focus
If a submission is prevented due to validation, the page focuses to the top most invalid field.

----------------------------------------
Notes For Potential Further Discussion/Development;

No validation on T-shirt selection.
Client may desire a selection, a default option or backend logic to interpret no design selection as no T-shirt with registration (a size is currently selected, front end validation could be applied if size selected but no style = disregard shirt)

No requirement for 'Other Job' field to have an entry if 'Other' is selected as Job Roll.

Some basic validation and requirements of the Name Field might be considered.
