'use strict';
app.funcionalidad04 = kendo.observable({
    onShow: function () {

    },
    afterShow: function () {

    },
});

// Para la primera carga usa la fecha actual
var f04DateAtencionConsilidato = new Date();

function f04FechaAtencionConsilidato() {
    $("#f04FchAtencionConsilidato").kendoDatePicker({
        culture: "es-PE",
        value: f04DateAtencionConsilidato,
        change: function () {            
            var valueDate = this.value();
            var day = valueDate.getDate();
            // numero desde 0 hasta 11 que representa los meses desde enero hasta diciembre
            var month = valueDate.getMonth() + 1;
            var year = valueDate.getFullYear();
            var strValueDate = year+"/"+month+"/"+day;
            console.log("DFC 1 >>> >>> f04FchAtencionConsilidato __CHANGE__: " + strValueDate);
            f04getOperaciones(strValueDate);
            // guardar el valor de la ultima fecha selecionada
            f04DateAtencionConsilidato = new Date(year, month -1, day);            
        }
    });
    console.log("DFC 2 >>> f04FchAtencionConsilidato __NO__ CHANGE: " + $("#f04FchAtencionConsilidato").val());
    getDespachador();    
    var strDateSplit = $("#f04FchAtencionConsilidato").val().split("/");
    f04getOperaciones(strDateSplit[2]+"/"+strDateSplit[1]+"/"+strDateSplit[0]);
}

//getOperaciones -> cargamos el grid tareas
function f04getOperaciones(f04FchAtencionConsilidato) {
    console.log("DFC >>> param fx " + f04FchAtencionConsilidato);

    var idSS = sessionStorage.getItem("sessionUSER");
    
    $("#f04operaciones").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    // http://54.213.238.161/wsAusa//Operaciones/Listar
                    // http://www.ausa.com.pe/appmovil_test01/Operaciones/Listar
                    url: "http://www.ausa.com.pe/appmovil_test01/Operaciones/Listar",
                    dataType: "json",
                    type: "post",
                    data: {
                        txtdespachador: idSS,
                        txtcliente: 0,
                        txtorden: 0,
                        txtalmacen: 0,
                        txtestado: 9,
                        txtfecha: f04FchAtencionConsilidato, //"2015/09/24", //f04FchAtencionConsilidato,
                    },
                }
            },
            error: function (e) {
                // handle error
                console.log("Status: " + e.status + "; Error message: " + e.errorThrown);
            },
            schema: {
                model: {
                    fields: {
                        FechaCreacionOperacion: {
                            type: "date"
                        }
                    }
                }
            },
            pageSize: 10,
            requestStart: function(e) {
                kendo.ui.progress($("#homeView"), true);
				/*
                * !!!NO FUNCIONA CON LLAMADA AJAX DUPLICADAS!!!
                	setTimeout(function () {
                    	kendo.ui.progress($("#homeView"), false);
                    	alert("El Servicio no esta Disponible.");
                    }, 10000);
                */
            },
			requestEnd: function(e) {
                kendo.ui.progress($("#homeView"), false);
            },
        },
        filterable: true,
        sortable: true,
        pageable: true,        
        scrollable: false,
        selectable: "row",
        change: f04SelectGridDetOperacion, 
        filterMenuInit: filterMenu, //llamamos a la función de configuración de los filtros
        columns: [
            //COL_1 NumOperacion
            {
                field: "NumOperacion",
                title: "Id",
                width: "40px",
                filterable: false
            },
            //COL2 Cliente
            {
                field: "ClienteAlias",
                title: "Cliente",
                width: "120px",
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
                        info: "Filtrar por Cliente: ",
                        filter: "Filtrar",
                        clear: "Limpiar"
                    }
                }
            },
            //COL3 Despachador
            {
                field: "Despachador",
                title: "Despachador",
                width: "120px",
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
                        info: "Filtrar por Cliente: ",
                        filter: "Filtrar",
                        clear: "Limpiar"
                    }
                }
            },
            //COL4 Almacén
            {
                field: "Almacen",
                title: "Almacén",
                width: "120px",
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
                        info: "Filtrar por Almacén: ",
                        filter: "Filtrar",
                        clear: "Limpiar"
                    }
                }
            },
            //COL5 #Órden
            {
                field: "Orden",
                title: "#Órden",
                width: "120px",
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
                        info: "Filtrar por Órden: ",
                        filter: "Filtrar",
                        clear: "Limpiar"
                    }
                }
            },
            //COL6 Operacion
            {
                field: "Operacion",
                title: "Operación",
                width: "120px",
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
                        info: "Filtrar por Operación: ",
                        filter: "Filtrar",
                        clear: "Limpiar"
                    }
                }
            },
            //COL7 Tiempo Trascurrido
            {
                field: "HoraFin",
                title: "Tiempo Trascurrido",
                width: "120px",
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
                        info: "Filtrar por Tiempo Trascurrido: ",
                        filter: "Filtrar",
                        clear: "Limpiar"
                    }
                }
            },
            //COL8 Fecha de creacion
            {
                field: "FechaCreacionOperacion",
                title: "Fecha de creacion",
                width: "120px",
                filterable: {
                    messages: {
                        info: "Rango de creación: "
                    }
                },
                format: "{0:dd/MM/yyyy}"
            },
            {
                field: "Estado",
                title: "Estado",
                width: "120px",
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
            }
        ]
    });
    //filterMenu -> para configurar los filtros
    function filterMenu(e) {
        if (e.field == "FechaCreacionOperacion") {
            var beginOperator = e.container.find("[data-role=dropdownlist]:eq(0)").data("kendoDropDownList");
            beginOperator.value("gte");
            beginOperator.trigger("change");

            var endOperator = e.container.find("[data-role=dropdownlist]:eq(2)").data("kendoDropDownList");
            endOperator.value("lte");
            endOperator.trigger("change");
            e.container.find(".k-dropdown").hide();
        }
    }
}


function f04SelectGridDetOperacion() {
    
    //getDespachador();
    
    //var seleccion = $(".k-state-selected").select();
    var grid = $("#f04operaciones").data("kendoGrid");
    var seleccion = grid.select();
    console.log("DFC 3 >>> "+seleccion);
    //dsOperaciones -> obtenemos la lista de tareas
    var dsOperaciones = new kendo.data.DataSource({
        transport: {
            read: {
                url: "http://www.ausa.com.pe/appmovil_test01/Operaciones/Detalle/" + this.dataItem(seleccion).NumOperacion, //226667
                dataType: "json",
                type: "get"
            },
        }
    });
    //INFORMACIONES DE PA /Operaciones/Listar
    var Actividad = "N/A";
    if (this.dataItem(seleccion).Operacion) {
        Actividad = this.dataItem(seleccion).Operacion;
    }        
    
    var HoraInicio = "N/A";
    if (this.dataItem(seleccion).HoraInicio){
        HoraInicio = this.dataItem(seleccion).HoraInicio;
    }

    var Estado  = "N/A";
    if ( this.dataItem(seleccion).Estado) {
        Estado  = this.dataItem(seleccion).Estado;
    }        
    
    var TiempoTranscurrido = "N/A";
    if (this.dataItem(seleccion).TiempoTranscurrido){
        TiempoTranscurrido = this.dataItem(seleccion).TiempoTranscurrido + " dias. ";
    }

    dsOperaciones.fetch(function () {
        var data = this.data();
        var dateFechaCreacion = eval(" new " + data[0].FechaCreacion.replace(/\//g, '') + ";");

        var day = dateFechaCreacion.getDate();
        var month = dateFechaCreacion.getMonth() + 1;
        var year = dateFechaCreacion.getFullYear();
        $("#f04FechaCreacion").text(day + "/" + month + "/" + year);

        $("#f04NumOperacion").text(data[0].NumOperacion);
        $("#f04Cliente").text(data[0].Cliente);

        $("#f04Almacen").text(data[0].Almacen);
        $("#f04Orden").text(data[0].Orden);

        //INFORMACIONES DE PA /Operaciones/Listar
        $("#f04LVTiempoTrasncurrido").text(TiempoTranscurrido);
        $("#f04LVOperacion").text(Actividad);
        $("#f04LVHoraInicio").text(HoraInicio);
        $("#f04LVEstado").text(Estado);

        $("#f04Detalle").text(data[0].Detalle);

    });
    window.location.href = "#f04accionOperacion";
}

function aumentarFont() {
    var fontSize = parseInt($(".font-cuerpo").css("font-size"));
    fontSize = fontSize + 1 + "px";
    $('.font-cuerpo').css({
        'font-size': fontSize
    });
}

function disminuirFont() {
    var fontSize = parseInt($(".font-cuerpo").css("font-size"));
    fontSize = fontSize - 1 + "px";
    $('.font-cuerpo').css({
        'font-size': fontSize
    });
}

//getDespachador -> datos del select tipo de tarea
function getDespachador() {
    console.log(" DFC >>> getDespachador()");
    var idSS = sessionStorage.getItem("sessionUSER");
    $("#txtIdDespachador").kendoDropDownList({
        dataSource: {
            transport: {
                read: {
                    url: "http://www.ausa.com.pe/appmovil_test01/Operaciones/Despachadores",
                    dataType: "json",
                    type: "get",
                }
            }
        },
        dataTextField: "nomDespachador",
        dataValueField: "idDespachador",
        value: idSS
    });
}

function Reasignar() {
    var ddLDespachador = $("#txtIdDespachador").data("kendoDropDownList");
    var dataItem = ddLDespachador.dataItem();

    var dsReasignar = new kendo.data.DataSource({
        transport: {
            read: {
                url: "http://www.ausa.com.pe/appmovil_test01/Operaciones/Reasignar/",
                dataType: "json",
                type: "post",
                data: {
                    txtid: parseInt($("#f04NumOperacion").html()),
                    txtdespachador: parseInt(dataItem.idDespachador),
                    txtobservacion: $("#f04Detalle").val()
                }
            },
        },
        error: function (e) {
            console.log("DFC Reasignar UPDATE ERR:" + e.status + "; ERROR Message: " + e.errorThrown);
        }
    });
    dsReasignar.fetch();
    window.location.href = "#f04ContenedorOperaciones";
}
