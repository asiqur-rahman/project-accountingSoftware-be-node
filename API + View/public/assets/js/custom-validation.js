$('.validate-this-form').on('submit', function () {
    return validateThisForm();
});

const validateThisForm=(hasCallback=false)=>{
    var input = $('.validate-this-form .validate_this');
    var check = true;
    for (var i = 0; i < input.length; i++) {
        const val=$(input[i]).val();
        if (!validate(input[i])) {
            showValidate(input[i]);
            check = false;
        }
    }
    
    if(check && !hasCallback){
        Spinner.Show();
    }
    return check;
}

$('.validate_this').each(function () {
    $(this).on('blur',
        function () {
            if (validate(this)) {
                hideValidate(this);
                $(this).parent().addClass('true-validate');
            } else {
                showValidate(this);
            }
        }
    );
});

$('.validate_this').change(function () {
    if (validate(this)) {
        hideValidate(this);
        $(this).parent().addClass('true-validate');
    } else {
        showValidate(this);
    }
});

function validate(input) {
    if (!$(input).val() || $(input).val()=='' || $(input).val().trim() == '') {
        return false;
    }else{
        return true;
    }
}

function showValidate(input) {
    var thisAlert = $(input).parent();
    $(thisAlert).removeClass('true-validate');
    $(thisAlert).addClass('alert-validate');
}

function hideValidate(input) {
    var thisAlert = $(input).parent();
    $(thisAlert).removeClass('alert-validate');
}
