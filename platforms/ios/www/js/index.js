let deviceToken;
let loggedIn = false;
let hasRegisteredForNotifications = false;

let launcherInstance;
let singleCardInstance;


document.addEventListener('deviceready', registerObservers, false);

function setupAtomic() {
    // Configuration -> SDK -> API Host (eg. "https://999-1.client-api.atomic.io")
    const ATOMIC_API_HOST = 'https://01.client-api.staging.atomic.io';
    // Configuration -> SDK -> API keys (eg. "my-api-key")
    const ATOMIC_API_KEY = 'test_key_2';
    // Configuration -> Environment ID (eg. "AbC12de3")
    const ATOMIC_ENVIRONMENT_ID = 'Wl7QYV';
    // Configuration -> SDK -> Stream containers -> ID (eg. "123abcde")
    const ATOMIC_STREAM_CONTAINER_ID = 'XleX7Vxo';
    // A JWT token generated following the SDK Authentication guide (eg. "ey2askjhfakshjfakjhasjj...ashgfjahgjhagsjfhga")
    const ATOMIC_REQUEST_TOKEN_STRING = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1GbERlR2xzVUd0c1lVRnlaalJzVTFSNVpHWmhXRFYxTTI0NFBRIn0.eyJuYW1lIjoiRGVtbyBVc2VyIiwic3ViIjoiZGQ3MGViZWEtOWRjYi01Y2ZjLTk3NzAtMTRjNjgzNDAzMTc1IiwiaWF0IjoxNzAxMDIzODQwLCJleHAiOjE3MDExMTAyNDAsImlzcyI6ImxvY2FsIn0.quBZKVXcfI9Vd5rStPeBzvwXvONqbgcXEv9374NHpJsPJBoEq6agAu-8GbZwgaOpHoQoPlKyNpVNpU9NPa_ESuDxW0vrTu00KAlkNL2ZF8j3clPoEczMtMG0HtXrYCvhoEbM73WT8qlwfy1rVUiBrLInuqCgDsuFeoATXl3fJtmfabzDKgjL7TDSTbqeRQe30ltSGCpZv24LEBLg05VwnJt7dUJ8qMj-DfhISQ7I0I20I9gKbySKtzdGgdOd7nRzSysG6EFLTT-btOQ8kfjBxwNtLEQ1ARosphSEjiIfNWD4oGcJilP7W36XTujAkUzCTE0L7jLhES2A-7EnnvXdFQ';
    AtomicSDK.initialise(ATOMIC_API_HOST, ATOMIC_API_KEY, ATOMIC_ENVIRONMENT_ID);
    AtomicSDK.enableDebugMode(3);
  
    AtomicSDK.setSessionDelegate(() => new Promise((res) => { res(ATOMIC_REQUEST_TOKEN_STRING)}));

    // AtomicSDK.setNativeDeviceInfo({
    //     platform: device.platform,
    //     appId:
    //       device.platform == 'iOS'
    //         ? 'com.ios.atomic.boilerplate.cordova'
    //         : 'com.atomic.boilerplate.cordova',
    //     deviceId: device.uuid,
    //   });
    


    // AtomicSDK.setSessionDelegate(() => {
    //   return ATOMIC_REQUEST_TOKEN_STRING;
    // });
  
    singleCardInstance = AtomicSDK.singleCard(document.querySelector('#embed'), {
      streamContainerId: ATOMIC_STREAM_CONTAINER_ID,
      features: {
        cordova: {
          enabled: true,
        },
      },
    });
  
    // launcherInstance = AtomicSDK.launch({
    //   streamContainerId: ATOMIC_STREAM_CONTAINER_ID,
    //   features: {
    //     cordova: {
    //       enabled: true,
    //     },
    //   },
    // });
  }

  function login() {
    console.log('login clicked');
    setupAtomic();
    document.querySelector('#loginBtn').disabled = true;
    document.querySelector('#logoutBtn').disabled = false;
    loggedIn = true;
  }
  
  function logout() {
    console.log('logout clicked');
    AtomicSDK.logout();
  
    document.querySelector('#loginBtn').disabled = false;
    document.querySelector('#logoutBtn').disabled = true;
  
    loggedIn = false;
    hasRegisteredForNotifications = false;
  
    singleCardInstance.stop();
    launcherInstance.stop();
  }

  function registerObservers() {
    document.querySelector('#loginBtn').addEventListener('click', login);
    document.querySelector('#logoutBtn').addEventListener('click', logout);
  }
  
  function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    registerObservers();
  }

