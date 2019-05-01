!(function(e) {
  var t = {};
  function n(o) {
    if (t[o]) return t[o].exports;
    var a = (t[o] = { i: o, l: !1, exports: {} });
    return e[o].call(a.exports, a, a.exports, n), (a.l = !0), a.exports;
  }
  (n.m = e),
    (n.c = t),
    (n.d = function(e, t, o) {
      n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: o });
    }),
    (n.r = function(e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (n.t = function(e, t) {
      if ((1 & t && (e = n(e)), 8 & t)) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var o = Object.create(null);
      if (
        (n.r(o),
        Object.defineProperty(o, "default", { enumerable: !0, value: e }),
        2 & t && "string" != typeof e)
      )
        for (var a in e)
          n.d(
            o,
            a,
            function(t) {
              return e[t];
            }.bind(null, a)
          );
      return o;
    }),
    (n.n = function(e) {
      var t =
        e && e.__esModule
          ? function() {
              return e.default;
            }
          : function() {
              return e;
            };
      return n.d(t, "a", t), t;
    }),
    (n.o = function(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (n.p = ""),
    n((n.s = 1));
})([
  function(e, t, n) {},
  function(e, t, n) {
    "use strict";
    n.r(t);
    const o = {
      center: { lat: 51.515419, lng: -0.141099 },
      mapTypeControl: !1,
      gestureHandling: "greedy",
      zoom: 12
    };
    let a = {
      yourLocation: { coordinates: null, ref: null, marker: null },
      theirLocation: { coordinates: null, ref: null, marker: null }
    };
    const r = new Promise(e => {
      navigator.geolocation
        ? navigator.geolocation.getCurrentPosition(
            t => {
              const n = { lat: t.coords.latitude, lng: t.coords.longitude },
                o = new google.maps.Circle({
                  center: n,
                  radius: t.coords.accuracy
                }).getBounds();
              w(n), e(o);
            },
            () => {
              e(null);
            }
          )
        : e(null);
    });
    function i({ inputId: e, bounds: t }) {
      let n = new google.maps.places.Autocomplete(document.getElementById(e), {
        bounds: t,
        types: ["geocode"]
      });
      return (
        n.setFields(["geometry"]),
        n.addListener("place_changed", () =>
          (function(e) {
            let t, n;
            const o = a[e].ref.getPlace().geometry.location,
              r = { lat: o.lat(), lng: o.lng() };
            "yourLocation" === e
              ? ((t = "Your Location"), (n = "purple"))
              : ((t = "Their Location"), (n = "pink")),
              (a[e].coordinates = r),
              a[e].marker && a[e].marker.setMap(null),
              (a[e].marker = S(r, { title: t, markerColour: n }));
          })(e)
        ),
        n
      );
    }
    const l = document.querySelector(".places"),
      c = document.querySelector(".locations"),
      s = document.getElementById("locations-form"),
      u = document.getElementById("meet"),
      d = document.querySelector(".search-again");
    let p = { placesShown: !1 };
    function m() {
      p.placesShown
        ? (c.classList.remove("locations--hide"),
          l.classList.remove("places--show"),
          (p.placesShown = !1),
          L.forEach(e => {
            e.setMap(null);
          }),
          s.reset())
        : (c.classList.add("locations--hide"),
          l.classList.add("places--show"),
          (p.placesShown = !0));
    }
    u.addEventListener("click", function() {
      let e = new google.maps.LatLngBounds();
      for (let t in a) e.extend(a[t].coordinates);
      !(function(e) {
        const t = e.getCenter(),
          n = S(t, {
            recenter: !1,
            animation: "BOUNCE",
            title: "The middle!",
            markerColour: "blue"
          });
        y.fitBounds(e),
          (function(e, { type: t = "restaurant" } = {}) {
            const n = { location: e, radius: "500", type: t };
            g.nearbySearch(n, (e, t) => {
              t == google.maps.places.PlacesServiceStatus.OK && b(e);
            });
          })(t),
          setTimeout(() => {
            n.setAnimation(null);
          }, 3e3);
      })(e);
    }),
      d.addEventListener("click", m);
    let g,
      f,
      y,
      h = {};
    function v(e) {
      const t = e.target.parentNode.dataset.id;
      if ((f && f.setAnimation(null), t)) {
        const e = h[t];
        (f = e),
          e.setAnimation(google.maps.Animation.BOUNCE),
          w(e.position, { pan: !0 });
      }
    }
    function b(e) {
      e
        .sort((e, t) => t.rating - e.rating)
        .forEach(e => {
          const t = S(e.geometry.location, { title: e.name });
          l.insertAdjacentHTML(
            "beforeend",
            (function(e) {
              return `\n    <div class="place" data-id="${
                e.id
              }">\n      ${(function(e) {
                if (e)
                  return e.photos && e.photos[0].getUrl
                    ? `<div class="place__image" style="background-image: url(${e.photos[0].getUrl(
                        { maxWidth: 512 }
                      )})"></div>`
                    : '<div class="place__image"><p>No image found</p></div>';
              })(e)}\n\n      <h3 class="place__title">${
                e.name
              }</h3>\n      <p class="place__address">${
                e.vicinity
              }</p>\n      <p>Rating: ${e.rating}</p>\n    </div>\n  `;
            })(e)
          ),
            (h[e.id] = t);
        }),
        l.addEventListener("click", v),
        m();
    }
    let L = [];
    function S(
      e,
      {
        recenter: t = !0,
        animation: n = "DROP",
        title: o = "Location",
        markerColour: a = "red"
      } = {}
    ) {
      const r = `https://maps.google.com/mapfiles/ms/icons/${a}-dot.png`,
        i = new google.maps.Marker({
          position: e,
          map: y,
          animation: google.maps.Animation[n],
          title: o,
          icon: { url: r }
        });
      return t && y.setOptions({ center: e, zoom: 15 }), L.push(i), i;
    }
    function w(e, { pan: t = !1 } = {}) {
      if (t) return y.panTo(e);
      y.setCenter(e);
    }
    n(0);
    const _ = (y = new google.maps.Map(document.getElementById("map"), o));
    !(async function() {
      const e = await r;
      (a.yourLocation.ref = i({ inputId: "yourLocation", bounds: e })),
        (a.theirLocation.ref = i({ inputId: "theirLocation", bounds: e }));
    })(),
      (function(e) {
        g = new google.maps.places.PlacesService(e);
      })(_);
  }
]);
