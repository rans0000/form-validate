/* jshint browser: true */
/*global jQuery: false */

;(function($, window, document, undefined){
    'use strict';

    //------------------------------------------
    //plugin Class starts
    var FormValidate = {

        init: function (elem, options) {
            var selfed = this;
            selfed.formElement = elem;
            selfed.$formElement = $(elem);
            selfed.options = $.extend({}, $.fn.formValidate.options, options);
            selfed.$inputs = selfed.$formElement.find('[' + selfed.options.attributeUsed + ']');
            selfed.formName = selfed.$formElement.attr('name');
            selfed.formErrorList = [];
            selfed.isFormValid = true;
            selfed.isInlineInputsValid = true;
            selfed.appName = 'formValidate';
            selfed.appVersion = '0.1.0';

            selfed.$formElement.data(selfed.appName, selfed);
            selfed.bindEvents();
        },

        bindEvents: function () {
            var selfed = this;

            //bind input events
            selfed.$inputs.on(selfed.options.triggerUsed, function () {
                selfed.validateInput($(this));
            });

            //bind form submit event
            selfed.$formElement.on('submit', function (event) {
                event.preventDefault();
                selfed.validateAllInputs();
            });
        },

        validateAllInputs: function () {
            var selfed = this;
            var $input;
            var selector;
            var isAllInlineTestsPassed = true;

            //validate each input in the form
            selfed.$inputs.each(function (index, input) {
                if( !selfed.validateInput($(input)) ){
                    isAllInlineTestsPassed = false;
                }
            });
            
            selfed.isInlineInputsValid = isAllInlineTestsPassed;

            //find first error input
            $input = selfed.$inputs.filter('.invalid').eq(0);

            //scroll to error if option is enabled
            if(selfed.options.scroll){
                selfed.scrollToElement($input);
            }

            //set focus to error if option is enabled
            if(selfed.options.focusFirstField){
                selfed.setFocusToInput($input);
            }

            //check async validation
            if(selfed.options.asyncURL && selfed.options.asyncPattern){
                selector = '[' + selfed.options.attributeUsed + '="async"]';
                $input = selfed.$formElement.find(selector).eq(0);
                if($input.length){
                    //make the ajax call
                    selfed.validateAsync(selfed.options.asyncURL, $input.val())
                    //.then(selfed.onAsyncValidationSucces, selfed.onAsyncValidationFailure);
                        .then(function (responseData) {
                        selfed.onAsyncValidationSucces(responseData, isAllInlineTestsPassed);
                    }, function (responseData) {
                        selfed.onAsyncValidationFailure(responseData, isAllInlineTestsPassed);
                    });
                }
            }
        },

        validateInput: function ($input) {
            var selfed = this;
            var validationCheckList = $input.attr(selfed.options.attributeUsed).toLowerCase().split(',');
            var validationRules = $.fn.formValidate.validationRules;
            var inputErrorList = [];
            var currentText = $input.val();
            var isAllTestsPassed = true;
            var pattern;
            var result;
            var text;
            var i;
            var j;



            //iterate over all validations for this input
            for(j = validationRules.length - 1; j >= 0; --j){
                pattern = validationRules[j].pattern;
                for(i = validationCheckList.length - 1; i >= 0; --i){
                    if(validationRules[j].name == validationCheckList[i].trim()){

                        //trim the text if option is set
                        text = (validationRules[j].hasOwnProperty('trim') && validationRules[j].trim) ? currentText.trim() : currentText;

                        //accounting for empty inputs
                        result = (text === '' && validationRules[j].name !== 'required') ? true : pattern.test(text);

                        if(result){
                            //test passed
                            selfed.toggleInputValidationClass($input, validationCheckList[i], true, isAllTestsPassed);
                        }
                        else{
                            //test failed
                            isAllTestsPassed = false;
                            selfed.isFormValid = false;
                            selfed.isInlineInputsValid = false;
                            selfed.toggleInputValidationClass($input, validationCheckList[i], false, isAllTestsPassed);
                            inputErrorList.push(validationRules[j].errorMessage);
                        }
                    }
                }
            }

            //updte error messages
            selfed.updateErrorMessages($input, inputErrorList);

            return isAllTestsPassed;
        },

        validateAsync: function (url, subject) {
            var dfd = new $.Deferred();

            //prepare params for post requuest
            url = encodeURI(url);
            subject = encodeURIComponent(subject);
            //this is where an ajax call will fire

            //mocking ajax with settimeout
            window.setTimeout(function () {
                subject = decodeURIComponent(subject);

                //check if subject has atleast a Number, upper & lowercase letter and length is atleast 6
                if( (subject.search(/\d/) !== -1) && (subject.search('[a-z]') !== -1) && (subject.search('[A-Z]') !== -1) && (subject.length > 5) ){
                    //console.log('passed');
                    dfd.resolve(true);
                }
                else{
                    //console.log('failed');
                    dfd.reject(false);
                }
            });
            return dfd.promise();
        },

        onAsyncValidationSucces: function (isAsyncTestPassed, isAllInlineTestsPassed) {
            var selfed = this;
            selfed.isFormValid = isAsyncTestPassed && isAllInlineTestsPassed;
            selfed.toggleFormValidationClass( selfed.isFormValid );
            selfed.$formElement.trigger('formValidate/submit', selfed);
        },

        onAsyncValidationFailure: function (isAsyncTestPassed, isAllInlineTestsPassed) {
            var selfed = this;
            selfed.isFormValid = isAsyncTestPassed && isAllInlineTestsPassed;
            selfed.toggleFormValidationClass( selfed.isFormValid );
        },

        toggleInputValidationClass: function ($input, test, isInputValid, isAllTestsPassed) {

            if(isInputValid){
                //add success class, remove error class
                $input.addClass(test+'-valid').removeClass(test+'-invalid');
            }
            else{
                //add error class, remove success class
                $input.addClass(test+'-invalid').removeClass(test+'-valid');
            }
            $input
                .toggleClass('valid', isAllTestsPassed)
                .toggleClass('invalid', !isAllTestsPassed);
        },

        toggleFormValidationClass: function (isFormValid) {
            var selfed = this;
            selfed.$formElement
                .toggleClass('valid', isFormValid)
                .toggleClass('invalid', !isFormValid);
        },

        updateErrorMessages: function ($input, inputErrorList) {
            var selfed = this;
            var $errorItems = $();
            var errorName;
            var i;

            if(selfed.formName && $input.attr('name')){
                //update inline error message
                errorName = selfed.formName + '.' + $input.attr('name');
                $('[data-formmsg="' + errorName + '"]').text(inputErrorList.join('. '));

                //update form level errors
                selfed.formErrorList[errorName] = inputErrorList;

                for(var item in selfed.formErrorList){
                    if(selfed.formErrorList.hasOwnProperty(item)){
                        //selfed.formErrorList[item];
                        for(i = selfed.formErrorList[item].length - 1; i >= 0; --i){
                            $errorItems = $errorItems.add('<p class="err-item">' + item + ' : ' + selfed.formErrorList[item].join(', ') + '</p>');
                        }
                    }
                }
                $('[data-formmsg="' + selfed.formName + '"]').empty().append($errorItems);
            }
        },

        scrollToElement: function ($element) {
            if($element.length){
                $('body').animate({
                    scrollTop: $element.offset().top - 10
                }, 300);
            }
        },

        setFocusToInput: function ($input) {
            $input.focus();
        }
    };
    //plugin Class ends
    //------------------------------------------

    //attach plugin to jQuery
    $.fn.formValidate = function (options) {
        return this.each(function () {
            var formValidate = Object.create(FormValidate);
            formValidate.init(this, options);
        });
    };

    //plugin-level options
    $.fn.formValidate.options = {
        attributeUsed: 'data-formvalidate',
        triggerUsed: 'blur',
        scroll: true,
        focusFirstField: true,
        hideErrorOnChange: false,
        skipHiddenFields: true,
        asyncPattern: true,
        asyncURL: ''
    };

    //default validation rules
    $.fn.formValidate.validationRules = [
        {
            name: 'number',
            errorMessage: 'Entry must be a Number.',
            pattern: /^[-+]?\d*\.?\d+$/,
            trim: false
        },
        {
            name: 'required',
            errorMessage: 'Entry is mandatory.',
            pattern: /.+/,
            trim: true
        },
        {
            name: 'email',
            errorMessage: 'Entry must be an email.',
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            trim: false
        }
    ];

    //configure custom validation rules
    $.fn.formValidate.addRules = function (configObj) {
        $.fn.formValidate.validationRules.push(configObj);
    };

    $.formValidate = $.fn.formValidate;

    $(document).on('ready', function () {
        //go over all the forms in the page
        //check if they have formValidate
        //if so add this form to the plugin

        $('form')
            .has('[' + $.fn.formValidate.options.attributeUsed + ']')
            .each(function (index, formElement) {
            if(!$(formElement).data('formValidate')){
                $(formElement).formValidate();
            }
        });
    });

})(jQuery, window, document);