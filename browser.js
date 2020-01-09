'use strict';

(function (document, window) {
    if (!window.opener) {
        return;
    }

    let origin;

    try {
        origin = window.opener.origin || window.opener.location.origin;
    } catch (e) {
        document.body.innerHTML = 'Access denied';
        setTimeout(window.close, 3000);
        return;
    }

    function getUrl(url) {
        const a = document.createElement('a');
        a.href = url;

        return a.origin === origin ? a.pathname : a.href;
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Block
        document.querySelectorAll('body > section[data-block]').forEach(item => item.addEventListener('click', () => {
            const id = item.getAttribute('data-block');
            item.removeAttribute('data-block');
            window.opener.postMessage({id: id, content: item.outerHTML}, origin);
        }));

        // Media
        document.querySelectorAll('body > figure > audio, body > figure > iframe, body > figure > img, body > figure > video').forEach(media => {
            const figure = media.closest('figure');
            const caption = figure.querySelector(':scope > figcaption');
            const tag = media.tagName.toLowerCase();
            const type = tag === 'img' ? 'image' : tag;
            const msg = {
                alt: media.getAttribute('alt'),
                caption: caption ? caption.innerHTML : null,
                src: getUrl(media.src),
                type: type
            };
           figure.addEventListener('click', () => window.opener.postMessage(msg, origin));

           if (window.location.hash && window.location.hash !== `#${type}`) {
               figure.parentElement.removeChild(figure);
           }
        });
    });
})(document, window);
