import { createInstance } from "@optimizely/react-sdk";
import {v4} from 'uuid';
import cookies from 'js-cookie';

/**
 * Optimizely Feature Experimentation Configuration
 */


function getOptimizelyId() {
  const visitorId = cookies.get('visitorId') || v4();
  cookies.set('visitorId', visitorId, {expires: 365});
  return visitorId;
}

export const optimizely = createInstance({
    sdkKey: "XKkRw1SWTRnp5WXmVMYdB",
});

export const visitorId = getOptimizelyId();

