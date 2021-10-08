// preluare date din eurostat.json la incarcarea paginii
var date =[]
var tari=[]
var indicatori=[]
var ani=[]

function preluateInFunctieDeIndicator(ind,array) {
    var dateIndicator =[];
    array.map((data)=>{
        if(data.indicator===ind) dateIndicator.push(data);
    })

    return dateIndicator;
}

function preluateInFunctieDeAn(an) {
    var dateAn =[];
    date.map((data)=>{
        if(data.an===an) dateAn.push(data);
    })

    return dateAn;
}

function preluareInFunctieDeIndicatorSiTara(ind,tr){
    var dateIndicatorTara = []
    date.map((data)=>{
        if(data.indicator===ind && data.tara === tr) dateIndicatorTara.push(data);
    })

    return dateIndicatorTara;
}

var selectTara = document.getElementById("selectTara")
var selectAn = document.getElementById("selectAn")
var selectIndicator = document.getElementById("selectIndicator")

//adaugarea datelor in select-uri
function adaugareOptiuni(){
    
    for(var i=0;i<tari.length;i++){
        var elem=document.createElement("option")
        elem.label=tari[i]
        elem.value=tari[i]
        selectTara.appendChild(elem)
    }

    for(var i=0;i<ani.length;i++){
        var elem=document.createElement("option")
        elem.label=ani[i]
        elem.value=ani[i]
        selectAn.appendChild(elem)
    }

    for(var i=0;i<indicatori.length;i++){
        var elem=document.createElement("option")
        elem.label=indicatori[i]
        elem.value=indicatori[i]
        selectIndicator.appendChild(elem)
    }
}

//selectarea optiunilor din setul de date
function stabilireOptiuni(){
    let setTari = new Set(date.map((taraDinSet)=>taraDinSet.tara))
    tari = Array.from(setTari)
    //console.log(tari)
    let setAni = new Set(date.map((taraDinSet)=>taraDinSet.an))
    ani = Array.from(setAni)
    //console.log(ani)
    let setIndicatori = new Set(date.map((taraDinSet)=>taraDinSet.indicator))
    indicatori = Array.from(setIndicatori)
    //console.log(indicatori)
}

//functia de preluare date 
function preluareDate(){
    fetch("./Media/eurostat.json")
    .then(response => response.json())
    .then(data=>{
        date=data;
        stabilireOptiuni();
        adaugareOptiuni();
    })
   
}

//preluarea datelor la incarcarea paginii
window.onload=function () {
    preluareDate();
}

//************ Afisare grafica evolutie pentru un indicator si o tara selectata ***********/

var svgH=500;
var SVGW = 800;
var margineSvg=60;

//functia de desenare a unui dreptunghi din grafic
function desenareDreptunghi(x,y,wd,ht,fill,svg) {
    var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    rect.setAttributeNS(null, 'x', x);
    rect.setAttributeNS(null, 'y', y);
    rect.setAttributeNS(null, 'width', wd);
    rect.setAttributeNS(null, 'height', ht);
    rect.setAttributeNS(null, 'fill', "#00ff00");
    svg.appendChild(rect);
}

//functia de desenare a axelor graficului
function desenareAxe(svg,x1,y1,x2,y2) {
  
    var axe = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    axe.setAttribute("x1", x1);
    axe.setAttribute("y1", y1);
    axe.setAttribute("x2", x2);
    axe.setAttribute("y2", y2);
    axe.style.stroke = "black";
    axe.style.strokeWidth = "3px";
    svg.appendChild(axe);
}

//functia de desenare a anilor, valorii minime si a valorii maxime
function desenareValoriAxe(ani,valori,svg,latimeDreptunghi) {
    var inaltimeAxa = svgH-2*margineSvg;
    var valoareMin=Math.min.apply(Math,valori);
    var valoareMax=Math.max.apply(Math,valori);
    var valoareMedie=(valoareMin+valoareMax)/2;
    var valoare1=(valoareMin+valoareMedie)/2;
    var valoare3=(valoareMax+valoareMedie)/2;

    //desenarea valorii minime
    textelement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    textelement.setAttribute('dx', 2 );
    textelement.setAttribute('dy',inaltimeAxa+margineSvg);
    txtnode = document.createTextNode(valoareMin);
    textelement.appendChild(txtnode);
    svg.appendChild(textelement);

    //desenarea valorii maxime
    textelement2 = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    textelement2.setAttribute('dx', 2 );
    textelement2.setAttribute('dy',margineSvg);
    txtnode2 = document.createTextNode(valoareMax);
    textelement2.appendChild(txtnode2);
    svg.appendChild(textelement2);

    //desenarea valorii medii
    textelement3 = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    textelement3.setAttribute('dx', 2 );
    textelement3.setAttribute('dy',inaltimeAxa/2+margineSvg);
    txtnode3 = document.createTextNode(valoareMedie);
    textelement3.appendChild(txtnode3);
    svg.appendChild(textelement3);

     //desenarea valorii intre minim si mediu
     textelement4 = document.createElementNS("http://www.w3.org/2000/svg", 'text');
     textelement4.setAttribute('dx', 2 );
     textelement4.setAttribute('dy',inaltimeAxa/4+inaltimeAxa/2+margineSvg);
     txtnode4 = document.createTextNode(valoare1);
     textelement4.appendChild(txtnode4);
     svg.appendChild(textelement4);

      //desenarea valorii intre mediu si maxim
      textelement5 = document.createElementNS("http://www.w3.org/2000/svg", 'text');
      textelement5.setAttribute('dx', 2 );
      textelement5.setAttribute('dy',inaltimeAxa/4+margineSvg);
      txtnode5 = document.createTextNode(valoare3);
      textelement5.appendChild(txtnode5);
      svg.appendChild(textelement5);

    //desenarea anilor
    for (var i = 0; i < ani.length; i++) {
        xAn = margineSvg + 7 + (i * (latimeDreptunghi )) ;
        yAn = inaltimeAxa+margineSvg+15;
        textelement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        textelement.setAttribute('dx', xAn);
        textelement.setAttribute('dy', yAn);
        textelement.setAttribute('textLength',25);
        txtnode = document.createTextNode(ani[i]);
        textelement.appendChild(txtnode);
        svg.appendChild(textelement);
    }
}

function stergeGrafic(svg) {
    while(svg.lastChild){
        svg.removeChild(svg.lastChild);
    }
}

var btnSvg = document.getElementById("svgButton");
btnSvg.onclick =function (){
    var svg = document.getElementById("graficSVG");
    var optInd=selectIndicator.value;
    var optTr=selectTara.value;
    var arr=[];
    arr=preluareInFunctieDeIndicatorSiTara(optInd,optTr);
    //console.log(arr);
    var aniSvg=[];
    var valoriSvg=[];
    for(var i=0;i<arr.length;i++){
        aniSvg.push(parseInt(arr[i].an));
        valoriSvg.push(parseInt(arr[i].valoare));
    }
    // console.log(aniSvg);
    console.log(valoriSvg);
    var maxim = Math.max.apply(Math,valoriSvg);

    var latimeDreptunghi = (SVGW-2*margineSvg)/arr.length; //latime dreptunghi cu spatiu
    var minim = Math.min.apply(Math,valoriSvg);
    // console.log(pondere);
    // console.log(latimeDreptunghi);

    var inaltimeAxa = svgH-2*margineSvg;
    var inaltimeSvg=svgH - margineSvg;  //inaltime grafic cu margine
    var latimeSvg=SVGW - margineSvg;

    stergeGrafic(svg);

    //desenarea axelor
    desenareAxe(svg,margineSvg,margineSvg,margineSvg,inaltimeSvg);
    desenareAxe(svg,margineSvg,inaltimeSvg,latimeSvg,inaltimeSvg);
    desenareValoriAxe(aniSvg,valoriSvg,svg,latimeDreptunghi);

    //desenarea dreptunghiurilor in grafic
    for(var i=0;i<valoriSvg.length;i++){
        var xBar = margineSvg +(i*latimeDreptunghi)+10
        var inaltimeDreptunghi=(inaltimeAxa/(maxim-minim))*(valoriSvg[i]-minim) +2
        var yBar = inaltimeSvg-3 - inaltimeDreptunghi
        desenareDreptunghi(xBar,yBar,0.7*latimeDreptunghi,inaltimeDreptunghi,true,svg);
    }

}



//******** Afisare grafica a datelor despre indicatorii fiecarei tari in functie de un an selectat********/

document.getElementById("canvasButton").onclick=()=>{
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var optAn=selectAn.value;
    var array=[];
    array = preluateInFunctieDeAn(optAn);
    console.log(array);
}

///********* Afisare tabelara a datelor fiecarei tari in functie de un an selectat *************** */

// function maxDistantaFataDeMedie(array,medie) {
//     var maxim=0;
//     for(var i=0;i<array.length;i++){
//         if(Math.abs(array[i].valoare-medie)>maxim)
//         {
//             maxim=Math.abs(array[i].valoare-medie);
//         }
//     }
//     return maxim;
// }
document.getElementById("tableButton").onclick=function(){
    var optAn=selectAn.value;
    var array=[];
    array = preluateInFunctieDeAn(optAn);
    var arraySv=preluateInFunctieDeIndicator("SV",array);
    var arrayPop=preluateInFunctieDeIndicator("POP",array);
    var arrayPib=preluateInFunctieDeIndicator("PIB",array);

    console.log(arraySv);
    console.log(arrayPop);
    console.log(arrayPib);

    var tabel=document.createElement("table");
    tabel.style.border = "solid 2px black"
    var fr=document.createElement("tr");
    fr.style.border = "solid 2px black"
    var td= document.createElement("td");
    td.style.border = "solid 2px black"
    td=fr.insertCell();
    td.innerHTML = "Tara";
    td=fr.insertCell();
    td.innerHTML = "SV";
    td=fr.insertCell();
    td.innerHTML = "PIB";
    td=fr.insertCell();
    td.innerHTML = "POP";
    tabel.appendChild(fr);  
    console.log(array);

    // var sumaSv=0,sumaPOP=0,sumaPib=0;
    // for(var i=0;i<tari.length;i++){
    //     if(arraySv[i].valoare!=null){
    //     sumaSv+=arraySv[i].valoare;}
    //     sumaPOP+=arrayPop[i].valoare;
    //     sumaPib+=arrayPib[i].valoare;
    // }
    // var medieSv=sumaSv/tari.length;
    // console.log(medieSv);
    // var mediePop=sumaPOP/tari.length;
    // var mediePib=sumaPib/tari.length;


    console.log(tari);
    for(var i=0;i<tari.length;i++){
        // var rosu=0;
        // var verde=0;
        var tr = document.createElement("tr");
        tr.style.border = "solid 2px black"
        var td = document.createElement("td");
        td.style.border = "solid 2px black"
        td=tr.insertCell();
        td.innerHTML=tari[i];
        td.style.border = "solid 2px black"
        td=tr.insertCell();
        // var mod=Math.abs((medieSv-arraySv[i].valoare)/maxDistantaFataDeMedie(arraySv,medieSv))
        // if(arraySv[i].valoare<medieSv){
        //     rosu=255;
        //     verde=0;
        //     td.style.backgroundColor="rgb("+rosu+","+verde+",0)";
        // }
        // else{
        //     verde=255
        //     rosu=0;
        //     td.style.backgroundColor="rgb("+rosu+","+verde+",0)";
        // }
        if(arraySv[i].valoare===null){
            td.innerHTML="null";
        }
        else{
        td.innerHTML=arraySv[i].valoare;}
        td.style.border = "solid 2px black"
        var td = document.createElement("td");
        td=tr.insertCell();
        if(arrayPib[i].valoare===null){
            td.innerHTML="null";
        }
        else{
        td.innerHTML=arrayPib[i].valoare;}
        td.style.border = "solid 2px black"
        var td = document.createElement("td");
        td=tr.insertCell();
        if(arrayPop[i].valoare===null){
            td.innerHTML="null";
        }
        else{
        td.innerHTML=arrayPop[i].valoare;}
        td.style.border = "solid 2px black"
        tabel.appendChild(tr);
    }

    document.body.appendChild(tabel);
}
