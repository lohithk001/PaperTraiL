package com.papertrail.vault;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handleSendIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleSendIntent(intent);
    }

    private void handleSendIntent(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        String type = intent.getType();

        if (Intent.ACTION_SEND.equals(action) && type != null) {
            try {
                Uri fileUri = (Uri) intent.getParcelableExtra(Intent.EXTRA_STREAM);
                if (fileUri != null) {
                    notifyWebSharedFile(fileUri.toString(), type);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private void notifyWebSharedFile(String uri, String mimeType) {
        if (getBridge() != null && getBridge().getWebView() != null) {
            String script = "window.dispatchEvent(new CustomEvent('papertrail:shared-file', { detail: { uri: '" + uri + "', mimeType: '" + mimeType + "' } }));";
            getBridge().getWebView().post(() -> getBridge().getWebView().evaluateJavascript(script, null));
        }
    }
}
