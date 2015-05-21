// https://github.com/paulirish/automated-chrome-profiling
// https://github.com/cyrus-and/chrome-remote-interface/blob/master/lib/protocol.json

var fs = require('fs');
var Chrome = require('chrome-remote-interface');

Chrome(function (chrome) {
//    with (chrome) {
        chrome.Page.enable();
        chrome.Page.loadEventFired(function () {
            chrome.Runtime.evaluate({ "expression": "warmUp();" });
        });
        
        chrome.Profiler.enable();

        // 100 microsecond JS profiler sampling resolution, (1000 is default)
        chrome.Profiler.setSamplingInterval({ 'interval': 100 }, function () {
            chrome.Page.navigate({'url': 'http://localhost:9001/#/home'});
        });
        
        setTimeout(function () {
            function startTest() {
                chrome.Page.loadEventFired(function () {
                    // on load we'll start profiling, kick off the test, and finish
                    // alternatively, Profiler.start(), Profiler.stop() are accessible via chrome-remote-interface
                    chrome.Runtime.evaluate({ "expression": "startTest();" });
        //            Runtime.evaluate({ "expression": "console.profile(); startTest(); console.profileEnd();" });
                });
            }
            
            var testStarted = false;
            
            chrome.HeapProfiler.enable();
            chrome.HeapProfiler.startTrackingHeapObjects();
                
            chrome.HeapProfiler.collectGarbage();
            chrome.HeapProfiler.takeHeapSnapshot({reportProgress: true});
    
            chrome.Profiler.consoleProfileFinished(function (params) {
                // CPUProfile object (params.profile) described here:
                //    https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/devtools/protocol.json&q=protocol.json%20%22CPUProfile%22,&sq=package:chromium
    
                // Either:
                // 1. process the data however you wish… or,
                // 2. Use the JSON file, open Chrome DevTools, Profiles tab,
                //    select CPU Profile radio button, click `load` and view the
                //    profile data in the full devtools UI.
                var file = 'profile-' + Date.now() + '.cpuprofile';
                var data = JSON.stringify(params.profile, null, 2);
    //            fs.writeFileSync(file, data);
                console.log('Done! See ' + file);
                chrome.HeapProfiler.collectGarbage();
                chrome.HeapProfiler.takeHeapSnapshot({reportProgress: true});
            });
            
            chrome.HeapProfiler.reportHeapSnapshotProgress(function(params) {
                if (params.finished) {
                    console.log(new Date(), 'Heap Report', params);
                    if (testStarted) {
                        chrome.close();         
                    } else {
                        testStarted = true;
                        startTest();
                    }
                }
            });
        }, 5000);
//    }
}).on('error', function (err) {
    console.error('Cannot connect to Chrome', err);
});