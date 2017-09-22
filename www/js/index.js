/*
 index.js
 Copyright 2015 AppFeel. All rights reserved.
 http://www.appfeel.com
 
 AdMobAds Cordova Plugin (cordova-admob)
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to
 deal in the Software without restriction, including without limitation the
 rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

var app = {
    // global vars
    autoShowInterstitial: false,
    progressDialog: document.getElementById("progressDialog"),
    spinner: document.getElementById("spinner"),
    weinre: {
        enabled: false,
        ip: '', // ex. http://192.168.1.13
        port: '', // ex. 9090
        targetApp: '' // ex. see weinre docs
    },

    // Application Constructor
    initialize: function () {
        if ((/(ipad|iphone|ipod|android)/i.test(navigator.userAgent))) {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        } else {
            app.onDeviceReady();
        }
    },
    // Must be called when deviceready is fired so AdMobAds plugin will be ready
    initAds: function () {
        var isAndroid = (/(android)/i.test(navigator.userAgent));
        var adPublisherIds = {
            ios: {
                banner: 'ca-app-pub-6737960893133782/5314695352',
                interstitial: 'ca-app-pub-6737960893133782/2330860555'
            },
            android: {
                banner: 'ca-app-pub-6737960893133782/5314695352',
                interstitial: 'ca-app-pub-6737960893133782/2330860555'
            }
        };
        var admobid;

        if (isAndroid) {
            admobid = adPublisherIds.android;
        } else {
            admobid = adPublisherIds.ios;
        }
        if (window.admob) {
            admob.setOptions({
                publisherId: admobid.banner,
                interstitialAdId: admobid.interstitial,
                bannerAtTop: false, // set to true, to put banner at top
                overlap: false, // set to true, to allow banner overlap webview
                offsetStatusBar: true, // set to true to avoid ios7 status bar overlap
                isTesting: true, // receiving test ads (do not test with real ads as your account will be banned)
                autoShowBanner: true, // auto show banners ad when loaded
                autoShowInterstitial: false // auto show interstitials ad when loaded
            });
        } else {
            //alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    // Bind Event Listeners
    bindAdEvents: function () {
        if (window.admob) {
            document.addEventListener("orientationchange", this.onOrientationChange, false);
            document.addEventListener(admob.events.onAdLoaded, this.onAdLoaded, false);
            document.addEventListener(admob.events.onAdFailedToLoad, this.onAdFailedToLoad, false);
            document.addEventListener(admob.events.onAdOpened, function (e) { }, false);
            document.addEventListener(admob.events.onAdClosed, function (e) { }, false);
            document.addEventListener(admob.events.onAdLeftApplication, function (e) { }, false);
            document.addEventListener(admob.events.onInAppPurchaseRequested, function (e) { }, false);
        } else {
            //alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },

    // -----------------------------------
    // Events.
    // The scope of 'this' is the event.
    // -----------------------------------
    onOrientationChange: function () {
        app.onResize();
    },
    onDeviceReady: function () {
        var weinre,
            weinreUrl;

        document.removeEventListener('deviceready', app.onDeviceReady, false);

        if (app.weinre.enabled) {
            console.log('Loading weinre...');
            weinre = document.createElement('script');
            weinreUrl = app.weinre.ip + ":" + app.weinre.port;
            weinreUrl += '/target/target-script-min.js';
            weinreUrl += '#' + app.weinre.targetApp;
            weinre.setAttribute('src', weinreUrl);
            document.head.appendChild(weinre);
        }

        if (window.admob) {
            console.log('Binding ad events...');
            app.bindAdEvents();
            console.log('Initializing ads...');
            app.initAds();
        } else {
            //alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    onAdLoaded: function (e) {
        app.showProgress(false);
        if (window.admob && e.adType === window.admob.AD_TYPE.INTERSTITIAL) {
            if (app.autoShowInterstitial) {
                window.admob.showInterstitialAd();
            } else {
                //alert("Interstitial is available. Click on 'Show Interstitial' to show it.");
            }
        }
    },
    onAdFailedToLoad: function (e) {
        app.showProgress(false);
        //alert("Could not load ad: " + JSON.stringify(e));
    },
    // -----------------------------------
    // App buttons functionality
    // -----------------------------------
    startBannerAds: function () {
        if (window.admob) {
            app.showProgress(true);
            window.admob.createBannerView(function () { }, function (e) {
                alert(JSON.stringify(e));
            });
        } else {
            //alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    removeBannerAds: function () {
        if (window.admob) {
            app.showProgress(false);
            window.admob.destroyBannerView();
        } else {
            //alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    showBannerAds: function () {
        if (window.admob) {
            app.showProgress(false);
            window.admob.showBannerAd(true, function () { }, function (e) {
                alert(JSON.stringify(e));
            });
        } else {
            //alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    hideBannerAds: function () {
        if (window.admob) {
            app.showProgress(false);
            window.admob.showBannerAd(false);
        } else {
            //alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    requestInterstitial: function (autoshow) {
        if (window.admob) {
            app.showProgress(true);
            app.autoShowInterstitial = autoshow;
            window.admob.requestInterstitialAd(function () { }, function (e) {
                alert(JSON.stringify(e));
            });
        } else {
            //alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    showInterstitial: function () {
        if (window.admob) {
            app.showProgress(false);
            window.admob.showInterstitialAd(function () { }, function (e) {
                alert(JSON.stringify(e));
            });
        } else {
            //alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    showProgress: function (show) {
        if (show) {
            addClass(app.spinner, "animated");
            removeClass(app.progressDialog, "hidden");
        } else {
            addClass(app.progressDialog, "hidden");
            removeClass(app.spinner, "animated");
        }
    }
};

function removeClass(elem, cls) {
    var str;
    do {
        str = " " + elem.className + " ";
        elem.className = str.replace(" " + cls + " ", " ").replace(/^\s+|\s+$/g, "");
    } while (str.match(cls));
}

function addClass(elem, cls) {
    elem.className += (" " + cls);
}


function fetchprices(Shape, Size, Color, Clarity)
{
	var RapPrice, Cts, Price, Amt, RapPer = 0;
	
	var URL = "https://technet.rapaport.com/HTTP/JSON/Prices/GetPrice.aspx";
	var Data = "{" +
                                             "'request': { "
                                                         + " 'header': { " +
                                                                             " 'username': '70462-Ankit'," +
                                                                             " 'password': 'AnkDroid510' " +
                                                                         "}," +
                                                                         " 'body': {" +
                                                                             " 'shape': '" + Shape +"', " +
                                                                             " 'size': '" + Size + "', " +
                                                                             " 'color': '" + Color + "', " +
                                                                             " 'clarity': '" + Clarity + "' " +
                                                                         "}" +
                                                             "}" +
                                        "}";
	var fLink = URL + "?" + Data;
	var fetchdata = [];
	formattext();
	$.ajax({
    type       : "POST",
    url        : URL,
    crossDomain: true,
    data       : Data,
    dataType   : 'json',
    success    : function(result,status) 
					{	
						document.getElementById("txtRapPrice").value = String(result.response.body.caratprice.toFixed(2));
						RapPer = document.getElementById("txtRapPer").value;
						RapPrice = document.getElementById("txtRapPrice").value;
						Cts = document.getElementById("txtCts").value;
						Price = (RapPrice - (RapPrice * RapPer/100));
						document.getElementById("txtPrice").value = Price.toFixed(2);
						Amt = Price*Cts;
						document.getElementById("txtAmount").value = Amt.toFixed(2);   
					},
    error      : function() {
        console.error("error");
    }
});  
}

function formattext()
{
	var txtCtsVar = document.getElementById("txtCts").value;
	var txtRapPerVar = document.getElementById("txtRapPer").value;
	document.getElementById("txtCts").value = String(parseFloat(txtCtsVar).toFixed(2));
	document.getElementById("txtRapPer").value = String(parseFloat(txtRapPerVar).toFixed(2));
}

function ShowHideUpgrade(Selection)
{
	if(Selection.value=="Yes")
	{
		document.getElementById("UpgradeColor").style.display= '';
		document.getElementById("UpgradeClarity").style.display= '';
	}
	else
	{
		document.getElementById("UpgradeColor").style.display= 'none';
		document.getElementById("UpgradeClarity").style.display= 'none';
	}
}

function CalRepPrice()
{
	var RapPrice, Cts, Price, Amt, RapPer, RPrice = 0;
	var Shape, Size, UColor, UClarity;
	
	Shape = document.getElementById("cmbShape").value;
	
	if (document.getElementById("txtCts").value > document.getElementById("txtRepCts").value)
		Size = document.getElementById("txtRepCts").value;
	else
		Size = document.getElementById("txtCts").value;
	
	if (document.getElementsByName("isUpgradable")[0].checked)
	{
		UColor = document.getElementById("cmbUpColor").value;
		UClarity = document.getElementById("cmbUpClarity").value;
	}
	else
	{
		UColor = document.getElementById("cmbColor").value;
		UClarity = document.getElementById("cmbClarity").value;
	}
	
	var URL = "https://technet.rapaport.com/HTTP/JSON/Prices/GetPrice.aspx";
	var Data = "{" +
                                             "'request': { "
                                                         + " 'header': { " +
                                                                             " 'username': '70462-Ankit'," +
                                                                             " 'password': 'AnkDroid510' " +
                                                                         "}," +
                                                                         " 'body': {" +
                                                                             " 'shape': '" + Shape +"', " +
                                                                             " 'size': '" + Size + "', " +
                                                                             " 'color': '" + UColor + "', " +
                                                                             " 'clarity': '" + UClarity + "' " +
                                                                         "}" +
                                                             "}" +
                                        "}";
	var fLink = URL + "?" + Data;
	var fetchdata = [];
	formattext();
	$.ajax({
    type       : "POST",
    url        : URL,
    crossDomain: true,
    data       : Data,
    dataType   : 'json',
    success    : function(result,status) 
					{	
						document.getElementById("txtRRapPrice").value = String(result.response.body.caratprice.toFixed(2));
						RapPrice = document.getElementById("txtRRapPrice").value;
						Price = document.getElementById("txtPrice").value;
						Amt = document.getElementById("txtAmount").value;
						Cts = document.getElementById("txtRepCts").value;
						RPrice = Amt / Cts;
						RapPer = RPrice / RapPrice * 100 - 100;
						document.getElementById("txtRPrice").value = RPrice.toFixed(2);
						document.getElementById("txtRRepPer").value = RapPer.toFixed(2);
					},
    error      : function() {
        console.error("error");
    }
});  
}

function DownloadPDF(ReportNo)
{
	var CertLink;
	
	if(document.getElementsByName("ReportCheck")[0].checked)
	{
		CertLink = 'https://myapps.gia.edu/ReportCheckPOC/pocservlet?IPAddress=1.1.1.1&Method=DownloadPDF&ReportNumber=' + ReportNo;
	}
	else if(document.getElementsByName("ReportCheck")[1].checked)
	{
		CertLink = 'http://ws2.hrdantwerp.com/HRD.CertificateService.WebAPI/certificate?certificateNumber='+ ReportNo + '&certificateType=CERT';
	}
	else
	{
		CertLink = 'http://global.igiworldwide.com/viewpdf.php?m=false&r=' + ReportNo;
	}
	
	var inAppRef = window.open(encodeURI(CertLink), '_system');
	
}

function onAppReady() {
  if( navigator.splashscreen && navigator.splashscreen.hide ) {   // Cordova API detected
      navigator.splashscreen.hide() ;
  }
}