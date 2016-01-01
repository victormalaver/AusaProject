'use strict';

app.funcionalidad02 = kendo.observable({
    onShow: function () {},
    afterShow: function () {},
});

function getOrden(year, order) {
    var notificationElement = $("#notification");
    notificationElement.kendoNotification();
    var notificationWidget = notificationElement.data("kendoNotification");

    $('#f02order,#f02year').parent().removeClass("has-error");
    if ($('#f02year').val() == "") {
        $('#f02year').parent().addClass("has-error");
        notificationWidget.show("Ingrese la fecha de orden", "error");
        return;
    }
    if ($('#f02year').val().length != 4) {
        $('#f02year').parent().addClass("has-error");
        notificationWidget.show("Ingrese una fecha correcta", "error");
        return;
    }
    if ($('#f02order').val() == "") {
        $('#f02order').parent().addClass("has-error");
        notificationWidget.show("Ingrese el número de orden", "error");
        return;
    }
    //Para completar con ceros la cadena
    var ceros = 6 - $("#f02order").val().length;
    for (var i = 0; i < ceros; i++) {
        order = "0" + $("#f02order").val();
        $("#f02order").val(order);
    }
    //fin
    var cliente = sessionStorage.getItem("sessionUSER");
    if (cliente > 0) {

    } else {
        alert("Ingrese id de usuario");
        return;
    }
    var dsOrden = new kendo.data.DataSource({
        transport: {
            read: {
                //url: "http://54.213.238.161/WsPrueba/Ordenes/valor?fecha=" + year + "&id=" + order + "&cliente=" + cliente,
                url: "http://www.ausa.com.pe/appmovil_test01/Ordenes/valor?fecha=" + year + "&id=" + order + "&cliente=" + 376,
                dataType: "json"
            }
        },
        schema: {
            data: function (data) {
                return data;
            }
        },
        requestStart: function (e) {
            kendo.ui.progress($("#ListaOrdenes"), true);
        },
        requestEnd: function (e) {
            kendo.ui.progress($("#ListaOrdenes"), false);
        },
        error: function (e) {
            kendo.ui.progress($("#ListaOrdenes"), false);
            alert("El Servicio no esta Disponible.");
        }
    });

    dsOrden.fetch(function () {
        if (dsOrden.total() > 0) { //Si existe la orden
            var data = dsOrden.data();
            var orden = data[0];
            var dsDetOrden = new kendo.data.DataSource({
                transport: {
                    read: {
                        //url: "http://54.213.238.161/WsPrueba/Ordenes/detalle/" + orden.ord_int_id,
                        url: "http://www.ausa.com.pe/appmovil_test01/Ordenes/detalle/" + orden.ord_int_id,
                        dataType: "json"
                    }
                },
                schema: {
                    data: function (data) {
                        return data;
                    },
                    model: {
                        fields: {
                            Apertura: { //Inicio Importación
                                type: "date"
                            },
                            ETAEstimado: {
                                type: "date"
                            },
                            LlegadaNave: {
                                type: "date"
                            },
                            TerminoDescarga: {
                                type: "date"
                            },
                            DocumentosCompletos: {
                                type: "date"
                            },
                            FechaNumeracion: {
                                type: "date"
                            },
                            FechaCancelacion: {
                                type: "date"
                            },
                            AforoCulminado: {
                                type: "date"
                            },
                            LevanteAutorizado: {
                                type: "date"
                            },
                            RetiroCulminado: {
                                type: "date"
                            },
                            IniciarTramite: { //Inicio Exportación
                                type: "date"
                            },
                            ESC: {
                                type: "date"
                            },
                            DAM: {
                                type: "date"
                            },
                            DAMFisico: {
                                type: "date"
                            },
                            MercanciaPuerto: {
                                type: "date"
                            },
                            EmbarqueExito: {
                                type: "date"
                            },
                            TramiteVisto: {
                                type: "date"
                            },
                            RecepDocs: {
                                type: "date"
                            },
                            DAMDefinitiva: {
                                type: "date"
                            },
                            Regularizacion: {
                                type: "date"
                            },
                            DAMcliente: {
                                type: "date"
                            }
                        }
                    }
                },
                requestStart: function (e) {
                    kendo.ui.progress($("#det-orden"), true);
                },
                requestEnd: function (e) {
                    kendo.ui.progress($("#det-orden"), false);
                },
                error: function (e) {
                    kendo.ui.progress($("#det-orden"), false);
                    alert("El Servicio no esta Disponible.");
                }

            });
            dsDetOrden.fetch(function () {
                var data = dsDetOrden.data();
                var detOrden = data[0];
                if (detOrden.Regimen == "IMPO") {
                    $("#det-orden").kendoListView({
                        dataSource: dsDetOrden,
                        template: kendo.template($("#temp01").html())
                    });
                } else {
                    $("#det-orden").kendoListView({
                        dataSource: dsDetOrden,
                        template: kendo.template($("#temp02").html())
                    });
                }
                $("#f02NumOrden").text("Nro de la Orden: " + $("#f02year").val() + "-" + $("#f02order").val());
            });
            window.location.href = "#det-orden1";
        } else {
            notificationWidget.show("La orden no está asignada", "error");
        }
    });
    /*dsOrden.fetch(function () {
  .replace(/\D/g,'')
        var data = dsOrden.data();
        var orden = data[0];

        var date = new Date(parseInt(orden.fecha, 10));

        //alert(date);
        //alert(date.toLocaleString());
    });*/
}


//funcion solo deja colocar numeros sin punto ni coma
function soloNumeros(e) {
    var keynum = window.event ? window.event.keyCode : e.which;
    if ((keynum == 8))
        return true;
    return /\d/.test(String.fromCharCode(keynum));
}