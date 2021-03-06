(function(root) {

    var bench = root.benchrunner;

    bench.libs = [
        {
            name: 'jQuery',
            version: '2.0.3',
            script: {
                src: './vendor/jquery.min.js',
                onload: function() {
                    root.jQuery = jQuery.noConflict();
                }
            }
        },
        {
            name: 'Zepto',
            version: '1.1.2',
            script: {
                src: './vendor/zepto.min.js'
            }
        },
        {
            name: 'jQuery Evergreen',
            version: '0.3.5',
            script: {
                src: '../dist/jquery-evergreen.min.js',
                onload: function() {
                    root.$ = $.noConflict();
                }
            }
        }
    ];

    bench.setup.push(function() {
        var div = document.createElement('div');
        div.id = 'container';
        div.style.display = 'none';
        document.body.appendChild(div);
    });

    bench.onComplete = function(results, callback) {

        var data = {},
            suiteNameParts,
            suiteGroupName,
            key,
            config = {
            'Class': {
                key: 'agt1YS1wcm9maWxlcnIRCxIEVGVzdBiAgICkvo7WCQw',
                url: 'http://www.browserscope.org/user/tests/table/agt1YS1wcm9maWxlcnIRCxIEVGVzdBiAgICkvo7WCQw?v=3&layout=simple'
            },
            'Constructor': {
                key: 'agt1YS1wcm9maWxlcnIRCxIEVGVzdBiAgICkyo2ECQw',
                url: 'http://www.browserscope.org/user/tests/table/agt1YS1wcm9maWxlcnIRCxIEVGVzdBiAgICkyo2ECQw?v=3&layout=simple'
            },
            'DOM': {
                key: 'agt1YS1wcm9maWxlcnIRCxIEVGVzdBiAgIDk0Jv_Cgw',
                url: 'http://www.browserscope.org/user/tests/table/agt1YS1wcm9maWxlcnIRCxIEVGVzdBiAgIDk0Jv_Cgw?v=3&layout=simple'
            },
            'Selector': {
                key: 'agt1YS1wcm9maWxlcnIRCxIEVGVzdBiAgICkzLXNCAw',
                url: 'http://www.browserscope.org/user/tests/table/agt1YS1wcm9maWxlcnIRCxIEVGVzdBiAgICkzLXNCAw?v=3&layout=simple'
            }
        };

        function log(text) {
            console.log(text + '');
            var uiConsole = document && document.getElementById('ui-console');
            if(uiConsole) {
                uiConsole.textContent += text + '\n';
            }
        }

        function postToBrowserScope(key, data) {
            window._bTestResults = data;
            var newScript = document.createElement('script'),
                firstScript = document.getElementsByTagName('script')[0];
            newScript.src = 'http://www.browserscope.org/user/beacon/' + key;
            newScript.src += '?callback=browserScopeCallback';
            firstScript.parentNode.insertBefore(newScript, firstScript);
        }

        window.browserScopeCallback = function browserScopeCallback() {
            log('Data sent to BrowserScope. Thanks!');
            callback();
        };

        bench.libs.forEach(function(lib) {
            config[lib.name] = lib.name + ' ' + lib.version;
        });

        for(var suiteName in results) {
            suiteNameParts = suiteName.split('.');
            suiteGroupName = suiteNameParts[0];
            if(suiteGroupName in config) {
                data[suiteGroupName] = data[suiteGroupName] || {};
                for(var lib in results[suiteName]) {
                    key = [config[lib], suiteNameParts[1]].join(' ').trim();
                    data[suiteGroupName][key] = parseInt(results[suiteName][lib].hz, 10);
                }
            }
        }

        for(var suiteGroup in data) {
            log('\nSending data for "' + suiteGroup + '" to BrowserScope (' + config[suiteGroup].url + ')');
            postToBrowserScope(config[suiteGroup].key, data[suiteGroup]);
        }

    }

}(typeof global == 'object' && global || this));
