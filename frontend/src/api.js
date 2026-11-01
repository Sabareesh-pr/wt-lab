export function api(path, options = {}) {
 return fetch(`/api${path}`, {...options, credentials:'same-origin', headers:{'Content-Type':'application/json', ...options.headers}});
}
