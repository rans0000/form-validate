#formValidator.js

**formValidator.js** is an experimental jQuery plugin for validating forms.
**features**
* Add classes to inputs and the form for valid and invalid states.
* Generate error messages.
* Accepts custom validation rules
* Live validation.
* Fetch pattern from async call.
* Configurable

##Usage
Include form-validate.js file. formValidator.js will watch all forms with an inputs with a data attribute **'data-formvalidate'**.
Only inputs with said attribute is validated by the plugin. Other inputs in the form are left untouched.

Initializing with html5 data attribute. The input will validate for *number*
```
<input type="text" data-formvalidate="number">
```

Initializing with javascript
```javascript
$('form').formValidate();
```

##Options
###Validation types:
Currently 3 types are supported
* required
* number
* email
```
<input type="text" data-formvalidate="number">
<input type="text" data-formvalidate="email">
<input type="text" data-formvalidate="required, email">
```
*multiple rules can be added by giving a comma separated string*

###Adding Custom rules:
Use addRules() method to add user defined rules by passing custom configuration object.
Custom rules are shared among all formValidator instances.
```javascript
$.formValidate.addRules({
    name: 'integer',                                //name to be used in data-formvalidate attribute.
    errorMessage: 'Entry must be an Integer',       //error message triggered when state is invalid.
    pattern: /^[+-]?\d$/i,                          //RegExp pattern to validate against
    trim: false                                     //should leading and trailing space be removed when processing
});
```
###Configuring Validator:
Configure individual formValidator instances by passing a configuration object.
```javascript
$('form').formValidate({
    attributeUsed: 'data-formvalidate',             //use a different attribute to track validation.
    triggerUsed: 'blur',                            //any input related event to trigger validation (ex: keyup).
    scroll: true,                                   //scroll to the first invalid input when form is submitted.
    focusFirstField: true,                          //focus first invalid input when form is submitted.
    asyncURL: '',                                   //The server URL for fetching the pattern from the server.
    asyncPattern: true                              //Whether to use async pattern fetched from asyncURL for validation.
});
```

##Error messages & Styling
To display error messages, both the form and input need the 'name' attribute.
Error messages will be updated to any element that has attribute 'data-formmsg'.
To display form level errors use the form's name as the value of data-formmsg.
Input level errors, data-formmsg shoul contail a value of *'form name'* and *'input name'* concatenated with a dot (*);
```
<form name="myForm">
    <input type="text" data-formvalidate="number" name="age">
    <span data-formmsg="myForm.age">Input's errors will be displayed here.</span>
</form>
<div data-formmsg="myForm">
    Form level errors will be displayed here.
</div>
```
###Styling (CSS Classess):
formValidate.js dosen't add any CSS rules. Instead, it adds classes *'valid'* and *'invalid'* to input elements when validation is triggered.
It also adds classes related to validation types, ex: 'required' type will trigger 'required-invalid' & 'required-valid' classes for corresponding states.
Form element has *'valid'* and *'invalid'* classes updated on submit event.

demo: http://iamrans.com/experiments/form-validate/