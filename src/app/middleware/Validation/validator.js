var Validator = function(formSelector)
{
    var _this = this;

    var formRules = {};
    // Gan gia tri mac dinh cho tham so
    function getParent(element, selector)
    {
        while(element.parentElement){
            if(element.parentElement.matches(selector))
            {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    
    // Quy uoc tao rules
    // Neu co loi thi return lai
    var validatorRules = {
        required: function(value)
        {
            return value ? undefined : "Please enter this field";
        },
        email: function(value)
        {   
            var regex =/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            return regex.test(value) ? undefined : "Please enter this field";
        },
        min: function(min)
        {
            return function(value)
            {
                return value.length >= min ? undefined : `Please enter ${min} character`;
            }
        }
    };
    // lay ra form element trong Dom theo form-selector
    var formElement = document.querySelector(formSelector);

    // chi su li khi co element trong dom
    if(formElement){
        var inputs = formElement.querySelectorAll('[name][rules]')
       
        for(var input of inputs)
        {

            var  ruleInfo;
            var rules = input.getAttribute('rules').split('|');
            for(var rule of rules){
                var isRuleHasValue = rule.includes(':');
               if(rule.includes(':')){
                    ruleInfo = rule.split(':');
                   rule = ruleInfo[0];
               }
               var ruleFunction = validatorRules[rule];

               if(isRuleHasValue){
                   ruleFunction = ruleFunction(ruleInfo[1])
               }
               if(Array.isArray(formRules[input.name]))
               {
                formRules[input.name].push(ruleFunction);
               }else{ 
                formRules[input.name] = [ruleFunction];
               }

            }  
           
            
            input.onblur = handleValidate;
            input.oninput = handleClearError;

        }
        function handleValidate(event)
        {
            var errorMessage;
            var rules = formRules[event.target.name]; 

            for(var rule of rules)
            {
                errorMessage = rule(event.target.value);
                if(errorMessage) break;
            }
                //  Neu co loi thi hien thi loi ra website
           if(errorMessage){
               
             var formGroup = getParent(event.target, '.form-group')
             
             if(formGroup){
                 var formMessage = formGroup.querySelector('.form-message')
                 if(formMessage)
                 {
                     formMessage.innerText = errorMessage;
                     formGroup.classList.add('invalid')
                 }
                 else{
                    formGroup.classList.remove('invalid')
                 }
             }
           }
           return !errorMessage;
        }
        function handleClearError(event)
        {
            var formGroup = getParent(event.target, '.form-group');
            if(formGroup.classList.contains('invalid')){
                formGroup.classList.remove('invalid');
            }
            var formMessage = formGroup.querySelector('.form-message')
            if(formMessage)
            {
                formMessage.innerText = '';
            }
        }
       
    }
    // Su li hanh vi submit form
    formElement.onsubmit = function(event)
    {
        event.preventDefault();
        var inputs = formElement.querySelectorAll('[name][rules]')
       
        var isValid = true;
        for(var input of inputs)
        {
           if(!handleValidate({ target : input})){
            isValid = false
           }
            
        }
        if(isValid)
        {
            if(typeof _this.onSubmit === ' function')
            {
                var enableInput = formElement.querySelectorAll('[name]:not([disabled])');
                var formValue = Array.from(enableInput).reduce((values, input) => {
                            switch(input.type){
                            case 'radio':
                            
                                values[input.name] = formElement.querySelector('input[name="'+ input.name + '"]:checked').value;
                                
                                break;
                                case 'checkbox':
                                    if(!input.matches(':checked')){
                                    
                                    values[input.name] = '';
                                    return values;
                                    } 

                                    if(!Array.isArray(values[input.name]))
                                    {
                                    values[input.name] = [];
                                    }
                                    values[input.name].push(input.value);
                                break;
                                case 'file':
                                values[input.name] = input.files;
                            default:
                                values[input.name] = input.value;
                            }
                            return values;
                },{})
                _this.onSubmit(formValue);
            }
            else{   
                formElement.submit();
            }

            
        }

    }
}