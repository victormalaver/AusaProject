'use strict';
app.funcionalidad03 = kendo.observable({
    onShow: function () {
        //Carga JavaScript 3st
    },
    afterShow: function () {
        //Carga JavaScript 4st        
    }
});
var selectedDataItems = [];
//getTareas -> cargamos el grid tareas
function getTareas() {
        var idSS2 = sessionStorage.getItem("sessionUSER");
        //dsTareas -> obtenemos la lista de tareas
        var dsTareas = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "http://www.ausa.com.pe/appmovil_test01/Tareas/listar",
                    dataType: "json",
                    type: "post",
                    data: {
                        txtid: idSS2 //668
                    }
                }
            },
            //schema -> para mantener los filtror y para el formato date
            schema: {
                model: {
                    fields: {
                        tar_dat_fchcreacion: {
                            type: "date"
                        },
                        tar_dat_fchlimite: {
                            type: "date"
                        },
                        tar_int_estado: {
                            type: "string"
                        },
                        tar_int_prioridad: {
                            type: "string"
                        }
                    }
                }
            },
            pageSize: 10
        });

        // if (!$("#tareas").data("kendoGrid")) {
        //     document.addEventListener("deviceready", onDeviceReady, false);
        // };
        $("#tareas").kendoGrid({
            dataSource: dsTareas,
            filterable: true,
            sortable: true,
            pageable: true,
            scrollable: false,
            selectable: "row",
            change: function (e) {
                kendo.mobile.application.navigate('components/funcionalidad03/detalle.html');
                var selectedRows = this.select();
                for (var i = 0; i < selectedRows.length; i++) {
                    var dataItem = this.dataItem(selectedRows[i]);
                    selectedDataItems.push(dataItem);
                }
            },
            filterMenuInit: filterMenu, //llamamos a la función de configuración de los filtros
            columns: [{
                    field: "tipotarea",
                    title: "Nombre de Tarea",
                    width: "360px",
                    filterable: {
                        extra: false,
                        operators: {
                            string: {
                                contains: "Contiene",
                                eq: "Es igual a",
                                neq: "No es igual a"
                            }
                        },
                        messages: {
                            info: "Filtrar por tarea: ",
                            filter: "Filtrar",
                            clear: "Limpiar"
                        }
                    }
            },
                {
                    field: "Usuario",
                    title: "Cliente",
                    width: "150px",
                    filterable: {
                        extra: false,
                        operators: {
                            string: {
                                contains: "Contiene",
                                eq: "Es igual a",
                                neq: "No es igual a"
                            }
                        },
                        messages: {
                            info: "Filtrar por cliente: ",
                            filter: "Filtrar",
                            clear: "Limpiar"
                        }
                    }
            },
                {
                    field: "tar_dat_fchcreacion",
                    title: "F. Creación",
                    template: "#= kendo.toString(kendo.parseDate(tar_dat_fchcreacion, 'dd-MM-yyyy'), 'dd/MM/yyyy') #",
                    width: "120px",
                    filterable: {
                        messages: {
                            info: "Rango de creación: ",
                            filter: "Filtrar",
                            clear: "Limpiar"
                        }
                    },
                    format: "{0:dd/MM/yyyy}"
            },
                {
                    field: "tar_dat_fchlimite",
                    title: "F. Límite",
                    template: "#= kendo.toString(kendo.parseDate(tar_dat_fchlimite, 'dd-MM-yyyy'), 'dd/MM/yyyy') #",
                    width: "120px",
                    filterable: {
                        messages: {
                            info: "Rango de límite: ",
                        }
                    },
                    format: "{0:MM/dd/yyyy}"
            },
                {
                    field: "tar_int_estado",
                    title: "Estado",
                    template: '#if(tar_int_estado==1){#Pendiente#}else{#Cerrado#}#',
                    width: "100px",
                    filterable: {
                        extra: false,
                        operators: {
                            string: {
                                contains: "Contiene",
                                eq: "Es igual a",
                                neq: "No es igual a"
                            }
                        },
                        messages: {
                            info: "Filtrar por estado: ",
                            filter: "Filtrar",
                            clear: "Limpiar"
                        }
                    }
            },
                {
                    field: "tar_int_prioridad",
                    title: "Prioridad",
                    template: '#if(tar_int_prioridad==1){#<span class = "glyphicon glyphicon-arrow-down text-success" aria-hidden = "true" ></span>Baja#}else{if(tar_int_prioridad==3){#<span class="glyphicon glyphicon-arrow-up text-danger" aria-hidden="true"></span>Alta#}else{#<span class = "glyphicon glyphicon glyphicon-arrow-right text-warning" aria-hidden="true"></span>Media#}}#',
                    width: "110px",
                    filterable: {
                        extra: false,
                        operators: {
                            string: {
                                contains: "Contiene"
                            }
                        },
                        messages: {
                            info: "Filtrar por prioridad: ",
                            filter: "Filtrar",
                            clear: "Limpiar"
                        }
                    }
            }],
            //dataBound -> para pintar la fila rojo (si es menor 2 dias), naranja (si es menor a 7 dias) y blanco (mayor a 7 dias) 
            dataBound: function (e) {
                var items = this._data;
                var rows = e.sender.tbody.children();
                for (var i = 0; i < rows.length; i++) {
                    var row = $(rows[i]);
                    var f1 = kendo.parseDate(items[i].tar_dat_fchlimite, 'dd-MM-yyyy');
                    var f2 = kendo.parseDate(items[i].tar_dat_fchcreacion, 'dd-MM-yyyy');
                    var diff = new Date(f1 - f2);
                    var days = diff / 1000 / 60 / 60 / 24;
                    if (days < 2) {
                        row.addClass("danger");
                    } else if (days >= 2 && days < 7) {
                        row.addClass("warning");
                    } else {
                        row.addClass("default");
                    }
                }
            }
        });
        //filterMenu -> para configurar los filtros
        function filterMenu(e) {
            if (e.field == "tar_dat_fchlimite") {
                var beginOperator = e.container.find("[data-role=dropdownlist]:eq(0)").data("kendoDropDownList");
                beginOperator.value("gte");
                beginOperator.trigger("change");

                var endOperator = e.container.find("[data-role=dropdownlist]:eq(2)").data("kendoDropDownList");
                endOperator.value("lte");
                endOperator.trigger("change");
                e.container.find(".k-dropdown").hide()
            }
            if (e.field == "tar_dat_fchcreacion") {
                var beginOperator = e.container.find("[data-role=dropdownlist]:eq(0)").data("kendoDropDownList");
                beginOperator.value("gte");
                beginOperator.trigger("change");

                var endOperator = e.container.find("[data-role=dropdownlist]:eq(2)").data("kendoDropDownList");
                endOperator.value("lte");
                endOperator.trigger("change");
                e.container.find(".k-dropdown").hide()
            }
            if (e.field == "tar_int_estado") {
                //e.container.find("k-widget.k-dropdown.k-header").css("display", "none");
                // Change the text field to a dropdownlist in the Role filter menu.
                e.container.find(".k-textbox:first")
                    //.removeClass("k-textbox")
                    .kendoDropDownList({
                        dataSource: new kendo.data.DataSource({
                            data: [
                                {
                                    title: "Pendiente",
                                    value: 1
                            },
                                {
                                    title: "Cerrado",
                                    value: 0
                            }
                                ]
                        }),
                        dataTextField: "title",
                        dataValueField: "value"
                    });
            }
            if (e.field == "tar_int_prioridad") {
                //e.container.find("k-widget.k-dropdown.k-header").css("display", "none");
                // Change the text field to a dropdownlist in the Role filter menu.
                e.container.find(".k-textbox:first")
                    //.removeClass("k-textbox")
                    .kendoDropDownList({
                        dataSource: new kendo.data.DataSource({
                            data: [
                                {
                                    title: "Alta",
                                    value: 3
                            },
                                {
                                    title: "Media",
                                    value: 2
                            },
                                {
                                    title: "Baja",
                                    value: 1
                            }
                                ]
                        }),
                        dataTextField: "title",
                        dataValueField: "value"
                    });
            }

        };
    }
    //viewFormTarea -> función para agregar nueva tarea
function viewFormTarea() {
    window.location.href = "#accionTarea";
    $('#formAdd')[0].reset();
    getSelectTipoTarea("add");
    getSelectCliente("add");
    $('#divBtnAdd').show();
    $('#divBtnAccion').css("display", "none");
    $("#divAudioEstado").css("display", "none");

    $("#dialog").kendoWindow({
        title: "Confirmación",
        scrollable: false,
        modal: true,
        visible: false
    });
    //kendo.ui.progress($("#accionTarea"), false);
}