function GetAUTH(){
    return btoa("BrainTechSolution" + ":" + `${Date.now().toString().substring(0,10)}`);
}

function face_verification_start(employeeCode) {
    $.ajax({
        type: 'GET',
        url: "http://localhost:3333",
        beforeSend: function () {
            Spinner.Show();
            $(".face_btn").hide();
        },
        success: function (jsondata) {
            if (jsondata.status == "true") {
                $.ajax({
                    type: 'POST',
                    url: "http://localhost:3333/register/" + employeeCode,
                    headers: {
                        "Authorization": "Basic " + GetAUTH()
                    },
                    success: function (jsondata) {
                        if (jsondata.status == "true") {
                            $.ajax({
                                type: 'post',
                                xhrFields: { withCredentials: true },
                                url: "/portal-employee-face-verification/" + employeeCode,
                                complete: function () {
                                    Spinner.Hide();
                                    $(".face_btn").show();
                                },
                                success: function (jsondata) {
                                    $(".face_btn").show();
                                    if (jsondata.status == 200) {
                                        window.location.href = jsondata.url;
                                    }
                                },
                                error: function (request, status, error) {
                                    Spinner.Hide();
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Face Recognition microservice error !'
                                    })
                                }
                            })
                        } else {
                            Spinner.Hide();
                            $(".face_btn").show();
                            Swal.fire({
                                icon: 'error',
                                title: 'Face Not Registered !',
                                text: typeof jsondata.message=="undefined" ? "Face Registration Failed !":jsondata.message
                            })
                        }
                    }
                })
            } else {
                Spinner.Hide();
                $(".face_btn").show();
                Swal.fire({
                    icon: 'error',
                    title: 'Face Recognition microservice not found !'
                })
            }
        },
        error: function (request, status, error) {
            Spinner.Hide();
            Swal.fire({
                icon: 'error',
                title: 'Face Recognition microservice not found !'
            })
        }
    })
};

function face_recognize_start(employeeCode, confidence = 65) {
    $.ajax({
        type: 'GET',
        url: "http://localhost:3333",
        beforeSend: function () {
            Spinner.Show();
            $(".face_btn").hide();
        },
        success: function (jsondata) {
            if (jsondata.status == "true") {
                $.ajax({
                    type: 'POST',
                    url: "http://localhost:3333/recognize/" + confidence,
                    headers: {
                        "Authorization": "Basic " + GetAUTH()
                    },
                    complete: function () {
                        Spinner.Hide();
                        $(".face_btn").show();
                    },
                    success: function (jsondata) {
                        if (jsondata.id == employeeCode) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Congrats.',
                                text: "Person Matched! " + jsondata.id,
                            })
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Recognition Failed !',
                                text: typeof jsondata.message=="undefined" ? "Person Not Matched!":jsondata.message
                            })
                        }
                    }
                })
            } else {
                Spinner.Hide();
                Swal.fire({
                    icon: 'error',
                    title: 'Recognition Failed !',
                    text: typeof jsondata.message=="undefined" ? "Microservice error !":jsondata.message
                })
            }
        },
        error: function (request, status, error) {
            Spinner.Hide();
            $(".face_btn").show();
            Swal.fire({
                icon: 'error',
                title: 'Face Recognition microservice not found !'
            })
        }
    })

};

async function employee_attendance(employeeCode, attendanceFor, confidence) {
    await $.ajax({
        type: 'GET',
        url: "http://localhost:3333",
        beforeSend: function () {
            Spinner.Show();
            $(".face_btn").hide();
        },
        success: async function (jsondata) {
            if (jsondata.status == "true") {
                await $.ajax({
                    type: 'POST',
                    url: "http://localhost:3333/recognize/" + confidence,
                    headers: {
                        "Authorization": "Basic " + GetAUTH()
                    },
                    success: async function (jsondata) {
                        if (jsondata.confidence >= confidence) {
                            await $.ajax({
                                type: 'post',
                                xhrFields: { withCredentials: true },
                                url: "/portal-employee-attendance/" + employeeCode + "&" + attendanceFor,
                                // complete: function () {
                                    
                                // },
                                success: function (jsondata) {
                                    if (jsondata.status == 200) {
                                        Spinner.Hide();
                                        $(".face_btn").show();
                                        window.location.href = "/portal-attendance-entry";
                                    }else{
                                        Spinner.Hide();
                                        $(".face_btn").show();
                                    }
                                },
                            })
                        } else {
                            Spinner.Hide();
                            $(".face_btn").show();
                            Swal.fire({
                                icon: 'error',
                                title: 'Attedance Error ! '
                            })
                        }
                    }
                })
            } else {
                Spinner.Hide();
                $(".face_btn").show();
                Swal.fire({
                    icon: 'error',
                    title: 'Error !',
                    text: typeof jsondata.message=="undefined" ? "Microservice error !":jsondata.message
                })
            }
        },
        error: function (request, status, error) {
            Spinner.Hide();
            Swal.fire({
                icon: 'error',
                title: 'Face Recognition microservice not found !'
            })
        }
    })
};

async function employee_attendance_manual(employeeCode, attendanceFor, confidence) {
    
    await $.ajax({
        type: 'post',
        xhrFields: { withCredentials: true },
        url: "/portal-employee-attendance/" + employeeCode + "&" + attendanceFor,
        beforeSend: function () {
            Spinner.Show();
            $(".face_btn").hide();
        },
        success: function (jsondata) {
            if (jsondata.status == 200) {
                // Spinner.Hide();
                // $(".face_btn").show();
                window.location.href = "/portal-attendance-entry";
            }else{
                Spinner.Hide();
                $(".face_btn").show();
            }
        },
    })
                        
};


async function trainEmployeeFaces() {
    await $.ajax({
        type: 'GET',
        url: "http://localhost:3333",
        beforeSend: function () {
            Spinner.Show();
        },
        success: function (jsondata) {
            if (jsondata.status == "true") {
                $.ajax({
                    type: 'POST',
                    url: "http://localhost:3333/train",
                    headers: {
                        "Authorization": "Basic " + GetAUTH()
                    },
                    success: function (jsondata) {
                        if (jsondata.status == "true") {
                            Swal.fire({
                                icon: 'success',
                                title: 'Faces trained successfully',
                                text: "Now you can recognize your registered face."
                            })
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Faces Not trained !',
                                text: typeof jsondata.message=="undefined" ? "Face model training failed !":jsondata.message
                            })
                        }
                    },
                    complete: function () {
                        Spinner.Hide();
                        $(".face_btn").show();
                    },
                    error: function (request, status, error) {
                        Spinner.Hide();
                        Swal.fire({
                            icon: 'error',
                            title: 'Faces Not trained !',
                        })
                    }
                })
            } else {
                Spinner.Hide();
                Swal.fire({
                    icon: 'error',
                    title: 'Error !',
                    text: typeof jsondata.message=="undefined" ? "Microservice error !":jsondata.message
                })
            }
        },
        error: function (request, status, error) {
            Spinner.Hide();
            Swal.fire({
                icon: 'error',
                title: 'Face Recognition microservice not found !'
            })
        }
    })
};

async function deleteEmployeeFaces(url, employeeCode) {
    await $.ajax({
        type: 'GET',
        url: "http://localhost:3333",
        beforeSend: function () {
            Spinner.Show();
        },
        success: function (jsondata) {
            if (jsondata.status == "true") {
                $.ajax({
                    type: 'POST',
                    url: "http://localhost:3333/delete/" + employeeCode,
                    headers: {
                        "Authorization": "Basic " + GetAUTH()
                    },
                    success: function (jsondata) {
                        if (jsondata.status == "true") {
                            window.location.href = url;
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Face not deleted'
                            })
                        }
                    },
                    error: function (request, status, error) {
                        Spinner.Hide();
                        Swal.fire({
                            icon: 'error',
                            title: 'Faces Not Deleted ! ',
                            text: typeof jsondata.message=="undefined" ? "Face Deletion Failed !":jsondata.message
                        })
                    }
                })
            } else {
                Spinner.Hide();
                Swal.fire({
                    icon: 'error',
                    title: 'Error !',
                    text: typeof jsondata.message=="undefined" ? "Microservice error !":jsondata.message
                })
            }
        },
        error: function (request, status, error) {
            Spinner.Hide();
            Swal.fire({
                icon: 'error',
                title: 'Face Recognition microservice not found !'
            })
        }
    })
};