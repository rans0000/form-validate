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

            selfed.bindEvents();
        },

        bindEvents: function () {
            var selfed = this;
            selfed.$inputs.on(selfed.options.triggerUsed, function () {
                selfed.startValidation($(this));
            });
        },

        startValidation: function ($input) {
            var selfed = this;
            var validationCheckList = $input.attr(selfed.options.attributeUsed).toLowerCase().split(',');
            var validationRules = $.fn.formValidate.validationRules;
            var currentText = $input.val();
            var pattern;
            var text;
            var i;
            var j;

            //iterate over all validations for this input
            for(j = validationRules.length - 1; j >= 0; --j){
                pattern = validationRules[j].pattern;
                for(i = validationCheckList.length - 1; i >= 0; --i){
                    if(validationRules[j].name == validationCheckList[i]){
                        //trim the text if option is set
                        text = (validationRules[j].hasOwnProperty('trim') && validationRules[j].trim) ? currentText.trim() : currentText;
                        console.log(pattern.test(text));
                    }
                }
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

})(jQuery, window, document);