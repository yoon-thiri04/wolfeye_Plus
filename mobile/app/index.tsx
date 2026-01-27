import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';

// Deployed Web App URL
const WEB_APP_URL = 'http://72.61.120.59:8090/'; 

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ea7c3b" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <WebView 
        source={{ uri: WEB_APP_URL }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        // Enable Camera access for Android
        mediaCapturePermissionGrantType="grantIfSameHostElsePrompt" 
        onLoad={() => setLoading(false)}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ea7c3b" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
