/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package io.atomic.shellapp;


import android.annotation.SuppressLint;
import android.os.Bundle;
import android.util.Log;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.FrameLayout;

import androidx.appcompat.app.AppCompatActivity;

import org.apache.cordova.ConfigXmlParser;
import org.apache.cordova.CordovaInterfaceImpl;
import org.apache.cordova.CordovaPreferences;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaWebViewEngine;
import org.apache.cordova.CordovaWebViewImpl;
import org.apache.cordova.LOG;
import org.apache.cordova.PluginEntry;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;


public class MainActivity extends AppCompatActivity {
    public static String TAG = "MainActivity";
    protected CordovaWebView appView;
    protected boolean keepRunning = true;
    // Read from config.xml:
    protected CordovaPreferences preferences;
    protected String launchUrl;

    protected ArrayList<PluginEntry> pluginEntries;
    protected CordovaInterfaceImpl cordovaInterface;

    @Override
    public void onCreate(Bundle savedInstanceState) {

        // need to activate preferences before super.onCreate to avoid "requestFeature() must be called before adding content" exception
        loadConfig();

        String logLevel = preferences.getString("loglevel", "ERROR");
        LOG.setLogLevel(logLevel);

        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);


        super.onCreate(savedInstanceState);

        cordovaInterface = makeCordovaInterface();
        if (savedInstanceState != null) {
            cordovaInterface.restoreInstanceState(savedInstanceState);
        }

        loadUrl(launchUrl);
    }

    protected void loadConfig() {
        ConfigXmlParser parser = new ConfigXmlParser();
        parser.parse(this);
        preferences = parser.getPreferences();
        preferences.setPreferencesBundle(getIntent().getExtras());
        launchUrl = parser.getLaunchUrl();
        pluginEntries = parser.getPluginEntries();
    }

    protected void init() {
        appView = makeWebView();
        createViews();
        if (!appView.isInitialized()) {
            appView.init(cordovaInterface, pluginEntries, preferences);
        }
        cordovaInterface.onCordovaInit(appView.getPluginManager());
    }

    public void loadUrl(String url) {
        if (appView == null) {
            init();
        }
        // If keepRunning
        this.keepRunning = preferences.getBoolean("KeepRunning", true);

        appView.loadUrlIntoView(url, true);
    }

    @SuppressLint("ResourceType")
    protected void createViews() {
        //Why are we setting a constant as the ID? This should be investigated
        appView.getView().setId(100);
        appView.getView().setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));

        setContentView(appView.getView());
        appView.getView().requestFocusFromTouch();
    }

    protected CordovaWebView makeWebView() {
        return new CordovaWebViewImpl(makeWebViewEngine());
    }

    protected CordovaWebViewEngine makeWebViewEngine() {
        return CordovaWebViewImpl.createEngine(this, preferences);
    }

    protected CordovaInterfaceImpl makeCordovaInterface() {
        return new CordovaInterfaceImpl(this) {
            @Override
            public Object onMessage(String id, Object data) {
                // Plumb this to CordovaActivity.onMessage for backwards compatibility
                return MainActivity.this.onMessage(id, data);
            }
        };
    }

    public Object onMessage(String id, Object data) {
        if ("onReceivedError".equals(id)) {
            JSONObject d = (JSONObject) data;
            try {
                Log.d(TAG, d.getString("description"));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        } else if ("exit".equals(id)) {
            finish();
        }
        return null;
    }
}



//public class MainActivity extends AppCompatActivity implements CordovaInterface {
//
//    protected CordovaPlugin activityResultCallback = null;
//    protected boolean activityResultKeepRunning;
//    protected boolean keepRunning = true;
//    private final ExecutorService threadPool = Executors.newCachedThreadPool();
//    CordovaWebView cwv;
//
//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        setContentView(R.layout.main);
//        cwv = (CordovaWebView) findViewById(R.id.mainView);
//        Config.init(this);
//        cwv.loadUrl(Config.getStartUrl());
//    }
//
//    @Override
//    public AppCompatActivity getActivity() {
//        return this;
//    }
//
//    @Override
//    public Context getContext() {
//        return getActivity();
//    }
//
//    @Override
//    public ExecutorService getThreadPool() {
//        return threadPool;
//    }
//
//    @Override
//    public void requestPermission(CordovaPlugin plugin, int requestCode, String permission) {
//
//    }
//
//    @Override
//    public void requestPermissions(CordovaPlugin plugin, int requestCode, String[] permissions) {
//
//    }
//
//    @Override
//    public boolean hasPermission(String permission) {
//        return false;
//    }
//
//    @Override
//    public Object onMessage(String arg0, Object arg1) {
//        return null;
//    }
//
//    @Override
//    public void setActivityResultCallback(CordovaPlugin plugin) {
//        this.activityResultCallback = plugin;
//    }
//
//    @Override
//    public void startActivityForResult(CordovaPlugin command, Intent intent, int requestCode) {
//        this.activityResultCallback = command;
//        this.activityResultKeepRunning = this.keepRunning;
//
//        if (command != null) {
//            this.keepRunning = false;
//        }
//
//        super.startActivityForResult(intent, requestCode);
//    }
//
//    @Override
//    protected void onActivityResult(int requestCode, int resultCode, Intent intent) {
//        super.onActivityResult(requestCode, resultCode, intent);
//        CordovaPlugin callback = this.activityResultCallback;
//        if (callback != null) {
//            callback.onActivityResult(requestCode, resultCode, intent);
//        }
//    } }


// public class MainActivity extends CordovaActivity
// {
//     @Override
//     public void onCreate(Bundle savedInstanceState)
//     {
//         super.onCreate(savedInstanceState);
//
//         // enable Cordova apps to be started in the background
//         Bundle extras = getIntent().getExtras();
//         if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
//             moveTaskToBack(true);
//         }
//
//         // Set by <content src="index.html" /> in config.xml
//         loadUrl(launchUrl);
//     }
// }
