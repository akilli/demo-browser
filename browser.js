'use strict';

(function (document, window) {
    if (!window.opener) {
        console.error('window.opener undefined');
        return;
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Block
        document.querySelectorAll('body > section[data-block]').forEach(item => item.addEventListener('click', () => {
            const id = item.getAttribute('data-block');
            item.removeAttribute('data-block');
            window.opener.postMessage({id: id, content: item.outerHTML}, "*");
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
                src: media.src,
                type: type
            };
           figure.addEventListener('click', () => window.opener.postMessage(msg, "*"));

           if (window.location.hash && window.location.hash !== `#${type}`) {
               figure.parentElement.removeChild(figure);
           }
        });
    });
})(document, window);
