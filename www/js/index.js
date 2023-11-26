let deviceToken;
let loggedIn = false;
let hasRegisteredForNotifications = false;

let launcherInstance;
let singleCardInstance;


document.addEventListener('deviceready', registerObservers, false);

function setupAtomic() {
    // Configuration -> SDK -> API Host (eg. "https://999-1.client-api.atomic.io")
    const ATOMIC_API_HOST = '';
    // Configuration -> SDK -> API keys (eg. "my-api-key")
    const ATOMIC_API_KEY = '';
    // Configuration -> Environment ID (eg. "AbC12de3")
    const ATOMIC_ENVIRONMENT_ID = '';
    // Configuration -> SDK -> Stream containers -> ID (eg. "123abcde")
    const ATOMIC_STREAM_CONTAINER_ID = '';
    // A JWT token generated following the SDK Authentication guide (eg. "ey2askjhfakshjfakjhasjj...ashgfjahgjhagsjfhga")
    const ATOMIC_REQUEST_TOKEN_STRING = '';
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

