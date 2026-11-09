document.addEventListener("DOMContentLoaded",()=>{

const menuButton=document.querySelector(".menu-button");
const nav=document.querySelector(".navbar nav");

if(menuButton&&nav){
nav.addEventListener("click",()=>{});
menuButton.addEventListener("click",()=>{
nav.classList.toggle("active");
const aberto=nav.classList.contains("active");
menuButton.setAttribute("aria-expanded",aberto?"true":"false");
});

nav.querySelectorAll("a").forEach(link=>{
link.addEventListener("click",()=>{
nav.classList.remove("active");
menuButton.setAttribute("aria-expanded","false");
});
});
}

/* Carrossel */

const carousel=document.querySelector(".projects-carousel");
const wrapper=document.querySelector(".projects-wrapper");
const grid=document.querySelector(".projects-grid");
const prevButton=document.querySelector(".projects-carousel .prev");
const nextButton=document.querySelector(".projects-carousel .next");

if(!carousel||!wrapper||!grid||!prevButton||!nextButton){
console.error("Carrossel: algum elemento não foi encontrado.");
return;
}

/* Projetos */

const originalCards=[...grid.querySelectorAll(".project-card")];

if(originalCards.length<2){
console.warn("Carrossel precisa de pelo menos 2 projetos.");
return;
}

function ajustarCards(){
const larguraWrapper=wrapper.clientWidth;
if(!larguraWrapper)return;

const larguraTela=window.innerWidth;
let quantidade;

if(larguraTela<=700){
quantidade=1;
}else if(larguraTela<=1000){
quantidade=2;
}else{
quantidade=3;
}

const gap=14;
const larguraCard=(larguraWrapper-gap*(quantidade-1))/quantidade;

grid.querySelectorAll(".project-card").forEach(card=>{
card.style.flex=`0 0 ${larguraCard}px`;
card.style.width=`${larguraCard}px`;
});
}

originalCards.forEach(card=>{
const clone=card.cloneNode(true);
clone.classList.add("carousel-clone");
grid.appendChild(clone);
});

let animationFrame=null;
let pausado=false;
let arrastando=false;
let ultimoTempo=0;
let acumulador=0;
let resizeTimer=null;
/* Velocidade
*/
const VELOCIDADE=50;

function getLarguraGrupoOriginal(){
const primeiroOriginal=grid.querySelector(".project-card");
const primeiroClone=grid.querySelector(".carousel-clone");

if(!primeiroOriginal||!primeiroClone)return 0;

return primeiroClone.offsetLeft;
}

/* Loop */

function autoplay(tempo){
if(!ultimoTempo)ultimoTempo=tempo;

const delta=tempo-ultimoTempo;
ultimoTempo=tempo;

if(!pausado&&!arrastando){

/*
 Velocidade por pixels
 */

const movimento=(VELOCIDADE*delta)/1000;
wrapper.scrollLeft+=movimento;

const larguraGrupo=getLarguraGrupoOriginal();

/*
Aqui é o clone pra impressão de que o carrossel é infinito.
 */

if(larguraGrupo>0&&wrapper.scrollLeft>=larguraGrupo){
wrapper.scrollLeft-=larguraGrupo;
}
}

animationFrame=requestAnimationFrame(autoplay);
}

/*Automatico*/

function iniciarAutoplay(){
if(animationFrame)return;

ultimoTempo=0;
animationFrame=requestAnimationFrame(autoplay);
}

/* Parar o automatico*/

function pararAutoplay(){
if(animationFrame){
cancelAnimationFrame(animationFrame);
animationFrame=null;
}
}

/* Passando o mous para */

carousel.addEventListener("mouseenter",()=>{
pausado=true;
});

carousel.addEventListener("mouseleave",()=>{
pausado=false;
});

carousel.addEventListener("touchstart",()=>{
arrastando=true;
},{
passive:true
});

carousel.addEventListener("touchend",()=>{
arrastando=false;
},{
passive:true
});

function getPasso(){
const card=grid.querySelector(".project-card");
if(!card)return 0;

const largura=card.getBoundingClientRect().width;
const estilo=window.getComputedStyle(grid);

const gap=parseFloat(estilo.columnGap)||parseFloat(estilo.gap)||14;

return largura+gap;
}

nextButton.addEventListener("click",()=>{
pausado=true;

const passo=getPasso();
if(!passo)return;

wrapper.scrollBy({
left:passo,
behavior:"smooth"
});



setTimeout(()=>{
pausado=false;
},800);
});

prevButton.addEventListener("click",()=>{
pausado=true;

const passo=getPasso();
if(!passo)return;


if(wrapper.scrollLeft<=2){
const larguraGrupo=getLarguraGrupoOriginal();

if(larguraGrupo>0){
wrapper.scrollLeft=larguraGrupo;
}
}

wrapper.scrollBy({
left:-passo,
behavior:"smooth"
});

setTimeout(()=>{
pausado=false;
},800);
});

window.addEventListener("resize",()=>{
clearTimeout(resizeTimer);

resizeTimer=setTimeout(()=>{
const posicao=wrapper.scrollLeft;

ajustarCards();

requestAnimationFrame(()=>{
wrapper.scrollLeft=posicao;
});
},200);
});

function inicializar(){
ajustarCards();
wrapper.scrollLeft=0;
iniciarAutoplay();

console.log("=================================");
console.log("CARROSSEL INICIADO");
console.log("Projetos:",originalCards.length);
console.log("Autoplay: ATIVO");
console.log("Velocidade:",VELOCIDADE,"px/s");
console.log("=================================");
}

const imagens=grid.querySelectorAll("img");
let imagensCarregadas=0;

if(imagens.length===0){
inicializar();
}else{
imagens.forEach(img=>{
if(img.complete){
imagensCarregadas++;
}else{
img.addEventListener("load",()=>{
imagensCarregadas++;

if(imagensCarregadas===imagens.length){
inicializar();
}
},{
once:true
});

img.addEventListener("error",()=>{
imagensCarregadas++;

if(imagensCarregadas===imagens.length){
inicializar();
}
},{
once:true
});
}
});



if(imagensCarregadas===imagens.length){
inicializar();
}
}

});
