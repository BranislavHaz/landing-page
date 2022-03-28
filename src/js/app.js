import {f} from './function'
import '../scss/base.scss'

/* SLIDING RESERVATION FORM */

// FUNCTION

const slide = () => {

    if (form.style.height) {
        form.style.height = null
        form.classList.toggle('invisible')
        button.style.textAlign = "center"
        buttonText.innerHTML = 'Dohodnúť termín'
    }
    
    else {
        form.style.height = (form.scrollHeight + 20) + "px"
        setTimeout(() => {
            form.classList.toggle('invisible')
            buttonText.innerHTML = 'Ďakujem, nemám záujem'
        }, 800)
    }

}

// SLIDING

const   button = document.querySelector('.btn-reserve'),
        buttonText = document.querySelector('#reserve'),
        form = document.querySelector('.form')

button.addEventListener('click', (e) => {
    e.preventDefault()

    slide()

})

/* RESERVATION */

// FUNCTION FOR VALIDATION

const condition = new Map([

    ["meno", /[a-z]/i],
    ["mail", /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
    ["tel", /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im],
    ["datum", /^$/]

  ])

const checkAdd = (cond) => {

    if (!(cond.value.match(condition.get(cond.id)))) {
        cond.classList.remove('safely')
        cond.classList.add('wrong')
    }
    
    else {
        cond.classList.remove('wrong')
        cond.classList.add('safely')
    }
}

// FORM VALIDATION

const inputs = document.querySelectorAll('input')

inputs.forEach(item => {
    item.addEventListener('blur', () => {
        checkAdd(item)
    })

    //

    item.addEventListener('click', () => {
        const   all = document.querySelectorAll('input'), 
                allArray = Array.from(all),
                alert = document.querySelector('.alert')

        if (allArray.every(elo => elo.classList.contains('safely'))) {
            alert.classList.add('alert-warning')
            alert.innerHTML = 'Ajajajajajaj'
        }
    })

    //

})

// SEND RESERVATION

const send = document.querySelector('input[type="submit"]')

send.addEventListener('click', (e) => {
    e.preventDefault();

    // VALIDATION 

    const   all = document.querySelectorAll('input'), 
    allArray = Array.from(all),
    alert = document.querySelector('.alert')

    // SUCESS SENDING

    if (allArray.every(elo => elo.classList.contains('safely'))) {
    alert.classList.add('alert-sucess')
    alert.innerHTML = 'Vaša žiadosť bola úspešne odoslaná.'
    setTimeout(() => {
        alert.remove()
        slide()
    },3000)
    
    let name = document.querySelector('#meno').value,
    email = document.querySelector('#mail').value,
    tel = document.querySelector('#tel').value,
    date = document.querySelector('#datum').value

    fetch("https://formsubmit.co/ajax/info@studiorosina.sk", {
    method: "POST",
    headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify({
        Predmet: "Rezervácia termínu",
        Meno: name,
        Email: email,
        Telefón: tel,
        Dátum: date
    })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));

    }

    else {
        alert.classList.add('alert-warning')
        alert.innerHTML = 'Prosím, skontrolujte všetky povinné polia a skúste to znova'
        setTimeout(() => {
            alert.classList.remove('alert-warning')
            alert.innerHTML = 'Prosím, vyplňte všetky povinné polia.'
        },3000)
    }
})