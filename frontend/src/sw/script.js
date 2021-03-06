if ("serviceWorker" in navigator) {
  // we are checking here to see if the browser supports the service worker api
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("/sw.js").then(
      function(registration) {
        // Registration was successful
        console.log(
          "Service Worker registration was successful with scope: ",
          registration.scope
        );
      },
      function(err) {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err);
      }
    );

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
  });
}
