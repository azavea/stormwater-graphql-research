const appName = process.env.APP_NAME;

self.addEventListener('install', event => {
    event.waitUntil(
        caches
            .open(appName)
            .then(cache => cache
                .addAll([`/`])
                .then(() => self.skipWaiting()))
    );
});

self.addEventListener('activate',  event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, {ignoreSearch:true}).then(response => {
            return response || fetch(event.request);
        })
    );
});
