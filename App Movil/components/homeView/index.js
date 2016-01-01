'use strict';

app.homeView = kendo.observable({
    onShow: function () {},
    afterShow: function () {}
});

// START_CUSTOM_CODE_homeView
var txtsUsuario = "";
var txtsContrasenia = "";
var dsLogin = null;
var DSroles, DSdatos, datos, dsRoles;

function CleanDS() {
    $("#txtsUsuario").val("");
    $("#txtsUsuario").html("");
    $("#txtsContrasenia").val("");
    $("#txtsContrasenia").html("");
}

function LoginDS() {
    /*
     * DATOS PRUEBAS
     * jlcornejo - 123
     * rmanrique - rm0112ue
     */
    txtsUsuario = $("#txtsUsuario").val();
    txtsContrasenia = $("#txtsContrasenia").val();

    var notificationElement = $("#notification");
    notificationElement.kendoNotification();
    var notificationWidget = notificationElement.data("kendoNotification");

    if (isEmpty(txtsUsuario)) {
        notificationWidget.show("Ingrese el usuario", "error");
        return;
    }

    if (isEmpty(txtsContrasenia)) {
        notificationWidget.show("Ingrese la contraseña", "error");
        return;
    }

    dsLogin = new kendo.data.DataSource({
        transport: {
            read: {
                url: "http://www.ausa.com.pe/appmovil_test01/Inicio/AutentificaUsuario",
                dataType: "json",
                type: "post",
                data: {
                    txtsUsuario: txtsUsuario,
                    txtsContrasenia: txtsContrasenia
                }
            }
        }
        ,
		 requestStart: function (e) {
            kendo.ui.progress($("#homeView"), true);
        },
        requestEnd: function (e) {
            kendo.ui.progress($("#homeView"), false);
        },
        error: function (e) {
            kendo.ui.progress($("#homeView"), false);
            alert("El Servicio no esta Disponible.");
        }
    });

    dsLogin.fetch(function () {
        var data = this.data();
        /*
         * --> 0 ERROR usuario autenticado correctamente
         * --> 1 ERROR usuario no autenticado
         */
        var resLogin = 1;
        resLogin = data[0].Ejecucion;

        if (resLogin === 0) { 
            var userID = data[0].Id;
			
            DSdatos = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "http://www.ausa.com.pe/appmovil_test01/Usuarios/Datos/" + userID,
                        dataType: "json"
                    }
                }
            });

            DSdatos.fetch(function () {
                var data = this.data();
                //console.log("Log=>"+data[0].Column1);
                datos = data[0].Column1;
                $("#NombreUsuario").html("Usuario: " + datos);
                $("#fUsuario").html("Usuario: " +datos);  
            });

            sessionStorage.setItem("sessionUSER",userID); 
            
            /*
            funciones para roles y mostrar ocultar segun sea el caso
            */
            validarRoles(userID,"block");
			
            $("#txtsUsuario").val("");
            $("#txtsUsuario").html("");
            $("#txtsContrasenia").val("");
            $("#txtsContrasenia").html("");
			
            $("#funSS").css("display", "none");  
            $("#funCS").css("display", "block"); 
            $("#fUsuario").css("display", "block"); 
            
            window.location.href = "#AutenticacionOK";

        }

        if (resLogin === 1) {
            notificationWidget.show("Error de Autenticación", "error");
            notificationWidget.show("Usuario y/o Contraseña no son válidos", "error");
        }

    });
}

function validarRoles(id, visual){
    
    if (id=="salida"){
        $("#fun01").css("display", visual); 
        $("#fun02").css("display", visual); 
        $("#fun03").css("display", visual); 
        $("#fun04").css("display", visual); 
        $("#fun05").css("display", visual);
    }else{
        
        dsRoles = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "http://www.ausa.com.pe/appmovil_test01/Usuarios/Roles/"+id,
                    dataType: "json"
                }
            }
        });
        
        dsRoles.fetch(function () {
            var data = this.data(); 
            for (var i=0;i<dsRoles.total();i++){
                //console.log("Itera: "+i+" - Rol:"+data[i].Rol);
                switch(data[i].Rol){
                    case "Datos del cliente":
                        //habilitar opciones
                        $("#fun01").css("display", visual); 
                        break;
                    case "Seguimiento despacho":
                        //habilitar opciones
                        $("#fun02").css("display", visual); 
                        break; 
                    case "Tareas":
                        //habilitar opciones
                        $("#fun03").css("display", visual); 
                        break; 
                    case "Operaciones Coordinador":
                        //habilitar opciones
                        $("#fun04").css("display", visual); 
                        $("#fun05").css("display", visual); 
                        break;
                    case "Operaciones Despachador":
                        //habilitar opciones
                        $("#fun04").css("display", visual); 
                        $("#fun05").css("display", visual); 
                        break; 
                }
            }
        });   
    }
    
    
}

function cerrarSesion(){ 
    validarRoles("salida","none");
    $("#funSS").css("display", "block");  
    $("#funCS").css("display", "none"); 
    $("#fUsuario").css("display", "none"); 
    sessionStorage.setItem("sessionUSER",""); 
    window.location.href = "#homeView";
} 

function isEmpty(str) {
    return (!str || 0 === str.length);
}

// END_CUSTOM_CODE_homeView