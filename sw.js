// Service Worker for notifications
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            // Clear old caches if any
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cache => {
                        return caches.delete(cache);
                    })
                );
            })
        ])
    );
});

self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body || 'New content available!',
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            data: {
                url: data.url || self.registration.scope
            },
            requireInteraction: true
        };

        event.waitUntil(
            self.registration.showNotification(data.title || 'New Update!', options)
        );
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.notification.data && event.notification.data.url) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});

// Handle errors
self.addEventListener('error', (event) => {
    console.error('Service Worker error:', event.error);
});
