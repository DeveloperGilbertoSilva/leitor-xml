var arrayIDs = [];
var doc = new XMLHttpRequest();
doc.open("GET", "doc.xml", false);
doc.setRequestHeader("Content-Type", "text/xml");
doc.send(null);

var resultado = doc.responseXML;
getScripts(resultado.getElementsByTagName("sys_name"), resultado.getElementsByTagName("sys_id"));

function getScripts(nomeScripts, ids) {
    let tbody = document.getElementById("tbodyScript");
    let total;

    let min = 0;
    let max = ids.length;

    for (let i = min; i < max; i++) {
        let tr = document.createElement("tr");
        let tdNome = document.createElement("td");
        let tdId = document.createElement("td");

        tdNome.innerText = nomeScripts[i].textContent;
        tdId.innerText = ids[i].textContent;

        tr.appendChild(tdNome);
        tr.appendChild(tdId);
        tbody.appendChild(tr);

        var objScript = {};
        objScript.nome = nomeScripts[i].textContent;
        objScript.id = ids[i].textContent;

        arrayIDs.push(objScript);
        total = i;
    }

    let divResultado = document.getElementById("resultado");
    let textArea = document.createElement("textarea");

    textArea.innerText = JSON.stringify(arrayIDs);
    textArea.setAttribute("cols", "150");
    textArea.setAttribute("rows", "20");
    divResultado.appendChild(textArea);

    console.log(arrayIDs);
}


function getBRs(objScript, tipoPesquisa) { // Consulta pelo registros com ID correspondente ao ID armazenado no array
    var itensNotFound = [];
    var tabela;

    try {
        switch (tipoPesquisa) {
            case "br":
                tabela = "sys_script";
                break;

            case "client_script":
                tabela = "sys_script_client";
                break;

            case "ui_policy":
                tabela = "sys_ui_policy";
                break;
            
            case "script_include":
                tabela = "sys_script_include";
                break;
            
            case "client_script_catalogo":
                tabela = "catalog_script_client";
                break;
            
            case "ui_policy_catalogo":
                tabela = "catalog_ui_policy";
                break;
           
            case "widget-portal":
                tabela = "sp_widget";
                break;
            
            case "flow":
                tabela = "sys_hub_flow";
                break;
        }

        for (var i = 0; i < objScript.length; i++) {
            var grBR = GlideRecord(tabela);
            grBR.addQuery('sys_id', objScript[i].id);
            grBR.query();

            if (!grBR.hasNext())
                itensNotFound.push(objScript[i]);
        }
    } catch (err) {
        gs.log("Não foi possível realizar o levantamento: " + err);
    }
  
    gs.info("<pre>"+JSON.stringify(itensNotFound)+"</pre>");
}



getBRs(array, 'script_include');

/*
OK- BRs
OK- Client scripts
OK- UI Policies
OK- Classes
OK- Client scripts de catálogo
OK- UI Policies de catálogo
OK- Widgets de portal
OK- Flows
*/