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
            selfed.$inputs.each(function (index, input) {
                selfed.validateInput($(input));
            });
        },

        validateInput: function ($input) {
            var selfed = this;
            var validationCheckList = $input.attr(selfed.options.attributeUsed).toLowerCase().split(',');
            var validationRules = $.fn.formValidate.validationRules;
            var inputErrorList = [];
            var currentText = $input.val();
            var isAllTestsPassed = true;
            var pattern;
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
                        if(pattern.test(text)){
                            //test passed
                            selfed.updateValidationClass($input, validationCheckList[i], true, isAllTestsPassed);
                        }
                        else{
                            //test failed
                            isAllTestsPassed = false;
                            selfed.updateValidationClass($input, validationCheckList[i], false, isAllTestsPassed);
                            inputErrorList.push(validationRules[j].errorMessage);
                            console.log();
                        }
                    }
                }
            }

            //updte error messages
            selfed.updateErrorMessages($input, inputErrorList);
        },

        updateValidationClass: function ($input, test, isInputValid, isAllTestsPassed) {

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
        asyncUrl: ''
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
            errorMessage: 'Entry mustn\'t be empty',
            pattern: /.+/,
            trim: true
        }
    ];
    
    //configure custom validation rules
    $.fn.formValidate.addRules = function (configObj) {
        $.fn.formValidate.validationRules.push(configObj);
    };

})(jQuery, window, document);