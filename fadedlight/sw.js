// sw.js - Your Service Worker

// 1. Give your cache a name and version.
// IMPORTANT: When you want to update your game, you MUST change this version number.
// e.g., 'faded-light-cache-v2', 'faded-light-cache-v3', etc.
const CACHE_NAME = 'faded-light-cache-v1';

// 2. List all the files your game needs to work offline.
// For your game, it's just the main HTML file.
const urlsToCache = [
  'index.html' 
  // If you later add images or sounds, you would add them here too, like:
  // 'background-music.mp3',
  // 'title-image.png'
];

// 3. The "install" event: This runs when the service worker is first registered.
// Its job is to open the cache and store all your files.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching files');
        return cache.addAll(urlsToCache);
      })
  );
});

// 4. The "fetch" event: This is the magic. It runs every single time your
// app tries to request a file (like loading index.html).
self.addEventListener('fetch', event => {
  event.respondWith(
    // It checks if a matching file already exists in our cache.
    caches.match(event.request)
      .then(response => {
        // If we found a file in the cache, return it immediately (this is the offline part).
        if (response) {
          return response;
        }
        // If we didn't find it in the cache, we go to the internet and get it.
        return fetch(event.request);
      }
    )
  );
});

// 5. The "activate" event: This cleans up old caches.
// When you update CACHE_NAME to 'v2', this code will find and delete the old 'v1' cache.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});