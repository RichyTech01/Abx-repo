import React from "react";
import { Modal, Pressable, Text, View, ScrollView, StyleSheet } from "react-native";
import UrbanistText from "@/common/UrbanistText";
import CancelModalIcon from "@/assets/svgs/CancelModalIcon.svg";

type SupportPolicyModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function SupportPolicyModal({ visible, onClose }: SupportPolicyModalProps) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.container}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          android_ripple={{ color: "rgba(0,0,0,0.05)" }}
        />

        <View style={styles.modalCard}>
          {/* Header / close */}
          <View style={styles.header}>
            <Pressable onPress={onClose} hitSlop={8}>
              <CancelModalIcon />
            </Pressable>
          </View>

          {/* Scrollable content */}
          <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <UrbanistText style={styles.paragraph}>
              At ABX, we are committed to protecting your privacy and ensuring the security of your personal information. All conversations held within this chat are end-to-end encrypted. This means only you and the person you're communicating with can read the messages—no one else, not even ABX.
            </UrbanistText>

            <UrbanistText style={[styles.paragraph, { marginTop: 16 }]}>
              We do not store your conversations beyond what is necessary to support your experience, and any data collected is handled in accordance with our strict privacy standards and relevant data protection laws.
            </UrbanistText>

            <UrbanistText style={[styles.paragraph, { marginTop: 16 }]}>
              By continuing to use this chat, you acknowledge and agree to our{" "}
              <Text  className="font-urbanist-semibold">Privacy Policy</Text> and{" "}
              <Text className="font-urbanist-semibold  ">Terms of Service</Text>, which outline how your information is used, protected, and kept confidential.
            </UrbanistText>

            <UrbanistText style={[styles.paragraph, { marginTop: 16 }]}>
              Your trust means everything to us, and we're dedicated to maintaining a safe, secure, and transparent environment for all our users.
            </UrbanistText>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // center children; the backdrop is absolute so the modal card will be centered visually
    alignItems: "center",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalCard: {
    width: "90%",
    maxHeight: "70%", // ensures overflow on small screens
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1EAE7",
    backgroundColor: "#fff",
    overflow: "hidden",
    marginTop:"22%"

  },
  header: {
    paddingTop: 14,
    paddingHorizontal: 20,
    alignItems: "flex-end",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
  },
  paragraph: {
    color: "#2D2220",
    fontSize: 16,
    lineHeight: 22,
  },
  bold: {
    fontWeight: "700",
  },
});
