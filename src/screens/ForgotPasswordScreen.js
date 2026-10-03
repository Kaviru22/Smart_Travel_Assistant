import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { apiPost } from "../api";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen({ navigation }) {

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [loading, setLoading] = useState(false);

  function isValidEmail(value){
    return /\S+@\S+\.\S+/.test(value);
  }

  async function onSend(){

    setMsg("");
    setMsgType("");

    if(!email.trim()){
      setMsg("Please enter your email address");
      setMsgType("error");
      return;
    }

    if(!isValidEmail(email)){
      setMsg("Please enter a valid email");
      setMsgType("error");
      return;
    }

    try{

      setLoading(true);

      await apiPost("/auth/forgot-password",{ email });

      setMsg("OTP sent successfully to your email");
      setMsgType("success");

      setTimeout(()=>{
        navigation.navigate("ResetPassword",{ email });
      },1000);

    }catch(e){

      setMsg(e.message || "Failed to send OTP");
      setMsgType("error");

    }finally{
      setLoading(false);
    }

  }

  return (

    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a"/>

      <ImageBackground
        source={require("../../assets/forgot-travel.jpg")}
        style={styles.bg}
        resizeMode="cover"
      >

        <View style={styles.overlay}>

          <KeyboardAvoidingView
            style={{flex:1}}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >

          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >

            <View style={styles.hero}>

              <Text style={styles.badge}>Account Recovery</Text>

              <Text style={styles.title}>
                Smart Travel Assistant
              </Text>

              <Text style={styles.subtitle}>
                Forgot your password? Enter your email and we will send an OTP to reset it.
              </Text>

            </View>

            <View style={styles.card}>

              <Text style={styles.cardTitle}>Forgot Password</Text>

              <Text style={styles.cardSubtitle}>
                Enter your registered email address
              </Text>

              <View style={styles.inputGroup}>

                <Text style={styles.label}>Email Address</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

              </View>

              {!!msg && (
                <View style={[
                  styles.messageBox,
                  msgType === "success" ? styles.successBox : styles.errorBox
                ]}>
                  <Text style={[
                    styles.messageText,
                    msgType === "success" ? styles.successText : styles.errorText
                  ]}>
                    {msg}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.disabledBtn]}
                onPress={onSend}
                disabled={loading}
              >

                {loading
                  ? <ActivityIndicator color="#fff"/>
                  : <Text style={styles.primaryBtnText}>Send OTP</Text>
                }

              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={()=> navigation.navigate("Login")}
              >
                <Text style={styles.secondaryBtnText}>
                  Back to Login
                </Text>
              </TouchableOpacity>

            </View>

          </ScrollView>

          </KeyboardAvoidingView>

        </View>

      </ImageBackground>

    </SafeAreaView>
  );

}

const styles = StyleSheet.create({

  safeArea:{
    flex:1,
    backgroundColor:"#0f172a"
  },

  bg:{
    flex:1
  },

  overlay:{
    flex:1,
    backgroundColor:"rgba(15,23,42,0.60)"
  },

  scroll:{
    flexGrow:1,
    justifyContent:"space-between",
    paddingHorizontal:20,
    paddingTop:40,
    paddingBottom:24
  },

  hero:{
    marginTop:20,
    marginBottom:30
  },

  badge:{
    alignSelf:"flex-start",
    backgroundColor:"rgba(255,255,255,0.18)",
    color:"#fff",
    paddingHorizontal:14,
    paddingVertical:8,
    borderRadius:999,
    fontSize:12,
    fontWeight:"700",
    marginBottom:14
  },

  title:{
    fontSize:34,
    fontWeight:"800",
    color:"#fff"
  },

  subtitle:{
    marginTop:12,
    fontSize:15,
    color:"rgba(255,255,255,0.9)",
    lineHeight:22
  },

  card:{
    backgroundColor:"rgba(255,255,255,0.97)",
    borderRadius:28,
    padding:22,
    elevation:10
  },

  cardTitle:{
    fontSize:25,
    fontWeight:"800",
    textAlign:"center"
  },

  cardSubtitle:{
    textAlign:"center",
    marginTop:6,
    marginBottom:20,
    color:"#64748b"
  },

  inputGroup:{
    marginBottom:14
  },

  label:{
    fontWeight:"700",
    marginBottom:6
  },

  input:{
    borderWidth:1,
    borderColor:"#dbe4ee",
    borderRadius:16,
    padding:14,
    backgroundColor:"#f8fafc"
  },

  messageBox:{
    marginBottom:10,
    padding:10,
    borderRadius:10
  },

  successBox:{
    backgroundColor:"#ecfdf3"
  },

  errorBox:{
    backgroundColor:"#fef2f2"
  },

  messageText:{
    textAlign:"center",
    fontWeight:"600"
  },

  successText:{
    color:"#15803d"
  },

  errorText:{
    color:"#dc2626"
  },

  primaryBtn:{
    marginTop:10,
    backgroundColor:"#ef4444",
    padding:15,
    borderRadius:16,
    alignItems:"center"
  },

  primaryBtnText:{
    color:"#fff",
    fontWeight:"800",
    fontSize:16
  },

  secondaryBtn:{
    marginTop:12,
    backgroundColor:"#2563eb",
    padding:14,
    borderRadius:16,
    alignItems:"center"
  },

  secondaryBtnText:{
    color:"#fff",
    fontWeight:"700"
  },

  disabledBtn:{
    opacity:0.7
  }

});