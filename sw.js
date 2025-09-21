// Service Worker for GreenBite PWA
const CACHE_NAME = 'greenbite-v1.0.1';
const STATIC_CACHE_NAME = 'greenbite-static-v1.0.1';
const DYNAMIC_CACHE_NAME = 'greenbite-dynamic-v1.0.1';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/recipes.html',
    '/calculator.html',
    '/workout.html',
    '/mindfulness.html',
    '/contact.html',
    '/css/global.css',
    '/css/home.css',
    '/css/recipes.css',
    '/css/calculator.css',
    '/css/workout.css',
    '/css/mindfulness.css',
    '/css/contact.css',
    '/js/global.js',
    '/js/home.js',
    '/js/recipes.js',
    '/js/calculator.js',
    '/js/workout.js',
    '/js/mindfulness.js',
    '/js/contact.js',
    '/data/recipes.js',
    '/manifest.json',
    '/favicon.svg',
    '/sounds/Rain.wav',
    '/sounds/Ocean.wav',
    '/sounds/Forest.wav',
    '/sounds/Birds.mp3',
    '/sounds/White%20Noise.mp3',
    '/CREDITS.txt'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                // Cache files individually to handle failures gracefully
                return Promise.allSettled(
                    STATIC_FILES.map(url =>
                        cache.add(url).catch(err => {
                            console.warn(`Service Worker: Failed to cache ${url}:`, err);
                            return null;
                        })
                    )
                );
            })
            .then(() => {
                console.log('Service Worker: Static files cached (with some possible failures)');
                return self.skipWaiting();
            })
            .catch(err => {
                console.error('Service Worker: Error during installation', err);
            })
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');

    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE_NAME &&
                            cacheName !== DYNAMIC_CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Old caches cleaned up');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve cached files
self.addEventListener('fetch', event => {
    const { request } = event;

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip Chrome extension requests and other non-http(s) requests
    if (request.url.startsWith('chrome-extension://') ||
        request.url.startsWith('moz-extension://') ||
        request.url.startsWith('safari-extension://') ||
        !request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                // Return cached version if available
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Otherwise fetch from network
                return fetch(request)
                    .then(response => {
                        // Don't cache non-successful responses or opaque responses
                        if (!response || response.status !== 200) {
                            return response;
                        }

                        // Only cache same-origin requests or CORS-enabled requests
                        if (response.type !== 'basic' && response.type !== 'cors') {
                            return response;
                        }

                        // Clone response for caching
                        const responseToCache = response.clone();

                        // Cache dynamic content
                        caches.open(DYNAMIC_CACHE_NAME)
                            .then(cache => {
                                // Only cache certain file types
                                if (shouldCacheRequest(request.url)) {
                                    cache.put(request, responseToCache).catch(err => {
                                        console.warn('Service Worker: Failed to cache', request.url, err);
                                    });
                                }
                            })
                            .catch(err => {
                                console.warn('Service Worker: Failed to open dynamic cache', err);
                            });

                        return response;
                    })
                    .catch(err => {
                        console.log('Service Worker: Fetch failed, trying offline fallback');

                        // Provide offline fallback for HTML pages
                        if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html').then(fallback => {
                                return fallback || new Response('Offline - Please check your connection', {
                                    status: 503,
                                    statusText: 'Service Unavailable'
                                });
                            });
                        }

                        // Provide offline fallback for images
                        if (request.headers.get('accept') && request.headers.get('accept').includes('image')) {
                            return new Response(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
                                    <rect width="200" height="200" fill="#f0f0f0"/>
                                    <text x="100" y="100" text-anchor="middle" dominant-baseline="middle" fill="#666" font-family="Arial, sans-serif" font-size="14">
                                        Image unavailable offline
                                    </text>
                                </svg>
                            `, {
                                headers: { 'Content-Type': 'image/svg+xml' }
                            });
                        }

                        // For other requests, just throw the error
                        throw err;
                    });
            })
            .catch(err => {
                console.error('Service Worker: Cache match failed', err);
                return new Response('Service Worker Error', {
                    status: 500,
                    statusText: 'Internal Server Error'
                });
            })
    );
});

// Helper function to determine if request should be cached
function shouldCacheRequest(url) {
    // Cache images, fonts, audio, and API responses
    const cacheableTypes = [
        '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp',
        '.woff', '.woff2', '.ttf', '.otf',
        '.css', '.js', '.json', '.txt',
        '.mp3', '.wav', '.ogg', '.m4a'
    ];

    return cacheableTypes.some(type => url.includes(type)) ||
        url.includes('api') ||
        url.includes('fonts.googleapis.com');
}

// Background sync for form submissions
self.addEventListener('sync', event => {
    console.log('Service Worker: Background sync triggered', event.tag);

    if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForms());
    } else if (event.tag === 'newsletter-sync') {
        event.waitUntil(syncNewsletterSignups());
    }
});

// Sync contact form submissions
async function syncContactForms() {
    try {
        // Get pending form submissions from IndexedDB or localStorage
        const pendingForms = JSON.parse(localStorage.getItem('pendingContactForms') || '[]');

        for (const formData of pendingForms) {
            try {
                // Simulate API submission
                console.log('Service Worker: Syncing contact form', formData);

                // In a real app, this would be an actual API call
                // await fetch('/api/contact', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(formData)
                // });

                // Remove from pending list after successful sync
                const updatedPending = pendingForms.filter(form => form.id !== formData.id);
                localStorage.setItem('pendingContactForms', JSON.stringify(updatedPending));

                console.log('Service Worker: Contact form synced successfully');
            } catch (error) {
                console.error('Service Worker: Failed to sync contact form', error);
            }
        }
    } catch (error) {
        console.error('Service Worker: Error in syncContactForms', error);
    }
}

// Sync newsletter signups
async function syncNewsletterSignups() {
    try {
        const pendingSignups = JSON.parse(localStorage.getItem('pendingNewsletterSignups') || '[]');

        for (const signup of pendingSignups) {
            try {
                console.log('Service Worker: Syncing newsletter signup', signup);

                // In a real app, this would be an actual API call
                // await fetch('/api/newsletter/subscribe', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(signup)
                // });

                const updatedPending = pendingSignups.filter(s => s.id !== signup.id);
                localStorage.setItem('pendingNewsletterSignups', JSON.stringify(updatedPending));

                console.log('Service Worker: Newsletter signup synced successfully');
            } catch (error) {
                console.error('Service Worker: Failed to sync newsletter signup', error);
            }
        }
    } catch (error) {
        console.error('Service Worker: Error in syncNewsletterSignups', error);
    }
}

// Push notification handling
self.addEventListener('push', event => {
    console.log('Service Worker: Push notification received');

    const options = {
        body: 'Stay consistent with your health journey!',
        icon: '/favicon.svg', // Use SVG favicon
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Explore App'
            },
            {
                action: 'close',
                title: 'Close'
            }
        ],
        requireInteraction: false, // Don't require interaction to avoid issues
        tag: 'greenbite-reminder'
    };

    let title = 'GreenBite';

    if (event.data) {
        try {
            const payload = event.data.json();
            options.body = payload.body || options.body;
            title = payload.title || title;
        } catch (err) {
            console.warn('Service Worker: Failed to parse push data', err);
        }
    }

    event.waitUntil(
        self.registration.showNotification(title, options).catch(err => {
            console.error('Service Worker: Failed to show notification', err);
        })
    );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification clicked', event);

    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'close') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.matchAll()
                .then(clientList => {
                    if (clientList.length > 0) {
                        return clientList[0].focus();
                    }
                    return clients.openWindow('/');
                })
        );
    }
});

// Message handling for communication with main thread
self.addEventListener('message', event => {
    console.log('Service Worker: Message received', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'GET_CACHE_SIZE') {
        getCacheSize().then(size => {
            event.ports[0].postMessage({ cacheSize: size });
        });
    }
});

// Helper function to get cache size
async function getCacheSize() {
    try {
        const cacheNames = await caches.keys();
        let totalSize = 0;

        for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();

            for (const request of requests) {
                const response = await cache.match(request);
                if (response) {
                    const blob = await response.blob();
                    totalSize += blob.size;
                }
            }
        }

        return Math.round(totalSize / 1024 / 1024 * 100) / 100; // MB
    } catch (error) {
        console.error('Service Worker: Error calculating cache size', error);
        return 0;
    }
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', event => {
    console.log('Service Worker: Periodic sync triggered', event.tag);

    if (event.tag === 'daily-health-tip') {
        event.waitUntil(updateDailyHealthTip());
    }
});

async function updateDailyHealthTip() {
    try {
        // In a real app, this might fetch new tips from an API
        console.log('Service Worker: Updating daily health tip');

        // Show notification with new tip
        const tips = [
            'Remember to stay hydrated throughout the day!',
            'Take a 5-minute walk to boost your energy.',
            'Practice deep breathing to reduce stress.',
            'Eat a colorful variety of fruits and vegetables.',
            'Get 7-9 hours of quality sleep tonight.'
        ];

        const randomTip = tips[Math.floor(Math.random() * tips.length)];

        await self.registration.showNotification('Daily Health Tip', {
            body: randomTip,
            icon: '/favicon.svg',
            tag: 'daily-tip'
        }).catch(err => {
            console.error('Service Worker: Failed to show daily tip notification', err);
        });
    } catch (error) {
        console.error('Service Worker: Error updating daily health tip', error);
    }
}

// Global error handler for service worker
self.addEventListener('error', event => {
    console.error('Service Worker: Global error', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('Service Worker: Unhandled promise rejection', event.reason);
    event.preventDefault();
});

console.log('Service Worker: Loaded successfully');