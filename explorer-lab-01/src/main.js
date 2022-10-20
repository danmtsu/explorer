import "./css/index.css"
import IMask from "imask"
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path") // da classe cc-bg pega o seletor svg  pega o primeiro filho g e o path
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img") // const para mudar a logo do cartão buscando o seletor da linha 105 do index

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    hellfriend: ["yellow", "green"],
    default: ["black", "gray"],
  } // setando um objeto com as cores padrões dos cartões de crédito de acordo com a bandeira
  ccBgColor01.setAttribute("fill", colors[type][0])
  //muda o atributo, primeiro argumento o atributo que deseja mudar e o segundo a mudança que deseja mudar
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

const securityCode = document.querySelector("#security-code")
const securityCodeLaw = {
  mask: "0000",
}
var security = IMask(securityCode, securityCodeLaw) //função iMask(atributo,objeto{regra-do-campo:"000"})
const expirationDate = document.querySelector("#expiration-date")
const expirationRules = {
  mask: "MM{/}YY",
  blocks: {
    //é um bloco de padrão criado para  determinado campo tendo a mask o tipo desejado
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}

const expiration = IMask(expirationDate, expirationRules)
globalThis.setCardType = setCardType //deixando a função do setCardType global

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    { mask: "0000 0000 0000 0000", regex: /^4\d{0,15}/, cardType: "visa" },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    }, // criando as expressões regulares de acordo com as regras do numero de cartão da mastercard
    {
      mask: "0000 0000 0000 0000",
      regex: /^6\d{0,15}/,
      cardType: "hellfriend",
    },
    { mask: "0000 0000 0000 0000", cardType: "default" },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    //pega o value que é o valor digitado, e adiciona o appended acrescentado o digito digitado e caso não seja um digito ele substitui por vazio
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    return foundMask
    //pega a mascara dinamica e procura os casos na qual batem com as expressões regulares retornando-a
  },
}

const cardValidation = IMask(cardNumber, cardNumberPattern)

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "DEID COSTA" : cardHolder.value //pega o valor digitado no input ou seja no #card-holder e com o addEventListenner fica monitorando, conforme o valor do input muda o valor do .cc-holder vai mudando, caso o tamanho do cardHolder.value seja === 0 ele retorna para DEID COSTA, caso não ele imprime o valor digitado no input
})
const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  console.log("ta dando boa")
}) //fica observando caso ocorra um determinado evento
//()=>{} é uma função anonima, geralmente não reaproveitada
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault() // não realizara o comando padrão do tipo submit
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "666" : code
}
security.on("accept", () => {
  updateSecurityCode(security.value)
}) //mesma lógica do addEventListenner fica observando o conteudo do input, primeiro parametro é a condição para capturar o evento
function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "0420 6969 1313 2313" : number
  console.log(number.value)
}

cardValidation.on("accept", () => {
  const cardFlag = cardValidation.masked.currentMask.cardType
  setCardType(cardFlag)
  updateCardNumber(cardValidation.value)
})

function updateCardExpiration(expiration) {
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = expiration.length === 0 ? "01/23" : expiration
}
expiration.on("accept", () => {
  updateCardExpiration(expiration.value)
})

/* Expressões regulares
Agrupando padrões em um array
  const matches 'aBC'.match(/[A-Z]/g)
  Retorno: Array[B,C] procura expressões regulares de "A" até "Z" maiusculas e retorna num array

Pesquisa se existe ou não o padrão
  const index = 'aBC'.search(/[A-Z]/)
  Output: 1

  Substitui os padrões por um novo valor
  const next = 'aBC'.replace(/a/, 'A')
  output: ABC
*/

/*
visa
inicia com 4 seguido de mais 15 digitos
master
inicia com 5 seguido de um digito entre 1 e 5, seguido de mais 2 digitos
OU 
inicia com 22, seguido de um digito entre 2 e 9, seguido de mais um digito
OU
inicia com 2, seguido de um digito entre 3 e 7, seguido de mais 2 digitos*/
