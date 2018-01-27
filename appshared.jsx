var AppSharedData = ({shared}) => shared && <script dangerouslySetInnerHTML={{__html: 'window.__clientAppShared = ' + JSON.stringify(shared).replace(/</g, '\\u003c').replace(/-->/g, '--\\>').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029') + ';' + '(function() { if (typeof window != "undefined" && window.__clientAppShared && !window.appShared) window.appShared = window.__clientAppShared; })();'}}/>;

module.exports = AppSharedData;
