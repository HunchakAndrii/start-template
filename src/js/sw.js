const CacheKey = 'cache-v2'

const initCache = () => {
  return caches.open(CacheKey).then(
    cache => {
      return cache.addAll([
        '/index.html',
        '/main.css',
        '/kit.html',
        '/main.js',
        '/sw.js',
      ])
    },
    error => {
      console.log(error)
    }
  )
}

const tryNetwork = (req, timeout) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(reject, timeout)
    fetch(req).then(res => {
      clearTimeout(timeoutId)
      if (
        req.url.startsWith('http') &&
        !req.url.startsWith(self.location.origin)
      ) {
        const responseClone = res.clone()
        caches.open(CacheKey).then(cache => {
          cache.put(req, responseClone)
        })
      }
      resolve(res)
    }, reject)
  })
}

const getFromCache = req => {
  console.log('network is off so getting from cache...', req)
  return caches.open(CacheKey).then(cache => {
    if (req.url === 'https://test.pro-verstka.site/') {
      return cache.match('index.html').then(result => {
        return result || Promise.reject('no-match')
      })
    }
    return cache.match(req).then(result => {
      return result || Promise.reject('no-match')
    })
  })
}

self.addEventListener('install', e => {
  console.log('Installed')
  e.waitUntil(initCache())
})

self.addEventListener('activate', e => {
  console.log('Activate')
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          console.log(key)
          if (key !== CacheKey) {
            return caches.delete(key)
          }
        })
      )
    })
  )
})

self.addEventListener('fetch', e => {
  // console.log('Try network and store result or get data from cache')
  // Try network and if it fails, go for the cached copy.
  e.respondWith(tryNetwork(e.request, 400).catch(() => getFromCache(e.request)))
})
