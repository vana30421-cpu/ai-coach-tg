package com.lifeos.jarvis

import android.Manifest
import android.app.Activity
import android.app.role.RoleManager
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.LinearLayout
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

class MainActivity : Activity() {
    private lateinit var webView: WebView
    private var pendingWebPermission: PermissionRequest? = null
    private var startVoiceAfterLoad = false

    companion object {
        const val EXTRA_START_VOICE = "com.lifeos.jarvis.START_VOICE"
        private const val AUDIO_PERMISSION_REQUEST = 41
        private const val ASSISTANT_ROLE_REQUEST = 42
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        startVoiceAfterLoad = intent.getBooleanExtra(EXTRA_START_VOICE, false)
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(android.graphics.Color.rgb(5, 9, 20))
        }
        val assistantButton = Button(this).apply {
            text = "Назначить Jarvis помощником Android"
            setOnClickListener { requestAssistantRole() }
        }
        root.addView(assistantButton, LinearLayout.LayoutParams(-1, -2))
        webView = WebView(this)
        root.addView(webView, LinearLayout.LayoutParams(-1, 0, 1f))
        setContentView(root)

        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.mediaPlaybackRequiresUserGesture = false
        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                if (startVoiceAfterLoad) {
                    startVoiceAfterLoad = false
                    webView.postDelayed({
                        webView.evaluateJavascript(
                            "window.LifeOSJarvisMobile && window.LifeOSJarvisMobile.open(true)",
                            null
                        )
                    }, 500)
                }
            }
        }
        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest) {
                val wantsAudio = request.resources.contains(PermissionRequest.RESOURCE_AUDIO_CAPTURE)
                if (!wantsAudio) {
                    request.deny()
                    return
                }
                if (ContextCompat.checkSelfPermission(this@MainActivity, Manifest.permission.RECORD_AUDIO)
                    == PackageManager.PERMISSION_GRANTED) {
                    request.grant(arrayOf(PermissionRequest.RESOURCE_AUDIO_CAPTURE))
                } else {
                    pendingWebPermission = request
                    ActivityCompat.requestPermissions(
                        this@MainActivity,
                        arrayOf(Manifest.permission.RECORD_AUDIO),
                        AUDIO_PERMISSION_REQUEST
                    )
                }
            }
        }
        webView.loadUrl(getString(R.string.lifeos_url))
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        if (intent.getBooleanExtra(EXTRA_START_VOICE, false)) {
            startVoiceAfterLoad = true
            if (webView.url?.startsWith(getString(R.string.lifeos_url)) == true) {
                startVoiceAfterLoad = false
                webView.postDelayed({
                    webView.evaluateJavascript(
                        "window.LifeOSJarvisMobile && window.LifeOSJarvisMobile.open(true)",
                        null
                    )
                }, 250)
            } else webView.loadUrl(getString(R.string.lifeos_url))
        }
    }

    private fun requestAssistantRole() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val roleManager = getSystemService(RoleManager::class.java)
            if (roleManager.isRoleAvailable(RoleManager.ROLE_ASSISTANT)) {
                if (roleManager.isRoleHeld(RoleManager.ROLE_ASSISTANT)) {
                    Toast.makeText(this, "Jarvis уже выбран помощником", Toast.LENGTH_SHORT).show()
                } else startActivityForResult(
                    roleManager.createRequestRoleIntent(RoleManager.ROLE_ASSISTANT),
                    ASSISTANT_ROLE_REQUEST
                )
                return
            }
        }
        startActivity(Intent(android.provider.Settings.ACTION_MANAGE_DEFAULT_APPS_SETTINGS))
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == AUDIO_PERMISSION_REQUEST) {
            val request = pendingWebPermission
            pendingWebPermission = null
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED && request != null) {
                request.grant(arrayOf(PermissionRequest.RESOURCE_AUDIO_CAPTURE))
            } else request?.deny()
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }

    override fun onDestroy() {
        pendingWebPermission?.deny()
        webView.destroy()
        super.onDestroy()
    }
}
