//selectGrid-> Si se selecciona una fila del grid
selectGrid();

function selectGrid() {
    alert(0);
    $("#txtestado").val(2);

    $('#txtid').val(selectedDataItems[0].tar_int_id);
    $('#txtorden').val(selectedDataItems[0].tar_str_orden);
    $('#txtobserv').val(selectedDataItems[0].tar_str_observacion);
    $('#txtdetalle').val(selectedDataItems[0].tar_txt_detalle);

    tag_estado();

    $("input[type='radio']").parent().removeClass("active");
    $("span[type='btnCheck']").remove();
    switch (selectedDataItems[0].tar_int_prioridad) {
        case "1":
            $('#txtprioridad1').toggleClass("active");
            $('#txtprioridad1').prepend('<span type="btnCheck" class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
            break;
        case "2":
            $('#txtprioridad2').toggleClass("active");
            $('#txtprioridad2').prepend('<span type="btnCheck" class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
            break;
        default:
            $('#txtprioridad3').prepend('<span type="btnCheck" class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
            $('#txtprioridad3').toggleClass("active");
    };
    var tar_dat_fchlimite = kendo.toString(kendo.parseDate(selectedDataItems[0].tar_dat_fchlimite, 'dd-MM-yyyy'), 'yyyy-MM-dd');
    $('#txtflimite').val(tar_dat_fchlimite);

    $('#txtestado').val(selectedDataItems[0].tar_int_estado);

    $('#divBtnAdd').hide();
    $('#divBtnAccion').show();

    $('#txtidc, #txtuserid, #txtidtt, #txtorden, #txtobserv, #txtdetalle, #txtflimite').parent().parent().removeClass("has-error");
    $('.k-multiselect-wrap.k-floatwrap').css("border-color", "#ccc");
    $("#divNotaVoz").html("");
    $("#divAudioEstado").show();

    $("#dialog").kendoWindow({
        title: "Confirmación",
        scrollable: false,
        modal: true,
        visible: false
    });
    alert(1);
    getSelectTipoTarea(selectedDataItems[0].tiptar_int_id); // Enviamos el valor de tiptar_int_id para que lo seleccione
    getSelectCliente(selectedDataItems[0].tar_int_id); // Enviamos el valor de id_tarea para que lo seleccione
    alert(2);
}

//getSelectTipoTarea -> datos del select tipo de tarea
function getSelectTipoTarea(accion) {
        $("#txtidtt").kendoDropDownList({
            dataSource: {
                transport: {
                    read: {
                        url: "http://www.ausa.com.pe/appmovil_test01/Tareas/tipoListar",
                        dataType: "json"
                    }
                }
            },
            dataTextField: "tiptar_str_nombre",
            dataValueField: "tiptar_int_id"
        });

        //Si se seleccionó la fila, asignamos el valor del kendoDropDownList con el valor de accion
        // if (accion !== "add") {
        //     var dropdownlist = $("#txtidtt").data("kendoDropDownList");
        //     dropdownlist.value(accion);
        // };
    }
    //getSelectCliente -> datos del select cliente
function getSelectCliente(accion) {
    var idSS = sessionStorage.getItem("sessionUSER");

    if (!$("#txtidc").data("kendoMultiSelect")) {
        $("#txtidc").kendoMultiSelect({
            dataSource: {
                transport: {
                    read: {
                        url: "http://www.ausa.com.pe/appmovil_test01/Clientes/cartera/" + idSS, //305
                        dataType: "json"
                    }
                },
                schema: {
                    model: {
                        id: "ClienteID",
                        fields: {
                            ClienteID: {
                                type: "number"
                            },
                            ClienteRazonSocial: {
                                type: "string"
                            }
                        }
                    }
                } //,
                // Filtro de prueba para desarrollo --- Eliminar en produccion!!!
                /*filter: {
                    field: "ClienteRazonSocial",
                    operator: "startswith",
                    value: "EX"
                }*/

            },
            dataTextField: "ClienteRazonSocial",
            dataValueField: "ClienteID",
            filter: "contains"
        });
    }

    //Si se seleccionó la fila, buscamos la lista de clientes y asignamos el valor del kendoMultiSelect con el valor de accion
    // var values = [];
    // if (accion !== "add") {
    //     var dsTareaCliente = null;
    //     dsTareaCliente = new kendo.data.DataSource({
    //         transport: {
    //             read: {
    //                 url: "http://www.ausa.com.pe/appmovil_test01/Relaciones/clistar",
    //                 dataType: "json",
    //                 type: "post",
    //                 data: {
    //                     txtid: accion
    //                 }
    //             }
    //         }
    //     });

    //     dsTareaCliente.fetch(function () {
    //         var data = dsTareaCliente.data();
    //         for (var i = 0; i < dsTareaCliente.total(); i++) {
    //             var TareaCliente = data[i];
    //             values.push(TareaCliente.cli_int_id);
    //         };
    //         var multiselect = $("#txtidc").data("kendoMultiSelect");
    //         multiselect.value(values);
    //     });
    // }
}

function modalTarea(accion) {
    $("#dialog").data("kendoWindow").center();
    $('#dialog').data('kendoWindow').open();
    switch (accion) {
        case 'insert':
            $("#divMensaje").text("¿Realmente desea agregar la tarea?");
            $("#btnAccionModal").attr("onclick", "accionTarea('insert');");
            break;
        case 'update':
            $("#divMensaje").text("¿Realmente desea editar la tarea?");
            $("#btnAccionModal").attr("onclick", "accionTarea('update');");
            break;
        default:
            $("#divMensaje").text("¿Realmente desea eliminar la tarea?");
            $("#btnAccionModal").attr("onclick", "accionTarea('delete');");
            break;
    }
    $("#btnAccionModal").removeAttr("disabled");
}

//accionTarea -> Función Agregar. Editar y Eliminar Tarea
function accionTarea(accion) {
    $("#btnAccionModal").attr("disabled", "disabled");
    $('#dialog').data('kendoWindow').close();
    var idSS = sessionStorage.getItem("sessionUSER");
    //Notificaciones
    var notificationElement = $("#notification");
    notificationElement.kendoNotification();
    var notificationWidget = notificationElement.data("kendoNotification");
    //end

    var valido = true;
    $('#txtidc, #txtuserid, #txtidtt, #txtobserv, #txtdetalle, #txtflimite').parent().parent().removeClass("has-error");
    $('.k-multiselect-wrap.k-floatwrap').css("border-color", "#ccc");
    var txtidc = $("#txtidc").data("kendoMultiSelect");
    if (txtidc.value() == "") {
        $('#txtidc').parent().parent().addClass("has-error");
        $('.k-multiselect-wrap.k-floatwrap').css("border-width", "1px");
        $('.k-multiselect-wrap.k-floatwrap').css("border-color", "#a94442");
        valido = false;
    }
    if ($('#txtidtt option').size() == 0) {
        $('#txtidtt').parent().parent().addClass("has-error");
        valido = false;
    }
    if ($('#txtobserv').val() == "") {
        $('#txtobserv').parent().parent().addClass("has-error");
        valido = false;
    }
    if ($('#txtflimite').val() == "") {
        $('#txtflimite').parent().parent().addClass("has-error");
        valido = false;
    }

    /*// Eliminar este console log en producción
    console.log(accion);
    console.log("txtid = " + $('#txtid').val());
    console.log("txtidc = " + $('#txtidc').val());
    console.log("txtidtt = " + $('#txtidtt option:selected').val());
    console.log("txtorden = " + $('#txtorden').val());
    console.log("txtobserv = " + $('#txtobserv').val());
    console.log("txtdetalle = " + $('#txtdetalle').val());
    console.log("txtprioridad = " + $('input:radio[name=txtprioridad]:checked').val());
    console.log("txtflimite = " + $('#txtflimite').val() + " 00:00:00");
    console.log("txtestado = " + $('#txtestado').val());
    console.log(valido);*/

    valido && $.ajax({
        type: "POST",
        url: 'http://www.ausa.com.pe/appmovil_test01/Tareas/' + accion,
        data: {
            txtuserid: idSS, //668
            txtid: $('#txtid').val(),
            txtidtt: $('#txtidtt option:selected').val(),
            txtorden: $('#txtorden').val(),
            txtobserv: $('#txtobserv').val(),
            txtdetalle: $('#txtdetalle').val(),
            txtprioridad: $('input:radio[name=txtprioridad]:checked').val(),
            txtestado: $('#txtestado').val(),
            txtflimite: $('#txtflimite').val() + " 00:00:00"
        },
        async: false,
        success: function (datos) {
            var data = [];
            data = JSON.parse(datos);
            var txtidc = $('#txtidc').val();
            if (data[0].Column1 > 0) { //Si devuelve el valor de la tarea agregada
                for (var i = 0; i < $('#txtidc').val().length; i++) {
                    $.ajax({ // INSERT
                        type: "post",
                        url: 'http://www.ausa.com.pe/appmovil_test01/Relaciones/cinsert',
                        data: {
                            txtid: data[0].Column1,
                            txtidc: txtidc[i]
                        },
                        async: false,
                        error: function () {
                            notificationWidget.show("No se puede establecer la conexión al servicio", "error");
                            valido = false;
                        }
                    });
                };
                if (valido) {
                    notificationWidget.show((accion == "insert" ? "Se agregó la nueva tarea: " + $('#txtidtt option:selected').text() : "Se editó la tarea" + $('#txtidtt option:selected').text()), "success");
                    var grid = $("#tareas").data("kendoGrid");
                    grid.dataSource.read();
                    window.location.href = "#tareas1";
                };

            }

            if ($('#txtid').val() > 0) { //Si es edición  o delete
                var dsTareaCliente = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: "http://www.ausa.com.pe/appmovil_test01/Relaciones/clistar",
                            dataType: "json",
                            type: "post",
                            data: {
                                txtid: $('#txtid').val()
                            }
                        }
                    }
                });
                dsTareaCliente.fetch(function () {
                    var data = dsTareaCliente.data();
                    for (var i = 0; i < dsTareaCliente.total(); i++) {
                        var TareaCliente = data[i];
                        $.ajax({ // DELETE
                            type: "POST",
                            url: 'http://www.ausa.com.pe/appmovil_test01/Relaciones/cdelete',
                            data: {
                                txtidt: $('#txtid').val(),
                                txtidc: TareaCliente.cli_int_id
                            },
                            async: false,
                            success: function (datos) {

                            },
                            error: function () {
                                notificationWidget.show("No se puede establecer la conexión al servicio", "error");
                                valido = false;
                            }
                        });
                    };

                    for (var i = 0; i < $('#txtidc').val().length; i++) {
                        $.ajax({ // INSERT
                            type: "POST",
                            url: 'http://www.ausa.com.pe/appmovil_test01/Relaciones/cinsert',
                            data: {
                                txtid: $('#txtid').val(),
                                txtidc: txtidc[i]
                            },
                            async: false,
                            error: function () {
                                notificationWidget.show("No se puede establecer la conexión al servicio", "danger");
                                valido = false;
                            }
                        });
                    };
                });
                if (valido) {
                    notificationWidget.show((accion == "delete" ? "Se eliminó la tarea: " + $('#txtidtt option:selected').text() : "Se guardó la información de: " + $('#txtidtt option:selected').text()), "success");
                    var grid = $("#tareas").data("kendoGrid");
                    grid.dataSource.read();
                    window.location.href = "#tareas1";
                };
            };
        },
        error: function () {
            notificationWidget.show("No se puede establecer la conexión al servicio", "error");
        }
    });
}

//Para mantener active el button-group
$(document).on("change", "input[type='radio']", function () {
    $("input[type='radio']").parent().removeClass("active");
    $(this).parent().toggleClass("active");
    $("span[type='btnCheck']").remove();
    $(this).parent().prepend('<span type="btnCheck" class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
});

function tag_estado() {
    if ($("#txtestado").val() == 2) {
        $("#txtestado").val(1);
        $("#txtestado").removeClass('text-success');
        $("#txtestado").addClass('fa-rotate-180');
        $("#txtestado").addClass('text-muted');
        $("#tag_estado").text('Pendiente');
    } else {
        $("#txtestado").val(2);
        $("#txtestado").removeClass('text-muted');
        $("#txtestado").removeClass('fa-rotate-180');
        $("#txtestado").addClass('text-success');
        $("#tag_estado").text('Cerrado');
    }
};