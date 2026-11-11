# LIFEOS Jarvis — Android companion

This is the native Android companion for the existing LIFEOS PWA. The PWA remains the product UI and data layer; this app provides the Android VoiceInteractionService entry point.

## Build

- Android Studio Ladybug or newer
- JDK 17
- Android SDK 35
- Open the `android/` folder in Android Studio and build the `app` module.

The app currently loads the public LIFEOS URL configured in `app/src/main/res/values/strings.xml`. Change `lifeos_url` only if the published LIFEOS origin changes.

## Enable Home-button / assistant gesture

1. Install the Android app.
2. Open it and grant microphone permission when asked.
3. Tap **Назначить Jarvis помощником Android**.
4. Confirm LIFEOS Jarvis in Android's assistant-role dialog.
5. Use the device's configured assistant invocation: hold Home on 3-button navigation, or use the assistant gesture from a bottom corner on gesture navigation. Availability and gesture details depend on Android version and device manufacturer.

The native service receives Android's assistant invocation and opens the LIFEOS Jarvis voice sheet. This is not a permanent always-listening hotword service; Android and browser microphone permissions remain in control.

## Voice

The PWA voice sheet uses the browser Web Speech API. Recognition availability depends on the installed WebView and Android speech-recognition provider. If unavailable, text chat still works.

## Security and privacy

The wrapper loads the configured HTTPS LIFEOS origin. Android requests microphone permission only when native speech recognition is invoked; recognized text is passed into the LIFEOS Jarvis interface. The AI provider/API keys remain in the existing Cloudflare Worker configuration; never add them to this Android project.
