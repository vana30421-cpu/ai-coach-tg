package com.lifeos.jarvis

import android.Manifest
import android.app.Activity
import android.app.role.RoleManager
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.LinearLayout
import android.widget.Toast
import org.json.JSONObject

class MainActivity : Activity() {
    private lateinit var webView: WebView
    private var speechRecognizer: SpeechRecognizer? = null
    private var pendingVoiceStart = false
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
                    startNativeVoiceRecognition()
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
                startNativeVoiceRecognition()
            } else webView.loadUrl(getString(R.string.lifeos_url))
        }
    }

    private fun openVoiceSheet() {
        webView.evaluateJavascript(
            "window.LifeOSJarvisMobile && window.LifeOSJarvisMobile.open(false)",
            null
        )
    }

    private fun startNativeVoiceRecognition() {
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            pendingVoiceStart = true
            requestPermissions(arrayOf(Manifest.permission.RECORD_AUDIO), AUDIO_PERMISSION_REQUEST)
            openVoiceSheet()
            return
        }
        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            openVoiceSheet()
            Toast.makeText(this, "Сервис распознавания речи недоступен. Можно написать команду.", Toast.LENGTH_LONG).show()
            return
        }
        try {
            speechRecognizer?.destroy()
            speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this).apply {
                setRecognitionListener(object : RecognitionListener {
                    override fun onReadyForSpeech(params: Bundle?) = openVoiceSheet()
                    override fun onBeginningOfSpeech() {}
                    override fun onRmsChanged(rmsdB: Float) {}
                    override fun onBufferReceived(buffer: ByteArray?) {}
                    override fun onEndOfSpeech() {}
                    override fun onError(error: Int) {
                        openVoiceSheet()
                        Toast.makeText(this@MainActivity, "Не удалось распознать речь. Попробуй ещё раз.", Toast.LENGTH_SHORT).show()
                    }
                    override fun onResults(results: Bundle?) {
                        val phrase = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull()
                        if (!phrase.isNullOrBlank()) {
                            val safePhrase = JSONObject.quote(phrase)
                            webView.evaluateJavascript(
                                "window.LifeOSJarvisMobile && window.LifeOSJarvisMobile.submit($safePhrase)",
                                null
                            )
                        } else openVoiceSheet()
                    }
                    override fun onPartialResults(partialResults: Bundle?) {}
                    override fun onEvent(eventType: Int, params: Bundle?) {}
                })
            }
            val request = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                putExtra(RecognizerIntent.EXTRA_LANGUAGE, "ru-RU")
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, "ru-RU")
                putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
                putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false)
                putExtra(RecognizerIntent.EXTRA_PROMPT, "Скажите команду для Джарвиса")
            }
            speechRecognizer?.startListening(request)
        } catch (error: Exception) {
            openVoiceSheet()
            Toast.makeText(this, "Голосовой ввод недоступен. Используй текстовый режим.", Toast.LENGTH_LONG).show()
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
            val granted = grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED
            if (granted && pendingVoiceStart) {
                pendingVoiceStart = false
                startNativeVoiceRecognition()
            } else if (!granted) {
                pendingVoiceStart = false
                openVoiceSheet()
                Toast.makeText(this, "Без доступа к микрофону голосовой вызов недоступен.", Toast.LENGTH_LONG).show()
            }
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }

    override fun onDestroy() {
        speechRecognizer?.cancel()
        speechRecognizer?.destroy()
        speechRecognizer = null
        webView.destroy()
        super.onDestroy()
    }
}
