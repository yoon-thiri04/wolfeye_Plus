import { StyleSheet, SafeAreaView, Platform, StatusBar } from "react-native";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";

// Replace this with your computer's local IP address for development
// e.g., "http://192.168.1.100:5173"
// DO NOT use "localhost" or "127.0.0.1" as that refers to the phone itself
const FRONTEND_URL = "http://192.168.237.58:5173"; 

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <WebView 
        source={{ uri: FRONTEND_URL }}
        style={styles.webview}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  webview: {
    flex: 1,
  },
});
