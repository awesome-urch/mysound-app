import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

type DonateModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (amount: string) => void;
  artistName: string;
};

const QUICK_AMOUNTS = [5, 10, 20];

export default function DonateModal({
  visible,
  onClose,
  onSubmit,
  artistName,
}: DonateModalProps) {
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    if (amount && Number(amount) > 0) {
      onSubmit(amount);
      setAmount("");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Support {artistName}</Text>
              <Text style={styles.subtitle}>
                Your contribution helps the artist create more amazing music
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Amount ($)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="Enter amount"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.quickAmounts}>
                {QUICK_AMOUNTS.map((quickAmount) => (
                  <TouchableOpacity
                    key={quickAmount}
                    style={[
                      styles.quickAmountButton,
                      amount === quickAmount.toString() &&
                        styles.quickAmountButtonActive,
                    ]}
                    onPress={() => setAmount(quickAmount.toString())}
                  >
                    <Text
                      style={[
                        styles.quickAmountText,
                        amount === quickAmount.toString() &&
                          styles.quickAmountTextActive,
                      ]}
                    >
                      ${quickAmount}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (!amount || Number(amount) <= 0) &&
                      styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={!amount || Number(amount) <= 0}
                >
                  <Text style={styles.submitButtonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#282828",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#161616",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
  },
  quickAmounts: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  quickAmountButton: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#161616",
    alignItems: "center",
  },
  quickAmountButtonActive: {
    backgroundColor: "#8B5CF6",
  },
  quickAmountText: {
    color: "#999",
    fontSize: 16,
  },
  quickAmountTextActive: {
    color: "#fff",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#161616",
  },
  submitButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#8B5CF6",
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  cancelButtonText: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
