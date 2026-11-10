package com.lifeos.jarvis

import android.content.Intent
import android.service.voice.VoiceInteractionSession

class LifeOSVoiceInteractionSession(context: android.content.Context) : VoiceInteractionSession(context) {
    override fun onShow(args: android.os.Bundle?, showFlags: Int) {
        super.onShow(args, showFlags)
        val intent = Intent(context, MainActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
            putExtra(MainActivity.EXTRA_START_VOICE, true)
        }
        startAssistantActivity(intent)
        hide()
    }
}
