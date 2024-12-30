import api from "@/utils/api";
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from "react-native";
import { showMessage } from "react-native-flash-message";

// Generate a simple transaction ID without uuid
const generateTransactionId = () => {
  return "txn_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
};

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  amount: number;
  albumId?: string;
  type: "purchase_album" | "tip_artist";
  artistId?: string;
}

export default function PaymentModal({
  visible,
  onClose,
  amount,
  albumId,
  type,
  artistId,
}: PaymentModalProps) {
  const [loading, setLoading] = React.useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const transactionId = generateTransactionId();

      const baseUrl = "https://mysoundsglobal.com";
      // Add Stripe publishable key to headers
      api.defaults.headers["Stripe-Publishable-Key"] = 
        process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

      const { data } = await api.post("/api/create-checkout-session", {
        amount,
        artistId,
        type,
        transactionId,
        albumId,
        successUrl: `${baseUrl}/payment/success`,
        cancelUrl: `${baseUrl}/payment/cancel`,
      });

      console.log("Stripe response:", data?.data);

      if (data?.data?.sessionId) {
        const checkoutUrl = `https://checkout.stripe.com/pay/${data.data.sessionId}`;
        console.log("Checkout URL:", checkoutUrl);

        await Linking.openURL(checkoutUrl);
        onClose();
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error: any) {
      console.error("Payment error:", error?.response?.data?.message);
      showMessage({
        message: "Error",
        description: error?.response?.data?.message || "Payment failed",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          <Text style={styles.modalTitle}>
            {type === "purchase_album" ? "Purchase Album" : "Support Artist"}
          </Text>
          <Text style={styles.amount}>${amount}</Text>
          <Text style={styles.description}>
            {type === "purchase_album"
              ? "Purchase this album to get access to all songs and add them to your playlists."
              : "Support this artist by sending them a tip."}
          </Text>
          <TouchableOpacity
            style={styles.purchaseButton}
            onPress={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.purchaseButtonText}>
                {type === "purchase_album" ? "Purchase Now" : "Send Tip"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// ... styles remain the same

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#282828",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
  },
  amount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#8B5CF6",
    marginBottom: 24,
  },
  cardField: {
    width: "100%",
    height: 50,
    marginVertical: 20,
  },
  description: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  purchaseButton: {
    width: "100%",
    backgroundColor: "#8B5CF6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  purchaseButtonDisabled: {
    backgroundColor: "#4B4B4B",
  },
  purchaseButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
