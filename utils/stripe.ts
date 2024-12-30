import { initStripe } from "@stripe/stripe-react-native";

// Move to .env file
const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY

export const initializeStripe = async () => {
  await initStripe({
    publishableKey: STRIPE_PUBLISHABLE_KEY!,
    merchantIdentifier: "merchant.com.mysounduk.app",
  });
};
