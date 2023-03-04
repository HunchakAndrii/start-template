const onWorkerReady = () => {
  console.log('SW is ready')
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')

  navigator.serviceWorker.ready.then(onWorkerReady)
} else {
  console.log('Service worker is not supported')
}

document.querySelector('button').addEventListener('click', e => {
  fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(data => {
      const ul = document.createElement('UL')

      data.products.forEach(item => {
        const li = document.createElement('LI')
        li.textContent = item.title
        ul.append(li)
      })

      document.querySelector('#app').append(ul)
    })
})
