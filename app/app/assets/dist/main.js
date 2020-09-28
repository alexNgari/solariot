/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./app/main.js","vendors~main"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/components/alert.js":
/*!*********************************!*\
  !*** ./app/components/alert.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store */ \"./app/store.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  data() {\n    return {\n      alert: _store__WEBPACK_IMPORTED_MODULE_0__[\"default\"].alert\n    };\n  },\n\n  render() {\n    const h = arguments[0];\n    return h(\"div\", {\n      \"class\": \"fixed-top pt-3\",\n      style: \"z-index:30000\"\n    }, [h(\"div\", {\n      \"class\": \"row\"\n    }, [h(\"div\", {\n      \"class\": \"col-md-6 ml-auto mr-auto\"\n    }, [h(\"span\", {\n      \"class\": \"d-none\"\n    }, [this.$data.alert.count]), Object.keys(this.$data.alert.alerts).map(k => {\n      const {\n        strong,\n        message\n      } = this.$data.alert.alerts[k];\n      return h(\"div\", {\n        \"class\": \"alert alert-warning alert-dismissible fade show\",\n        attrs: {\n          role: \"alert\"\n        }\n      }, [h(\"strong\", [strong]), message, h(\"button\", {\n        attrs: {\n          type: \"button\",\n          \"aria-label\": \"Close\"\n        },\n        \"class\": \"close\",\n        on: {\n          \"click\": () => _store__WEBPACK_IMPORTED_MODULE_0__[\"default\"].clearAlert(k)\n        }\n      }, [h(\"span\", {\n        attrs: {\n          \"aria-hidden\": \"true\"\n        }\n      }, [\"\\xD7\"])])]);\n    })])])]);\n  }\n\n});\n\n//# sourceURL=webpack:///./app/components/alert.js?");

/***/ }),

/***/ "./app/components/homePage.js":
/*!************************************!*\
  !*** ./app/components/homePage.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store */ \"./app/store.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ \"./app/utils.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ \"./node_modules/axios/index.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  data() {\n    return {\n      search: '',\n      updates: _store__WEBPACK_IMPORTED_MODULE_0__[\"default\"].updates\n    };\n  },\n\n  render() {\n    const h = arguments[0];\n    return h(\"div\", [h(\"div\", {\n      \"class\": \"row\"\n    }, [h(\"div\", {\n      \"class\": \"col-sm-4\"\n    }, [h(\"div\", {\n      \"class\": \"card mt-4\"\n    }, [h(\"div\", {\n      \"class\": \"card-body\"\n    }, [h(\"h5\", {\n      \"class\": \"card-title\"\n    }, [\"Temperature\"]), h(\"p\", {\n      \"class\": \"card-text metric-value\"\n    }, [this.$data.updates.stats.Temp, \"C\"]), h(\"a\", {\n      attrs: {\n        href: \"#\"\n      },\n      \"class\": \"btn btn-primary\"\n    }, [\"View history\"]), h(\"div\", {\n      on: {\n        \"click\": this.onHeaterToggle\n      },\n      \"class\": \"btn btn-secondary\"\n    }, [\"Turn \", this.$data.updates.heater ? 'Off' : 'On', \" Heater\"])])])]), h(\"div\", {\n      \"class\": \"col-sm-4\"\n    }, [h(\"div\", {\n      \"class\": \"card mt-4\"\n    }, [h(\"div\", {\n      \"class\": \"card-body\"\n    }, [h(\"h5\", {\n      \"class\": \"card-title\"\n    }, [\"Water Flow\"]), h(\"p\", {\n      \"class\": \"card-text metric-value\"\n    }, [this.$data.updates.stats.Flow, \"L in the last 5min\"]), h(\"a\", {\n      attrs: {\n        href: \"#\"\n      },\n      \"class\": \"btn btn-primary\"\n    }, [\"View history\"])])])]), h(\"div\", {\n      \"class\": \"col-sm-4\"\n    }, [h(\"div\", {\n      \"class\": \"card mt-4\"\n    }, [h(\"div\", {\n      \"class\": \"card-body\"\n    }, [h(\"h5\", {\n      \"class\": \"card-title\"\n    }, [\"Voltage\"]), h(\"p\", {\n      \"class\": \"card-text metric-value\"\n    }, [this.$data.updates.stats.V, \"V\"]), h(\"a\", {\n      attrs: {\n        href: \"#\"\n      },\n      \"class\": \"btn btn-primary\"\n    }, [\"View history\"])])])]), h(\"div\", {\n      \"class\": \"col-sm-4\"\n    }, [h(\"div\", {\n      \"class\": \"card mt-4\"\n    }, [h(\"div\", {\n      \"class\": \"card-body\"\n    }, [h(\"h5\", {\n      \"class\": \"card-title\"\n    }, [\"Current\"]), h(\"p\", {\n      \"class\": \"card-text metric-value\"\n    }, [this.$data.updates.stats.I, \"A\"]), h(\"a\", {\n      attrs: {\n        href: \"#\"\n      },\n      \"class\": \"btn btn-primary\"\n    }, [\"View history\"])])])]), h(\"div\", {\n      \"class\": \"col-sm-4\"\n    }, [h(\"div\", {\n      \"class\": \"card mt-4\"\n    }, [h(\"div\", {\n      \"class\": \"card-body\"\n    }, [h(\"h5\", {\n      \"class\": \"card-title\"\n    }, [\"Ampere hours\"]), h(\"p\", {\n      \"class\": \"card-text metric-value\"\n    }, [this.$data.updates.stats.AmpH, \"Ah\"]), h(\"a\", {\n      attrs: {\n        href: \"#\"\n      },\n      \"class\": \"btn btn-primary\"\n    }, [\"View history\"])])])]), h(\"div\", {\n      \"class\": \"col-sm-4\"\n    }, [h(\"div\", {\n      \"class\": \"card mt-4\"\n    }, [h(\"div\", {\n      \"class\": \"card-body\"\n    }, [h(\"h5\", {\n      \"class\": \"card-title\"\n    }, [\"Power\"]), h(\"p\", {\n      \"class\": \"card-text metric-value\"\n    }, [this.$data.updates.stats.P, \"W\"]), h(\"a\", {\n      attrs: {\n        href: \"#\"\n      },\n      \"class\": \"btn btn-primary\"\n    }, [\"View history\"])])])])])]);\n  },\n\n  methods: {\n    onHeaterToggle() {\n      _store__WEBPACK_IMPORTED_MODULE_0__[\"default\"].toggleHeater(!this.$data.updates.heater);\n      axios__WEBPACK_IMPORTED_MODULE_2___default.a.get('/ctrl/heater').then(response => {\n        console.log(response);\n      });\n    }\n\n  },\n\n  beforeCreate() {\n    _store__WEBPACK_IMPORTED_MODULE_0__[\"default\"].showToolbar(true);\n  }\n\n});\n\n//# sourceURL=webpack:///./app/components/homePage.js?");

/***/ }),

/***/ "./app/components/loadPage.js":
/*!************************************!*\
  !*** ./app/components/loadPage.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store */ \"./app/store.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  render() {\n    const h = arguments[0];\n    return h(\"div\", [h(\"div\", {\n      \"class\": \"py-5 text-center\"\n    }, [h(\"img\", {\n      \"class\": \"d-block mx-auto mb-4\",\n      attrs: {\n        src: \"/assets/img/ic_logo.png?v=1.1\",\n        width: \"72\",\n        height: \"72\"\n      }\n    }), h(\"h2\", [\"Welcome to your IoT dashboard\"])]), h(\"div\", {\n      \"class\": \"row\"\n    }, [h(\"div\", {\n      \"class\": \"mr-auto ml-auto d-flex\"\n    }, [h(\"img\", {\n      \"class\": \"mr-2\",\n      attrs: {\n        src: \"/assets/img/loading.gif\",\n        height: \"48px\",\n        width: \"48px\"\n      }\n    }), h(\"h3\", [\"Loading\"])])])]);\n  },\n\n  beforeCreate() {\n    _store__WEBPACK_IMPORTED_MODULE_0__[\"default\"].showToolbar(false);\n  }\n\n});\n\n//# sourceURL=webpack:///./app/components/loadPage.js?");

/***/ }),

/***/ "./app/components/loginPage.js":
/*!*************************************!*\
  !*** ./app/components/loginPage.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"./node_modules/axios/index.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../store */ \"./app/store.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ \"./app/utils.js\");\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  data() {\n    return {\n      loging: false,\n      remember: true,\n      e: {\n        un: '',\n        pwd: ''\n      }\n    };\n  },\n\n  render() {\n    const h = arguments[0];\n    const update = _utils__WEBPACK_IMPORTED_MODULE_2__[\"onUpdate\"].bind(this);\n    return h(\"div\", [h(\"div\", {\n      \"class\": \"py-5 text-center\"\n    }, [h(\"img\", {\n      \"class\": \"d-block mx-auto mb-4\",\n      attrs: {\n        src: \"/assets/img/ujuzi_icon_128.png?v=1.1\",\n        alt: \"\",\n        width: \"72\",\n        height: \"72\"\n      }\n    }), h(\"h2\", [\"Welcome\"]), h(\"p\", {\n      \"class\": \"lead\"\n    }, [\"Login to continue\"])]), h(\"div\", {\n      \"class\": \"row\"\n    }, [h(\"div\", {\n      \"class\": \"col-md-4 order-md-1 ml-auto mr-auto\"\n    }, [h(\"h4\", {\n      \"class\": \"mb-3\"\n    }, [\"Sign in\"]), h(\"form\", {\n      \"class\": \"needs-validation\",\n      attrs: {\n        novalidate: \"\"\n      }\n    }, [h(\"div\", {\n      \"class\": \"mb-3\"\n    }, [h(\"label\", {\n      attrs: {\n        \"for\": \"username\"\n      }\n    }, [\"Username\"]), h(\"div\", {\n      \"class\": \"input-group\"\n    }, [h(\"div\", {\n      \"class\": \"input-group-prepend\"\n    }, [h(\"span\", {\n      \"class\": \"input-group-text\"\n    }, [\"@\"])]), h(\"input\", {\n      attrs: {\n        type: \"text\",\n        id: \"username\",\n        placeholder: \"Username\"\n      },\n      \"class\": `form-control ${Object(_utils__WEBPACK_IMPORTED_MODULE_2__[\"empty\"])(this.$data.e.un) ? '' : 'is-invalid'}`,\n      on: {\n        \"input\": update\n      }\n    }), h(\"div\", {\n      \"class\": \"invalid-feedback\",\n      style: \"width: 100%;\"\n    }, [this.$data.e.un])])]), h(\"div\", {\n      \"class\": \"mb-3\"\n    }, [h(\"label\", {\n      attrs: {\n        \"for\": \"password\"\n      }\n    }, [\"Password\"]), h(\"input\", {\n      attrs: {\n        type: \"password\",\n        id: \"password\",\n        placeholder: \"Password\"\n      },\n      \"class\": `form-control ${Object(_utils__WEBPACK_IMPORTED_MODULE_2__[\"empty\"])(this.$data.e.pwd) ? '' : 'is-invalid'}`,\n      on: {\n        \"input\": update\n      }\n    }), h(\"div\", {\n      \"class\": \"invalid-feedback\"\n    }, [this.$data.e.pwd])]), h(\"div\", {\n      \"class\": \"custom-control custom-checkbox mb-3\"\n    }, [h(\"input\", {\n      attrs: {\n        type: \"checkbox\",\n        id: \"remember\"\n      },\n      \"class\": \"custom-control-input\",\n      domProps: {\n        \"checked\": this.$data.remember\n      },\n      on: {\n        \"click\": update\n      }\n    }), h(\"label\", {\n      \"class\": \"custom-control-label\",\n      attrs: {\n        \"for\": \"remember\"\n      }\n    }, [\"Remember me\"])]), h(\"div\", {\n      \"class\": `btn btn-primary btn-lg btn-block mb-3 d-flex justify-content-center align-items-center ${this.$data.loging ? 'loading' : ''}`,\n      attrs: {\n        id: \"loging\"\n      },\n      on: {\n        \"click\": e => _utils__WEBPACK_IMPORTED_MODULE_2__[\"load\"].bind(this)(e, this.onLogin)\n      }\n    }, [h(\"span\", [\"Sign In\"]), h(\"div\", {\n      \"class\": \"loader ml-2\"\n    })]), h(\"div\", {\n      \"class\": \"text-center mb-3\"\n    }, [\"OR\"]), h(\"router-link\", {\n      attrs: {\n        to: \"/register\"\n      }\n    }, [h(\"div\", {\n      \"class\": \"btn btn-light btn-block\"\n    }, [\"Register a new account\"])])])])])]);\n  },\n\n  beforeCreate() {\n    _store__WEBPACK_IMPORTED_MODULE_1__[\"default\"].showToolbar(false);\n  },\n\n  methods: {\n    onLogin() {\n      console.log('login');\n      const {\n        username,\n        password,\n        remember\n      } = this.$data;\n      let ok = true;\n      this.$data.e.un = '';\n      this.$data.e.pwd = '';\n\n      if (Object(_utils__WEBPACK_IMPORTED_MODULE_2__[\"empty\"])(username)) {\n        this.$data.e.un = 'Please enter your username';\n        ok = false;\n      }\n\n      if (Object(_utils__WEBPACK_IMPORTED_MODULE_2__[\"empty\"])(password)) {\n        this.$data.e.pwd = 'Please enter your password';\n        ok = false;\n      }\n\n      if (!ok) return;\n      const data = new URLSearchParams();\n      data.append('username', username);\n      data.append('password', password);\n      data.append('remember', remember);\n      axios__WEBPACK_IMPORTED_MODULE_0___default.a.post('/auth/login', data).then(resp => {\n        if (Object(_utils__WEBPACK_IMPORTED_MODULE_2__[\"empty\"])(resp.data.username)) {\n          const err = {\n            data: 'done'\n          };\n          throw err;\n        }\n\n        _store__WEBPACK_IMPORTED_MODULE_1__[\"default\"].setAuth(true, resp.data);\n        this.$router.replace('/');\n      }).catch(err => {\n        let message = 'Something broke when attempting to sign you in.';\n\n        switch (err.response.data.trim()) {\n          case 'no_user':\n            message = `Could not find user '${username}'.`;\n            break;\n\n          case 'wrong_password':\n            message = 'Wrong password.';\n            break;\n\n          default:\n            break;\n        }\n\n        _store__WEBPACK_IMPORTED_MODULE_1__[\"default\"].setAlert('Error! ', message, true);\n      });\n    }\n\n  }\n});\n\n//# sourceURL=webpack:///./app/components/loginPage.js?");

/***/ }),

/***/ "./app/components/registerPage.js":
/*!****************************************!*\
  !*** ./app/components/registerPage.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"./node_modules/axios/index.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../store */ \"./app/store.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ \"./app/utils.js\");\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  data() {\n    return {\n      registering: false,\n      remember: true,\n      e: {\n        un: '',\n        pwd: '',\n        re_pwd: ''\n      },\n      s: {}\n    };\n  },\n\n  render() {\n    const h = arguments[0];\n    return h(\"div\", [h(\"div\", {\n      \"class\": \"py-5 text-center\"\n    }, [h(\"img\", {\n      \"class\": \"d-block mx-auto mb-4\",\n      attrs: {\n        src: \"/assets/img/ujuzi_icon_128.png\",\n        alt: \"\",\n        width: \"72\",\n        height: \"72\"\n      }\n    }), h(\"h3\", [\"Create an Account\"])]), h(\"div\", {\n      \"class\": \"row\"\n    }, [h(\"div\", {\n      \"class\": \"col-md-4 mr-auto ml-auto\"\n    }, [h(\"h4\", {\n      \"class\": \"mb-3\"\n    }, [\"Credentials\"]), h(\"form\", {\n      \"class\": \"needs-validation\",\n      attrs: {\n        novalidate: \"\"\n      }\n    }, [h(\"div\", {\n      \"class\": \"mb-3\"\n    }, [h(\"label\", {\n      attrs: {\n        \"for\": \"username\"\n      }\n    }, [\"Username\"]), h(\"div\", {\n      \"class\": \"input-group\"\n    }, [h(\"div\", {\n      \"class\": \"input-group-prepend\"\n    }, [h(\"span\", {\n      \"class\": \"input-group-text\"\n    }, [\"@\"])]), h(\"input\", {\n      attrs: {\n        type: \"text\",\n        id: \"username\",\n        placeholder: \"Username\"\n      },\n      \"class\": `form-control ${Object(_utils__WEBPACK_IMPORTED_MODULE_2__[\"empty\"])(this.$data.e.un) ? '' : 'is-invalid'}`,\n      on: {\n        \"input\": e => this.onUpdate(e, this.checkUsername)\n      }\n    }), h(\"div\", {\n      \"class\": \"invalid-feedback\",\n      style: \"width: 100%;\"\n    }, [this.$data.e.un])])]), h(\"div\", {\n      \"class\": \"mb-3\"\n    }, [h(\"label\", {\n      attrs: {\n        \"for\": \"password\"\n      }\n    }, [\"Password\"]), h(\"input\", {\n      attrs: {\n        type: \"password\",\n        id: \"password\",\n        placeholder: \"Password\"\n      },\n      \"class\": `form-control ${Object(_utils__WEBPACK_IMPORTED_MODULE_2__[\"empty\"])(this.$data.e.pwd) ? '' : 'is-invalid'}`,\n      on: {\n        \"input\": this.onUpdate\n      }\n    }), h(\"div\", {\n      \"class\": \"invalid-feedback\"\n    }, [this.$data.e.pwd])]), h(\"div\", {\n      \"class\": \"mb-3\"\n    }, [h(\"label\", {\n      attrs: {\n        \"for\": \"re_password\"\n      }\n    }, [\"Retype Password\"]), h(\"input\", {\n      attrs: {\n        type: \"password\",\n        id: \"re_password\",\n        placeholder: \"Password\"\n      },\n      \"class\": `form-control ${Object(_utils__WEBPACK_IMPORTED_MODULE_2__[\"empty\"])(this.$data.e.re_pwd) ? '' : 'is-invalid'}`,\n      on: {\n        \"input\": this.onUpdate\n      }\n    }), h(\"div\", {\n      \"class\": \"invalid-feedback\"\n    }, [this.$data.e.re_pwd])]), h(\"div\", {\n      \"class\": \"custom-control custom-checkbox mb-3\"\n    }, [h(\"input\", {\n      attrs: {\n        type: \"checkbox\",\n        id: \"remember\"\n      },\n      \"class\": \"custom-control-input\",\n      domProps: {\n        \"checked\": this.$data.remember\n      },\n      on: {\n        \"click\": this.onUpdate\n      }\n    }), h(\"label\", {\n      \"class\": \"custom-control-label\",\n      attrs: {\n        \"for\": \"remember\"\n      }\n    }, [\"Remember me\"])]), h(\"div\", {\n      \"class\": `btn btn-primary btn-lg btn-block mb-3 d-flex justify-content-center align-items-center ${this.$data.registering ? 'loading' : ''}`,\n      attrs: {\n        id: \"registering\"\n      },\n      on: {\n        \"click\": e => _utils__WEBPACK_IMPORTED_MODULE_2__[\"load\"].bind(this)(e, this.onRegister)\n      }\n    }, [h(\"span\", [\"Register\"]), h(\"div\", {\n      \"class\": \"loader ml-2\"\n    })]), h(\"div\", {\n      \"class\": \"text-center mb-3\"\n    }, [\"OR\"]), h(\"router-link\", {\n      attrs: {\n        to: \"/login\"\n      }\n    }, [h(\"div\", {\n      \"class\": \"btn btn-light btn-block\"\n    }, [\"Sign in to my account\"])])])])])]);\n  },\n\n  beforeCreate() {\n    _store__WEBPACK_IMPORTED_MODULE_1__[\"default\"].showToolbar(false);\n  },\n\n  methods: {\n    /**\n     * @param {Event} e\n     * @param {Function} then\n     */\n    onUpdate(e, then = null) {\n      const {\n        id,\n        value\n      } = e.target;\n      this.$data[id] = value;\n      console.log(`update ${value}`);\n      if (then !== null) then();\n    },\n\n    onRegister() {\n      // verify inputs\n      console.log('test');\n      const {\n        username,\n        password,\n        re_password,\n        remember\n      } = this.$data;\n      let ok = true;\n      this.$data.e.pwd = '';\n      this.$data.e.re_pwd = '';\n\n      if (Object(_utils__WEBPACK_IMPORTED_MODULE_2__[\"empty\"])(username)) {\n        this.$data.e.un = 'Username is required';\n        ok = false;\n      }\n\n      if (Object(_utils__WEBPACK_IMPORTED_MODULE_2__[\"empty\"])(password)) {\n        this.$data.e.pwd = 'Password is required';\n        ok = false;\n      }\n\n      if (Object(_utils__WEBPACK_IMPORTED_MODULE_2__[\"empty\"])(re_password)) {\n        this.$data.e.re_pwd = 'Repeated password is required';\n        ok = false;\n      }\n\n      if (password !== re_password) {\n        this.$data.e.re_pwd = \"Passwords don't match\";\n        ok = false;\n      }\n\n      if (this.$data.s.un !== true) {\n        ok = false;\n      }\n\n      if (!ok) return;\n      this.$data.e.un = '';\n      console.log(name);\n      const self = this;\n      const data = new URLSearchParams();\n      data.append('username', username);\n      data.append('password', password);\n      data.append('remember', remember);\n      axios__WEBPACK_IMPORTED_MODULE_0___default.a.post('/auth/register', data).then(resp => {\n        if (Object(_utils__WEBPACK_IMPORTED_MODULE_2__[\"empty\"])(resp.data.username)) {\n          const err = {\n            data: 'done'\n          };\n          throw err;\n        }\n\n        _store__WEBPACK_IMPORTED_MODULE_1__[\"default\"].setAuth(true, resp.data);\n        this.$router.replace('/');\n      }).catch(err => {\n        _store__WEBPACK_IMPORTED_MODULE_1__[\"default\"].setAlert('Sorry! ', `An error occurred during registration. ${err.response.data}`, true);\n      });\n    },\n\n    checkUsername() {\n      this.$data.s.un = false;\n      clearTimeout(this.$data.delaySearchTimer);\n      this.$data.delaySearchTimer = setTimeout(() => {\n        const {\n          username\n        } = this.$data;\n        console.log(`check un ${username}`);\n        axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(`/auth/checkUsername/${username}`).then(response => {\n          console.log(response.data);\n\n          if (!response.data.available) {\n            this.$data.e.un = 'Username already taken';\n            this.$data.s.un = false;\n          } else {\n            this.$data.e.un = '';\n            this.$data.s.un = true;\n          }\n        }).catch(err => {\n          console.log(err);\n        });\n      }, 1000);\n    }\n\n  }\n});\n\n//# sourceURL=webpack:///./app/components/registerPage.js?");

/***/ }),

/***/ "./app/components/toolbar.js":
/*!***********************************!*\
  !*** ./app/components/toolbar.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"./node_modules/axios/index.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../store */ \"./app/store.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  data() {\n    return {\n      profile: _store__WEBPACK_IMPORTED_MODULE_1__[\"default\"].auth.profile,\n      modal: ''\n    };\n  },\n\n  render() {\n    const h = arguments[0];\n    return h(\"div\", {\n      \"class\": \"toolbar\"\n    }, [h(\"nav\", {\n      \"class\": \"navbar navbar-expand-md fixed-top navbar-dark bg-dark shadow-sm\"\n    }, [h(\"router-link\", {\n      attrs: {\n        to: \"/\"\n      },\n      \"class\": \"navbar-brand mr-3 mr-lg-4\"\n    }, [h(\"img\", {\n      attrs: {\n        src: \"/assets/img/logo.png\",\n        height: \"36px\",\n        width: \"36px\"\n      }\n    }), h(\"span\", {\n      \"class\": \"align-text-top\"\n    }, [\"Monitor\"])]), h(\"button\", {\n      \"class\": \"navbar-toggler p-0 border-0\",\n      attrs: {\n        type: \"button\",\n        \"data-toggle\": \"collapse\",\n        \"data-target\": \"#navbarSupportedContent\",\n        \"aria-controls\": \"navbarSupportedContent\"\n      }\n    }, [h(\"span\", {\n      \"class\": \"navbar-toggler-icon\"\n    })]), h(\"div\", {\n      \"class\": \"collapse navbar-collapse\",\n      attrs: {\n        id: \"navbarSupportedContent\"\n      }\n    }, [h(\"ul\", {\n      \"class\": \"navbar-nav mr-auto\"\n    }, [h(\"router-link\", {\n      attrs: {\n        to: \"/\",\n        tag: \"li\",\n        \"exact-active-class\": \"active\",\n        exact: true\n      },\n      \"class\": \"nav-item\"\n    }, [h(\"a\", {\n      attrs: {\n        href: \"#\"\n      },\n      \"class\": \"nav-link\"\n    }, [\"Home \", h(\"span\", {\n      \"class\": \"sr-only\"\n    }, [\"(current)\"])])])]), h(\"ul\", {\n      \"class\": \"navbar-nav ml-md-auto\"\n    }, [h(\"li\", {\n      \"class\": \"nav-item dropdown\"\n    }, [h(\"div\", {\n      \"class\": \"nav-link cursor-pointer d-flex\",\n      attrs: {\n        role: \"button\",\n        id: \"dropdownMenuLink\",\n        \"data-toggle\": \"dropdown\",\n        \"aria-haspopup\": \"true\",\n        \"aria-expanded\": \"false\"\n      }\n    }, [h(\"img\", {\n      attrs: {\n        src: \"/assets/img/ic_smiley_trans.png\",\n        width: \"32px\",\n        height: \"32px\"\n      },\n      \"class\": \"mr-2\",\n      style: \"background:grey; border-radius:5px\"\n    }), h(\"div\", {\n      \"class\": \"mt-auto mb-auto\"\n    }, [h(\"h6\", {\n      \"class\": \"my-0\"\n    }, [\"@\", this.$data.profile.username])])]), h(\"div\", {\n      \"class\": \"dropdown-menu dropdown-menu-right\",\n      attrs: {\n        \"aria-labelledby\": \"dropdownMenuLink\"\n      }\n    }, [h(\"a\", {\n      \"class\": \"dropdown-item\",\n      attrs: {\n        href: \"#\"\n      }\n    }, [\"Profile\"]), h(\"div\", {\n      \"class\": \"dropdown-divider\"\n    }), h(\"a\", {\n      \"class\": \"dropdown-item\",\n      attrs: {\n        href: \"#\"\n      },\n      on: {\n        \"click\": this.logout\n      }\n    }, [\"Sign out\"])])])])])])]);\n  },\n\n  methods: {\n    /**\n     * @param {Event} e\n     */\n    showModal(e) {\n      e.preventDefault();\n      const title = e.target.id;\n      this.$data.modal = title;\n      this.$root.$emit('showTopModal', title);\n    },\n\n    logout(e) {\n      e.preventDefault();\n      axios__WEBPACK_IMPORTED_MODULE_0___default.a.get('/auth/logout').then(() => window.location.replace('/')).catch(() => _store__WEBPACK_IMPORTED_MODULE_1__[\"default\"].setAlert('Error! ', 'Something went wrong when logging you out.'));\n    }\n\n  }\n});\n\n//# sourceURL=webpack:///./app/components/toolbar.js?");

/***/ }),

/***/ "./app/components/topModal.js":
/*!************************************!*\
  !*** ./app/components/topModal.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"./node_modules/axios/index.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../store */ \"./app/store.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ \"./app/utils.js\");\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  data() {\n    return {\n      lists: _store__WEBPACK_IMPORTED_MODULE_2__[\"default\"].lists,\n      loading: false,\n      title: ''\n    };\n  },\n\n  render() {\n    const h = arguments[0];\n    let items = '';\n    let actions = '';\n\n    switch (this.$data.title) {\n      case 'notifications':\n        items = this.$data.lists.notifications.map(v => {\n          if (!v.is_read) {\n            return h(\"a\", {\n              attrs: {\n                href: \"#\"\n              },\n              \"class\": \"list-group-item list-group-item-action\"\n            }, [h(\"strong\", [v.title, \".\"]), \" \", v.desc]);\n          }\n\n          return '';\n        });\n        actions = h(\"button\", {\n          attrs: {\n            type: \"button\"\n          },\n          \"class\": \"btn btn-outline-primary btn\"\n        }, [\"Mark all as read\"]);\n        break;\n\n      case 'projects':\n        items = this.$data.lists.projects.map(v => h(\"a\", {\n          attrs: {\n            href: \"#\"\n          },\n          \"class\": \"list-group-item list-group-item-action d-flex justify-content-between align-items-center\"\n        }, [h(\"span\", [v.Title, \" (\", h(\"strong\", [v.PID]), \")\"]), h(\"span\", {\n          \"class\": \"badge badge-secondary\"\n        }, [v.Version])]));\n        actions = h(\"button\", {\n          attrs: {\n            type: \"button\"\n          },\n          \"class\": \"btn btn-primary\",\n          on: {\n            \"click\": this.newProject\n          }\n        }, [\"New Project\"]);\n        break;\n\n      case 'teams':\n        items = this.$data.lists.teams.map(v => h(\"a\", {\n          attrs: {\n            href: \"#\"\n          },\n          \"class\": \"list-group-item list-group-item-action d-flex justify-content-between align-items-center\"\n        }, [h(\"span\", [v.Title]), h(\"span\", {\n          \"class\": \"badge badge-secondary\"\n        }, [v.Saved === 'true' ? '' : 'not saved'])]));\n        actions = h(\"button\", {\n          attrs: {\n            type: \"button\"\n          },\n          \"class\": \"btn btn-primary\"\n        }, [\"New Team\"]);\n        break;\n\n      default:\n        break;\n    }\n\n    const title = Object(_utils__WEBPACK_IMPORTED_MODULE_3__[\"uppercase\"])(this.$data.title);\n    return h(\"div\", {\n      \"class\": \"modal fade\",\n      attrs: {\n        id: \"topModal\",\n        tabindex: \"-1\",\n        role: \"dialog\",\n        \"aria-labelledby\": \"topModalTitle\",\n        \"aria-hidden\": \"true\"\n      },\n      ref: \"topModal\"\n    }, [h(\"div\", {\n      \"class\": \"modal-dialog\",\n      attrs: {\n        role: \"document\"\n      }\n    }, [h(\"div\", {\n      \"class\": \"modal-content\"\n    }, [h(\"div\", {\n      \"class\": \"modal-header\"\n    }, [h(\"h5\", {\n      \"class\": \"modal-title\",\n      attrs: {\n        id: \"topModalTitle\"\n      }\n    }, [title]), h(\"button\", {\n      attrs: {\n        type: \"button\",\n        \"data-dismiss\": \"modal\",\n        \"aria-label\": \"Close\"\n      },\n      \"class\": \"close\"\n    }, [h(\"span\", {\n      attrs: {\n        \"aria-hidden\": \"true\"\n      }\n    }, [\"\\xD7\"])])]), h(\"div\", {\n      \"class\": \"modal-body\"\n    }, [h(\"div\", {\n      \"class\": \"list-group\"\n    }, [this.$data.loading ? h(\"div\", {\n      \"class\": \"list-group-item d-flex justify-content-center\"\n    }, [h(\"img\", {\n      \"class\": \"mr-2\",\n      attrs: {\n        src: \"/assets/img/loading.gif\",\n        height: \"24px\",\n        width: \"24px\"\n      }\n    }), h(\"span\", {\n      \"class\": \"align-middle\"\n    }, [\"Loading\"])]) : '', items])]), h(\"div\", {\n      \"class\": \"modal-footer\"\n    }, [actions])])])]);\n  },\n\n  methods: {\n    showTopModal(title) {\n      jquery__WEBPACK_IMPORTED_MODULE_1___default()(this.$refs.topModal).modal('show');\n      this.$data.title = title;\n      console.log(title);\n\n      if (this.$data.lists[title].length === 0) {\n        this.$data.loading = true;\n        axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(`/${title}`).then(response => {\n          _store__WEBPACK_IMPORTED_MODULE_2__[\"default\"].setTopbarList(title, response.data);\n          this.$data.loading = false;\n        }).catch(err => {\n          _store__WEBPACK_IMPORTED_MODULE_2__[\"default\"].setAlert('Sorry! ', `Could not update ${title}. ${err.response.data}`);\n          this.$data.loading = false;\n        });\n      }\n    },\n\n    hideTopModal() {\n      jquery__WEBPACK_IMPORTED_MODULE_1___default()(this.$refs.topModal).modal('hide');\n    },\n\n    newProject(e) {\n      e.preventDefault();\n      this.hideTopModal();\n      this.$router.push('/projects/create');\n    }\n\n  },\n\n  mounted() {\n    this.$root.$on('showTopModal', this.showTopModal);\n  }\n\n});\n\n//# sourceURL=webpack:///./app/components/topModal.js?");

/***/ }),

/***/ "./app/main.js":
/*!*********************!*\
  !*** ./app/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bootstrap */ \"./node_modules/bootstrap/dist/js/bootstrap.js\");\n/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bootstrap__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var popper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! popper.js */ \"./node_modules/popper.js/dist/esm/popper.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! axios */ \"./node_modules/axios/index.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! socket.io-client */ \"./node_modules/socket.io-client/lib/index.js\");\n/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(socket_io_client__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm.js\");\n/* harmony import */ var vue_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! vue-router */ \"./node_modules/vue-router/dist/vue-router.esm.js\");\n/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./store */ \"./app/store.js\");\n/* harmony import */ var _components_toolbar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/toolbar */ \"./app/components/toolbar.js\");\n/* harmony import */ var _components_loginPage__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/loginPage */ \"./app/components/loginPage.js\");\n/* harmony import */ var _components_homePage__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/homePage */ \"./app/components/homePage.js\");\n/* harmony import */ var _components_loadPage__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/loadPage */ \"./app/components/loadPage.js\");\n/* harmony import */ var _components_registerPage__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/registerPage */ \"./app/components/registerPage.js\");\n/* harmony import */ var _components_alert__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/alert */ \"./app/components/alert.js\");\n/* harmony import */ var _components_topModal__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/topModal */ \"./app/components/topModal.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./utils */ \"./app/utils.js\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nvue__WEBPACK_IMPORTED_MODULE_5__[\"default\"].use(vue_router__WEBPACK_IMPORTED_MODULE_6__[\"default\"]);\nconst routes = [{\n  path: '/login',\n  name: 'login',\n  component: _components_loginPage__WEBPACK_IMPORTED_MODULE_9__[\"default\"]\n}, {\n  path: '/register',\n  name: 'register',\n  component: _components_registerPage__WEBPACK_IMPORTED_MODULE_12__[\"default\"]\n}, {\n  path: '/',\n  name: 'home',\n  component: _components_homePage__WEBPACK_IMPORTED_MODULE_10__[\"default\"]\n}, {\n  path: '/s',\n  name: 'wait',\n  component: _components_loadPage__WEBPACK_IMPORTED_MODULE_11__[\"default\"]\n}];\nconst router = new vue_router__WEBPACK_IMPORTED_MODULE_6__[\"default\"]({\n  mode: 'history',\n  routes,\n\n  scrollBehavior(to, from, savedPosition) {\n    if (savedPosition) {\n      return savedPosition;\n    }\n\n    return {\n      x: 0,\n      y: 0\n    };\n  }\n\n});\n\n(() => new vue__WEBPACK_IMPORTED_MODULE_5__[\"default\"]({\n  el: '#app',\n\n  data() {\n    return {\n      shared: _store__WEBPACK_IMPORTED_MODULE_7__[\"default\"]\n    };\n  },\n\n  render() {\n    const h = arguments[0];\n    return h(\"div\", [this.$data.shared.toolbar.visible ? h(\"toolbar\") : '', h(\"div\", {\n      \"class\": \"container\"\n    }, [h(\"router-view\")]), h(\"footer\", {\n      \"class\": \"my-5 pt-5 text-muted text-center text-small\"\n    }, [h(\"p\", {\n      \"class\": \"mb-1\"\n    }, [\"\\xA9 2019 Company\"]), h(\"ul\", {\n      \"class\": \"list-inline\"\n    }, [h(\"li\", {\n      \"class\": \"list-inline-item\"\n    }, [h(\"a\", {\n      attrs: {\n        href: \"#\"\n      }\n    }, [\"Privacy\"])]), h(\"li\", {\n      \"class\": \"list-inline-item\"\n    }, [h(\"a\", {\n      attrs: {\n        href: \"#\"\n      }\n    }, [\"Terms\"])]), h(\"li\", {\n      \"class\": \"list-inline-item\"\n    }, [h(\"a\", {\n      attrs: {\n        href: \"#\"\n      }\n    }, [\"Support\"])])])]), h(\"alert\"), h(\"topModal\")]);\n  },\n\n  router,\n  components: {\n    toolbar: _components_toolbar__WEBPACK_IMPORTED_MODULE_8__[\"default\"],\n    alert: _components_alert__WEBPACK_IMPORTED_MODULE_13__[\"default\"],\n    topModal: _components_topModal__WEBPACK_IMPORTED_MODULE_14__[\"default\"]\n  },\n\n  created() {\n    _store__WEBPACK_IMPORTED_MODULE_7__[\"default\"].socketio = socket_io_client__WEBPACK_IMPORTED_MODULE_4___default()();\n    axios__WEBPACK_IMPORTED_MODULE_3___default.a.defaults.headers.common['X-REQUESTED-WITH'] = 'XMLHttpRequest';\n    axios__WEBPACK_IMPORTED_MODULE_3___default.a.defaults.baseURL = '/api';\n    _store__WEBPACK_IMPORTED_MODULE_7__[\"default\"].socketio.on('connect', () => {\n      console.log('connected');\n    });\n    _store__WEBPACK_IMPORTED_MODULE_7__[\"default\"].socketio.on('error', error => {\n      console.log('socketio error: ' + error);\n    });\n    _store__WEBPACK_IMPORTED_MODULE_7__[\"default\"].socketio.on('disconnect', reason => {\n      console.log('socketio disconnect:' + reason);\n    });\n    setInterval(() => {\n      _store__WEBPACK_IMPORTED_MODULE_7__[\"default\"].socketio.emit('update_stats', JSON.stringify({\n        cID: 'ax'\n      }), resp => {\n        console.log(resp);\n        const data = JSON.parse(resp);\n        console.log(data);\n        _store__WEBPACK_IMPORTED_MODULE_7__[\"default\"].updateStats(data.message);\n      });\n    }, 10000); // const csrf = $('#app.CSRF').value;\n\n    const csrf = document.getElementById('app.CSRF').value;\n\n    if (csrf !== null || csrf !== undefined) {\n      console.log(`csrf: ${csrf}`);\n      axios__WEBPACK_IMPORTED_MODULE_3___default.a.defaults.headers.common['X-CSRF-Token'] = csrf;\n    } // attempt sign in\n\n\n    if (!_store__WEBPACK_IMPORTED_MODULE_7__[\"default\"].auth.isAuth) {\n      let {\n        path\n      } = this.$route;\n      console.log(`path: ${path}`);\n      this.$router.push({\n        name: 'wait'\n      });\n      axios__WEBPACK_IMPORTED_MODULE_3___default.a.get('/auth/remember').then(response => {\n        console.log(`status: ${response.status}, response: ${response.data} `);\n\n        if (Object(_utils__WEBPACK_IMPORTED_MODULE_15__[\"empty\"])(response.data.username)) {\n          const err = {\n            data: 'done'\n          };\n          throw err;\n        }\n\n        _store__WEBPACK_IMPORTED_MODULE_7__[\"default\"].setAuth(true, response.data);\n        if (path === '/login' || path === '/register') path = '/';\n        this.$router.replace(path);\n      }).catch(err => {\n        console.log(`err: ${err}`);\n        if (path === '/register') this.$router.replace('/register');else this.$router.replace('/login');\n      });\n    }\n  }\n\n}))();\n\n//# sourceURL=webpack:///./app/main.js?");

/***/ }),

/***/ "./app/store.js":
/*!**********************!*\
  !*** ./app/store.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  debug: true,\n  auth: {\n    isAuth: false,\n    profile: {}\n  },\n  toolbar: {\n    visible: false\n  },\n  sidebar: {\n    visible: false\n  },\n  theme: {\n    dark: false\n  },\n  alert: {\n    count: 0,\n    alerts: {}\n  },\n  lists: {\n    notifications: [],\n    projects: [],\n    teams: []\n  },\n  updates: {\n    stats: {\n      V: 0,\n      I: 0,\n      P: 0,\n      AmpH: 0,\n      Temp: 0,\n      Flow: 0\n    },\n    heater: true\n  },\n\n  setAuth(isAuth, profile) {\n    this.auth.isAuth = isAuth;\n    this.auth.profile = profile;\n  },\n\n  showToolbar(show) {\n    this.toolbar.visible = show;\n  },\n\n  showSidebar(show) {\n    this.sidebar.visible = show;\n  },\n\n  showDarkBg(bg) {\n    this.theme.dark = bg;\n  },\n\n  setAlert(strong, message, autoDismiss = true) {\n    const key = this.alert.count;\n    this.alert.alerts[key] = {\n      strong,\n      message\n    };\n\n    if (autoDismiss) {\n      setTimeout(() => this.clearAlert(key), 5000);\n    }\n\n    this.alert.count += 1;\n  },\n\n  clearAlert(key) {\n    delete this.alert.alerts[key];\n    this.alert.count += 1;\n  },\n\n  setTopbarList(title, list) {\n    this.lists[title] = list;\n  },\n\n  updateStats(stats) {\n    this.updates.stats = stats;\n  },\n\n  toggleHeater(status) {\n    this.updates.heater = status;\n  },\n\n  socketio: {}\n});\n\n//# sourceURL=webpack:///./app/store.js?");

/***/ }),

/***/ "./app/utils.js":
/*!**********************!*\
  !*** ./app/utils.js ***!
  \**********************/
/*! exports provided: empty, uppercase, onUpdate, arrayRemove, load */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"empty\", function() { return empty; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"uppercase\", function() { return uppercase; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"onUpdate\", function() { return onUpdate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"arrayRemove\", function() { return arrayRemove; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"load\", function() { return load; });\n/**\n * @param  {...String} str\n */\nfunction empty(...str) {\n  return str.some(e => e === undefined || e === null || e.trim() === '');\n}\n/**\n * @param {String} str\n */\n\nfunction uppercase(str) {\n  if (str.length < 1) return '';\n  return str.charAt(0).toUpperCase() + (str.length > 1 ? str.substring(1) : '');\n}\nfunction onUpdate(e, then = null) {\n  const {\n    id,\n    value,\n    checked,\n    name\n  } = e.target;\n  const ipType = e.target.getAttribute('type');\n\n  switch (ipType) {\n    case 'checkbox':\n      this.$data[id] = checked;\n      console.log(`update checked: ${checked}`);\n      break;\n\n    case 'radio':\n      this.$data[name] = id;\n      console.log(`update checked: ${id}`);\n      break;\n\n    default:\n      this.$data[id] = value;\n      console.log(`update ${value}`);\n      break;\n  }\n\n  if (then !== null) then();\n} // /**\n//  * @param {Object} obj\n//  * @param  {...String} exclude\n//  */\n// export function objToArray(obj, ...exclude) {\n//     const result = [];\n//     Object.keys(obj)\n//         .reduce((prev, key) => {\n//             if (!exclude.includes(key)) {\n//                 result.push(obj[key]);\n//             }\n//             return result;\n//         });\n// }\n\n/**\n * @param {Array} arr\n * @param  {...any} exclude\n * @returns {Array}\n */\n\nfunction arrayRemove(arr, ...exclude) {\n  exclude.forEach(key => {\n    const i = arr.indexOf(key);\n    if (i > -1) arr.splice(i, 1);\n  });\n  return arr;\n}\n/**\n * @param {Event} e\n * @param {function} fn\n */\n\nfunction load(e, fn) {\n  const {\n    id\n  } = e.target;\n  this.$data[id] = true;\n  fn();\n  this.$data[id] = false;\n}\n\n//# sourceURL=webpack:///./app/utils.js?");

/***/ }),

/***/ 0:
/*!********************!*\
  !*** ws (ignored) ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///ws_(ignored)?");

/***/ })

/******/ });