const Spinner = {
    Show() {
        $('#status').fadeIn();
        // $('#preloader').delay(100).fadeIn();
        $('#preloader').fadeIn();
    },
    Hide() {
        $('#status').fadeOut();
        $('#preloader').fadeOut();
    }
};

async function loadPartial(url,contentDiv=null,modal=false,method=false,showSpin=true){
    // $("#sidebar-menu mm-active active").removeClass("active");
    if(document.querySelector("#sidebar-menu .mm-active .active"))document.querySelector("#sidebar-menu .mm-active .active").classList.remove("active");
    await $.ajax({
        type: method?method:'GET',
        url: url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('authorization', `bearer ${localStorage.getItem('AcPro_Token')}`);
            if(showSpin)Spinner.Show();
        },
        complete: function () {
            if(showSpin)Spinner.Hide();
        },
        success: function (result,textStatus, xhr) {
            if(xhr.status==302)window.location.replace('/');
            else {
                if(!modal)$(`${contentDiv?contentDiv:".main-container"}`).html(result);
                else{
                    $("#customModalLabel").html(modal[0]);
                    $("#customModalBody").html(result);
                    if(modal[1]) $("#customModal .modal-footer").show(); //show close btn (scb)
                    else $("#customModal .modal-footer").hide();
                    $('#customModal').modal('toggle');
                }
            }
        },
        error: function (request, status, error) {
            window.location.replace('/');
        }
    })
}

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

function confirmationCheck(url, title, msg = "",tableId=false) {
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
            Swal.fire({
                icon: 'success',
                title: 'Changes are done successfully !.'
            })
            // Swal.fire('Changes are not saved', '', 'info')
        } else if (result.isDenied) {
            window.location.href = url;
            // if(tableId)$('#' + tableId).DataTable().ajax.reload();
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
                    if (jsondata.status == true || jsondata.status == 200 ) {
                        // if(method=="DELETE")
                        $('#' + tableId).DataTable().ajax.reload();
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
    });
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