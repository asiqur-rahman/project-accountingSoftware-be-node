const Spinner = {
    Show() {
        $('#status').fadeIn();
        $('#preloader').delay(300).fadeIn();
    },
    Hide() {
        $('#status').fadeOut();
        $('#preloader').fadeOut();
    }
};


// $(function() {
//     var responseMessage=$("#responseMessage").val();
//     if(responseMessage){
//         responseMessage=JSON.parse(responseMessage);
//         Swal.fire({
//             icon: responseMessage.type,
//             title: responseMessage.message
//         })
//     }
// });

$("a").click(function (e) {
    if ($(this).attr('href') != '#' && $(this).attr('href') != 'javascript: void(0);' && $(this).attr('href') != 'javascript:window.print()' && $(this).attr('target') != "_blank") {
        e.preventDefault();
        Spinner.Show();
        window.location.href = $(this).attr('href');
    } else if ($(this).attr('target') == "_blank") {
        window.open($(this).attr('href'), "_blank");
    }
})

function go_link(url) {
    Spinner.Show();
    window.location.href = url;
}

function deleteConfirmation(url) {
    Swal.fire({
        // position: 'top',
        title: 'Do you want to Delete the record?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Cancel',
        denyButtonText: `Delete`,
    }).then((result) => {
        if (result.isConfirmed) {
            // if(tableId!="")$('#' + tableId).DataTable().ajax.reload();
        } else if (result.isDenied) {
            window.location.href = url;
            // Swal.fire('Changes are not saved', '', 'info')
        }
    })
}

function go_link_new_page(url, host) {
    if (host) {
        window.open(host + url, "_blank");
    } else {
        window.open(url, "_blank");
    }

}

function confirmationCheck(url, title, msg = "") {
    Swal.fire({
        // position: 'top',
        title: title,
        text: msg,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Cancel',
        denyButtonText: `Confirm`,
    }).then((result) => {
        if (result.isConfirmed) {
            // Swal.fire('Changes are not saved', '', 'info')
        } else if (result.isDenied) {
            window.location.href = url;
        }
    })
}

function confirmationCheck_ajax(url, method = 'GET', msg, tableId, showSpin=true) {
    Swal.fire({
        // position: 'top',
        title: msg,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Cancel',
        denyButtonText: `Confirm`,
    }).then(async (result) => {
        if (result.isConfirmed) {
            // Swal.fire('Changes are not saved', '', 'info')
        } else if (result.isDenied) {
            await $.ajax({
                type: method,
                // url: `${window.location.href+url}`,
                url: `${url}`,
                beforeSend: function () {
                    if(showSpin)Spinner.Show();
                },
                complete: function () {
                    if(showSpin)Spinner.Hide();
                },
                success: function (jsondata) {
                    debugger;
                    if (jsondata.status == true) {
                        if(method=="DELETE")$('#' + tableId).DataTable().ajax.reload();
                        Swal.fire({
                            icon: 'success',
                            title: 'Changes are done successfully !.'
                        })

                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Internal Error ! '
                        })
                    }
                },
                error: function (request, status, error) {
                    Spinner.Hide();
                    Swal.fire({
                        icon: 'error',
                        title: 'Internal error !'
                    })
                }
            })
        }
    })
}

async function showResponseInModals(url,method){
    await $.ajax({
        type: method??'GET',
        url: url,
        // beforeSend: function () {
        //     Spinner.Show();
        // },
        // complete: function () {
        //     Spinner.Hide();
        // },
        success: function (result) {
            $('.bs-custom-modal-lg .modal-body').html(result);
            $('.bs-custom-modal-lg').modal('toggle');
        },
        error: function (request, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Internal error !'
            })
        }
    })
    $('.bs-example-modal-lg').modal('toggle');
} 

$('.number_only').keyup(function(e) {
    if(this.value!='-')
      while(isNaN(this.value))
        this.value = this.value.split('').reverse().join('').replace(/[\D]/i,'')
                               .split('').reverse().join('');
})
.on("cut copy paste",function(e){
    e.preventDefault();
});