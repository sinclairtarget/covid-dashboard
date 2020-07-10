// Attempts to fetch json file. Parses JSON before handing it back.
export function json(path) {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open('GET', path, true);

    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        let resp = request.responseText;
        let jsonObj = JSON.parse(resp);
        resolve(jsonObj);
      }
      else {
        let err = `Request for ${path} failed with status: ${request.status}.`;
        reject(err);
      }
    };

    request.onerror = () => {
      let err = `Request for ${path} failed before reaching server.`;
      reject(err);
    };

    request.send();
  });
}
