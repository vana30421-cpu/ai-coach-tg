package com.lifeos.jarvis

import android.service.voice.VoiceInteractionSession
import android.service.voice.VoiceInteractionSessionService

class LifeOSVoiceInteractionSessionService : VoiceInteractionSessionService() {
    override fun onNewSession(args: android.os.Bundle?): VoiceInteractionSession {
        return LifeOSVoiceInteractionSession(this)
    }
}
