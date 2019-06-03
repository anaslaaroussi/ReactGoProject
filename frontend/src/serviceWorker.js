import axios from "axios";
// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://bit.ly/CRA-PWA

var our_db;
var CACHE_NAME = "offline-form";

// function openDatabase() {
//   var indexedDBOpenRequest = indexedDB.open("form", 3);
//   indexedDBOpenRequest.onerror = function(error) {
//     // error creating db
//     console.error("IndexedDB error:", error);
//   };
//   indexedDBOpenRequest.onupgradeneeded = function() {
//     // This should only executes if there's a need to
//     // create/update db.
//     this.result.createObjectStore("post_requests", {
//       autoIncrement: true,
//       keyPath: "id"
//     });
//   };
//   // This will execute each time the database is opened.
//   indexedDBOpenRequest.onsuccess = function() {
//     console.log(this.result);
//     our_db = this.result;
//   };
// }

function sendPostToServer() {
  var savedRequests = [];
  var req = getObjectStore(FOLDER_NAME).openCursor(); // FOLDERNAME
  // is 'post_requests'
  req.onsuccess = async function(event) {
    var cursor = event.target.result;
    if (cursor) {
      // Keep moving the cursor forward and collecting saved
      // requests.
      savedRequests.push(cursor.value);
      cursor.continue();
    } else {
      // At this point, we have collected all the post requests in
      // indexedb.
      for (let savedRequest of savedRequests) {
        // send them to the server one after the other
        console.log("saved request", savedRequest);
        var requestUrl = savedRequest.url;
        var payload = JSON.stringify(savedRequest.payload);
        var method = savedRequest.method;
        var headers = {
          Accept: "application/json",
          "Content-Type": "application/json"
        }; // if you have any other headers put them here
        fetch(requestUrl, {
          headers: headers,
          method: method,
          body: payload
        })
          .then(function(response) {
            console.log("server response", response);
            if (response.status < 400) {
              // If sending the POST request was successful, then
              // remove it from the IndexedDB.
              getObjectStore(FOLDER_NAME, "readwrite").delete(savedRequest.id);
            }
          })
          .catch(function(error) {
            // This will be triggered if the network is still down.
            // The request will be replayed again
            // the next time the service worker starts up.
            console.error("Send to Server failed:", error);
            // since we are in a catch, it is important an error is
            //thrown,so the background sync knows to keep retrying
            // the send to server
            throw error;
          });
      }
    }
  };
}

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

const FOLDER_NAME = "post_request";
let form_data;

function getObjectStore(storeName, mode) {
  // retrieve our object store
  return our_db.transaction(storeName, mode).objectStore(storeName);
}
function savePostRequests(url, payload) {
  // get object_store and save our payload inside it
  var request = getObjectStore(FOLDER_NAME, "readwrite").add({
    url: url,
    payload: payload,
    method: "PUT"
  });
  request.onsuccess = function(event) {
    console.log("a new pos_ request has been added to indexedb");
  };
  request.onerror = function(error) {
    console.error(error);
  };
}

export function register(config) {
  // openDatabase();

  window.addEventListener("install", function(event) {
    // install file needed offline
    event.waitUntil(
      caches.open(CACHE_NAME).then(function(cache) {
        console.log("Opened cache");
        return;
        // return cache.addAll(urlsToCache);
      })
    );
  });

  window.addEventListener("activate", event => {
    window.clients.claim();
    console.log("Ready!");
  });

  function sendPutToServer() {
    let puts = JSON.parse(sessionStorage.getItem("puts"));

    puts.map(put => {
      console.log(put);
      axios
        .put(put.url, put.payload)
        .then(res => console.log(res))
        .catch(e => console.log(e));
    });
  }

  window.addEventListener("online", function(event) {
    console.log("now online");

    sendPutToServer();
  });

  navigator.serviceWorker.ready
    .then(function(registration) {
      console.log("Service Worker Ready");
      return registration.sync.register("sendFormData");
    })
    .then(function() {
      console.log("sync event registered");
    })
    .catch(function() {
      // system was unable to register for a sync,
      // this could be an OS-level restriction
      console.log("sync registration failed");
    });

  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener("fetch", function(event) {
      // every request from our site, passes through the fetch handler
      // I have proof
      console.log("I am a request with url: ", event.request.clone().url);
      console.log(event.request);
      if (event.request.clone().method === "GET") {
        event.respondWith(
          // check all the caches in the browser and find
          // out whether our request is in any of them
          caches.match(event.request.clone()).then(function(response) {
            if (response) {
              // if we are here, that means there's a match
              //return the response stored in browser
              return response;
            }
            // no match in cache, use the network instead
            return fetch(event.request.clone());
          })
        );
      } else if (event.request.clone().method === "PUT") {
        // attempt to send request normally
        event.respondWith(
          fetch(event.request.clone()).catch(function(error) {
            // only save post requests in browser, if an error occurs
            form_data = localStorage.getItem("form_data");
            savePostRequests(event.request.clone().url, form_data);
          })
        );
      }
    });

    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            "This web app is being served cache-first by a service " +
              "worker. To learn more, visit https://bit.ly/CRA-PWA"
          );
        });
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      window.addEventListener("message", function(event) {
        console.log("ff");
        console.log("form data", event.data);
        if (event.data.hasOwnProperty("form_data")) {
          // receives form data from script.js upon submission
          form_data = event.data.form_data;
        }
      });

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                "New content is available and will be used when all " +
                  "tabs for this page are closed. See https://bit.ly/CRA-PWA."
              );

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log("Content is cached for offline use.");

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error("Error during service worker registration:", error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl)
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get("content-type");
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    });
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
