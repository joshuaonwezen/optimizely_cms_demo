import { createInstance } from "@optimizely/react-sdk";

/**
 * Optimizely Feature Experimentation Configuration
 * This is where we configure A/B testing and feature flags
 */

export const optimizely = createInstance({
    sdkKey: "XKkRw1SWTRnp5WXmVMYdB",
});

// Demo visitor ID - in production, this would be dynamic
export const visitorId = '123';