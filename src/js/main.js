const burger = document.querySelector('.burger')

if (burger) {
  burger.addEventListener('click', e => {
    e.preventDefault()

    burger.classList.toggle('active')
  })
}

const openPopup = () => {
  const popup = document.querySelector('.popup')
  const widthScrollbar = window.innerWidth - document.body.clientWidth

  console.log(window.innerWidth - document.body.scrollWidth);
  popup.classList.add('show')
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = widthScrollbar + 'px'
  popup.removeAttribute('aria-hidden')
  popup.setAttribute('aria-modal', true)
  document.querySelectorAll('header, main, footer').forEach(i => i.setAttribute('inert', ''))
}

const closePopup = () => {
  const popup = document.querySelector('.popup')
  popup.setAttribute('aria-modal', true)
  popup.classList.remove('show')
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
  document.querySelectorAll('header, main, footer').forEach(i => i.removeAttribute('inert'))
}

document.querySelectorAll('[data-target]').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault()
    openPopup()
  })
})

document.querySelector('.popup__btn').addEventListener('click', e => {
  e.preventDefault()
  closePopup()
})

document.querySelector('.popup__close').addEventListener('click', e => {
  e.preventDefault()
  closePopup()
})

document.querySelector('.popup').addEventListener('click', e => {
  e.preventDefault()
  if (e.target.classList.contains('popup')) {
    closePopup()
  }
})
