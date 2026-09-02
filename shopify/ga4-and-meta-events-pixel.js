// Paste into: Shopify Admin > Settings > Customer events > Add custom pixel
// Replace GA4_MEASUREMENT_ID with the real ID after creating the GA4 property.
// Meta Pixel ID below matches the one already firing on the storefront (3039733526418395).
// Custom pixels run in a sandboxed context with no access to the theme's existing
// fbq() calls, so this pixel loads its own copy of fbevents.js and re-inits the
// same pixel ID. The theme's existing base pixel snippet (PageView only) can stay,
// or be removed once this custom pixel is confirmed working in Meta Events Manager.

const GA4_MEASUREMENT_ID = 'G-REPLACE_ME';
const META_PIXEL_ID = '3039733526418395';

// --- load gtag.js ---
!function () {
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_MEASUREMENT_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA4_MEASUREMENT_ID, { send_page_view: false });
}();

// --- load Meta Pixel (fbevents.js) inside this sandbox ---
!function (f, b, e, v, n, t, s) {
  if (f.fbq) return;
  n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
  if (!f._fbq) f._fbq = n;
  n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
  t = b.createElement(e); t.async = !0; t.src = v;
  s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
}(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', META_PIXEL_ID);

analytics.subscribe('page_viewed', () => {
  gtag('event', 'page_view');
  fbq('track', 'PageView');
});

analytics.subscribe('product_viewed', (event) => {
  const p = event.data.productVariant;
  gtag('event', 'view_item', {
    currency: p.price.currencyCode,
    value: p.price.amount,
    items: [{ item_id: p.sku || p.id, item_name: p.product.title, price: p.price.amount }],
  });
  fbq('track', 'ViewContent', {
    content_ids: [p.id],
    content_name: p.product.title,
    value: p.price.amount,
    currency: p.price.currencyCode,
  });
});

analytics.subscribe('product_added_to_cart', (event) => {
  const line = event.data.cartLine;
  gtag('event', 'add_to_cart', {
    currency: line.merchandise.price.currencyCode,
    value: line.merchandise.price.amount * line.quantity,
    items: [{ item_id: line.merchandise.id, item_name: line.merchandise.product.title, quantity: line.quantity }],
  });
  fbq('track', 'AddToCart', {
    content_ids: [line.merchandise.id],
    content_name: line.merchandise.product.title,
    value: line.merchandise.price.amount * line.quantity,
    currency: line.merchandise.price.currencyCode,
  });
});

analytics.subscribe('checkout_started', (event) => {
  const checkout = event.data.checkout;
  gtag('event', 'begin_checkout', { currency: checkout.currencyCode, value: checkout.totalPrice.amount });
  fbq('track', 'InitiateCheckout', { value: checkout.totalPrice.amount, currency: checkout.currencyCode });
});

analytics.subscribe('checkout_completed', (event) => {
  const checkout = event.data.checkout;
  gtag('event', 'purchase', {
    transaction_id: checkout.order.id,
    currency: checkout.currencyCode,
    value: checkout.totalPrice.amount,
  });
  fbq('track', 'Purchase', { value: checkout.totalPrice.amount, currency: checkout.currencyCode });
});
