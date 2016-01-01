// edit delete tipo de tarea
function accionTT(tipo) {
    $('#modalAddTipoTarea').data('kendoMobileModalView').open();
    kendo.fx($("#modalAddTipoTarea")).zoom("in").play(); //Sirve para eliminar el bug del click en la misma posición del btn cancelar, que hace que al seleccionar se cierre inmediatamente el modal
    $("#btnTT").removeAttr("disabled");
    switch (tipo) {
        case "tipoUpdate":
            $('#btnTT').val('tipoUpdate');
            $('#btnTT').html('<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Editar');
            break;
        default:
            $('#btnTT').val('tipoInsert');
            $('#btnTT').html('<span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Agregar');
            $('#txtnombre').val("");
            $('#txtdescripcion').val("");
            $('#txtidTT').val("");
    }
}

function adminTT() {
    var idSS = sessionStorage.getItem("sessionUSER");
    window.location.href = "#vistaTipoTareas";
    $("#administrarTipoTareas").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: "http://www.ausa.com.pe/appmovil_test01/Tareas/tipoListar",
                    dataType: "json",
                    type: "get"
                }
            },
            //schema -> para mantener los filtror y para el formato date
            schema: {
                model: {
                    fields: {
                        tiptar_int_id: {
                            type: "number",
                            width: "15"
                        },
                        tiptar_str_nombre: {
                            type: "string"
                        },
                        tiptar_dat_ultimamodif: {
                            type: "date"
                        }
                    }
                }
            }
        },
        selectable: "row",
        change: function (e) {
            $('#modalAddTipoTarea').data('kendoMobileModalView').open();

            var selectedRows = this.select();
            var selectedDataItems = [];
            for (var i = 0; i < selectedRows.length; i++) {
                var dataItem = this.dataItem(selectedRows[i]);
            }
            //var seleccion = $(".k-state-selected").select();
            var grid = $("#administrarTipoTareas").data("kendoGrid");
            var seleccion = grid.select();

            accionTT('tipoUpdate');
            $('#txtnombre').val(dataItem.tiptar_str_nombre);
            $('#txtdescripcion').val(dataItem.tiptar_str_descripcion);
            $('#txtidTT').val(dataItem.tiptar_int_id);
            //Sólo el usuario creador puede eliminar el tipo de tarea, si no lo es -> btnTT disabled
            if (idSS == dataItem.tiptar_int_usrcreacion) { //668
                $("#btnTT").removeAttr("disabled");
            } else {
                $("#btnTT").attr("disabled", "disabled");
            }
        },
        columns: [{
                //define template column with checkbox and attach click event handler
                title: "Nro",
                width: "55px"
            },
            {
                hidden: true,
                field: "tiptar_int_id",
                title: "ID"
            }, {
                field: "tiptar_str_nombre",
                title: "Tipo de Tareas"
            }, {
                field: "tiptar_dat_ultimamodif",
                title: "Fecha de Creación",
                format: "{0:dd-MM-yyyy}"
            }],
        dataBound: function (e) {
            var rows = e.sender.tbody.children();
            for (var i = 0; i < rows.length; i++) {
                var row = $(rows[i]);
                var cell = row.children().eq(0);
                cell.html(i + 1 + " <input type='checkbox' style='width:16px; height:16px;' id='cb" + i + "'>");
            }
        }
    });

}


//addTipoTarea -> Agregamos un nuevo tipo de tarea
function accionTipoTarea(accion) {
    var idSS = sessionStorage.getItem("sessionUSER");

    var valido = true;

    //Notificaciones 
    var notificationElement = $("#notification");
    notificationElement.kendoNotification();
    var notificationWidget = notificationElement.data("kendoNotification");
    //End

    if (accion == "tipoDelete") {
        var grid = $('#administrarTipoTareas').data('kendoGrid')._data;
        for (var i = 0; i < grid.length; i++) {
            if ($("#cb" + i).is(':checked') && grid[i]["tiptar_int_usrcreacion"] == idSS) { //668
                $.ajax({
                    url: 'http://www.ausa.com.pe/appmovil_test01/Tareas/' + accion,
                    type: "post",
                    data: {
                        txtid: grid[i]["tiptar_int_id"],
                        txtuserid: idSS //668
                    },
                    async: false,
                    success: function (datos) {
                        var data = [];
                        data = JSON.parse(datos);

                        if (data[0].Ejecucion == 0) {
                            notificationWidget.show("Se eliminó el tipo de tarea: " + grid[i]["tiptar_str_nombre"], "success");
                            valido = false;
                        } else {
                            notificationWidget.show("No se pudo eliminar el tipo de tarea: " + grid[i]["tiptar_str_nombre"], "error");
                        }
                    },
                    error: function () {
                        notificationWidget.show("No se puede establecer la conexión al servicio", "error");
                    }
                });
            }
            if ($("#cb" + i).is(':checked') && grid[i]["tiptar_int_usrcreacion"] !== idSS && valido) { //668
                notificationWidget.show("No es creador de: " + i + grid[i]["tiptar_str_nombre"], "error");
            }
            valido = true;
        };
        $("#modalConfirmarDeleteTT").data("kendoMobileModalView").close();
        $('#administrarTipoTareas').data('kendoGrid').dataSource.read();
        $('#administrarTipoTareas').data('kendoGrid').refresh();
        return;
    }
    $('#txtnombre, #txtdescripcion').parent().parent().removeClass("has-error");
    if ($('#txtnombre').val() == "") {
        $('#txtnombre').parent().parent().addClass("has-error");
        valido = false;
    }
    if ($('#txtdescripcion').val() == "") {
        $('#txtdescripcion').parent().parent().addClass("has-error");
        valido = false;
    }
    valido && $.ajax({
        url: 'http://www.ausa.com.pe/appmovil_test01/Tareas/' + accion,
        type: "post",
        data: {
            txtid: $('#txtidTT').val(),
            txtnombre: $('#txtnombre').val(),
            txtdescripcion: $('#txtdescripcion').val(),
            txtuserid: idSS //668
        },
        async: false,
        success: function (datos) {
            var data = [];
            data = JSON.parse(datos);
            if (data[0].Ejecucion == 0) {
                $("#modalAddTipoTarea").data("kendoMobileModalView").close();
                getSelectTipoTarea("add");
                notificationWidget.show((accion == "tipoInsert" ? "Se agregó nuevo tipo de tarea: " : "Se editó el tipo de tarea: ") + $('#txtnombre').val(), "success");

                $('#administrarTipoTareas').data('kendoGrid').dataSource.read();
                $('#administrarTipoTareas').data('kendoGrid').refresh();
            } else {
                notificationWidget.show("No se pudo agregar el tipo de tarea: " + $('#txtnombre').val(), "error");
            }
        },
        error: function () {
            notificationWidget.show("No se puede establecer la conexión al servicio", "error");
        }
    });
}