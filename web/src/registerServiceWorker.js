export default function registerServiceWorker() {
    const { serviceWorker } = navigator;

    if (!serviceWorker) {
        return;
    }

    serviceWorker
        .register('./serviceWorker.js', { scope: '/' })
        .then(() => { window.console.log('Service Worker Registered'); })
        .catch((err) => {
            window.console.warn(`Error registering Service Worker: ${err}`);
        });

    serviceWorker
        .ready
        .then(() => { window.console.log('Service Worker Ready'); });
}
