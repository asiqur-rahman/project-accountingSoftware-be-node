$('.validate-this-form').on('submit', function (e) {
    e.preventDefault();
    var canSubmitNow=false;
    const validationFor = $(this).attr('validationfor');
    const formData = $(this).serialize();
    const formDataArray = $(this).serializeArray();
    if (validateThisForm() && !validationFor) {
        canSubmitNow=true;
    } else if (validateThisForm() && validationFor == "transaction") {
        var debitAmount = 0;
        var creditAmount = 0;
        for (var i = 0; i < formDataArray.length; i++) {
            if (formDataArray[i].name.includes('[debit]')) {
                const value=formDataArray[i].value;//$(`input[name='transactionDetails[${i}][debit]']`).val();
                debitAmount += parseInt(value?value:0);
            }
            if (formDataArray[i].name.includes('[credit]')) {
                const value=formDataArray[i].value;//$(`input[name='transactionDetails[${i}][credit]']`).val();
                creditAmount += parseInt(value?value:0);
            }
        }
        const mainAmount=formDataArray.filter(x=>x.name=="amount")[0].value;
        if (debitAmount == creditAmount && debitAmount == mainAmount) {
            canSubmitNow=true;
        } 
        else if (debitAmount == creditAmount && debitAmount != mainAmount) {
            Swal.fire({
                icon: 'error',
                title: 'Main Amount and Debit Credit Amount are not the same.'
            })
        } 
        else {
            Swal.fire({
                icon: 'error',
                title: 'Debit and Credit not matched !'
            });
        }
    }
    if(canSubmitNow){
        const loadingArea = $(this).attr('area')? $(this).attr('area'):"areaToShow";
        if ($(this).attr('action')) {
            $.ajax({
                type: 'POST',
                url: $(this).attr('action'),
                data: formData,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('authorization', `bearer ${localStorage.getItem('AcPro_Token')}`);
                    Spinner.Show();
                },
                complete: function () {
                    Spinner.Hide();
                },
                success: function (response) {
                    if(response.token){
                        localStorage.setItem('AcPro_Token', response.token);
                    }
                    debugger;
                    if (response.msg) {
                        toastr[response.msg[0]](response.msg[1]);
                    } 
                    else if (response.redirect){
                         loadPartial(response.redirect,loadingArea);
                    }
                    else if (loadingArea) {
                        $(`.${loadingArea}`).html(response);
                    }

                    else toastr['error']('Something Wrong ! Please try again.');
                }
            });
        } else {
            return false;
        }
    }
});

var submitFormThroughAjax=(url,formData)=>{
    if (url) {
        $.ajax({
            type: 'POST',
            url: url,
            data: formData,
            beforeSend: function () {
                Spinner.Show();
            },
            complete: function () {
                Spinner.Hide();
            },
            success: function (response) {
                if (response.msg) {
                    toastr[response.msg[0]](response.msg[1]);
                    if (response.redirect) loadPartial(response.redirect);
                } else if (loadingArea) $(`.${loadingArea}`).html(response);

                else toastr['error']('Something Wrong ! Please try again.');
            }
        });
    }
    else {
        return false;
    }
}

var validateThisForm = (hasCallback = false) => {
    var input = $('.validate-this-form .validate_this');
    var check = true;
    for (var i = 0; i < input.length; i++) {
        const val = $(input[i]).val();
        if (!validate(input[i])) {
            showValidate(input[i]);
            check = false;
        }
    }

    if (check && !hasCallback) {
        // Spinner.Show();
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
    if (!$(input).val() || $(input).val() == '' || $(input).val().trim() == '') {
        return false;
    } else {
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


$(function () {
    $(".select2").select2();
})