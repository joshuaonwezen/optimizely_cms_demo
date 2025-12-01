import { createInstance } from "@optimizely/react-sdk";
import {v4} from 'uuid';
import cookies from 'js-cookie';

/**
 * Optimizely Feature Experimentation Configuration
 */

/**
 * Check for query parameter to refresh visitor ID
 */
function shouldRefreshVisitorId(): boolean {
  if (typeof window === 'undefined') return false;
  
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('refreshId') || urlParams.has('newVisitorId');
}

function getOptimizelyId() {
  let visitorId = cookies.get('visitorId');
  
  // Check if we should refresh the visitor ID based on URL parameter
  if (shouldRefreshVisitorId() || !visitorId) {
    visitorId = v4();
    cookies.set('visitorId', visitorId, {expires: 365});
    
    // Optional: Remove the query parameter from URL to clean it up
    if (typeof window !== 'undefined' && shouldRefreshVisitorId()) {
      const url = new URL(window.location.href);
      url.searchParams.delete('refreshId');
      url.searchParams.delete('newVisitorId');
      window.history.replaceState({}, '', url.toString());
    }
  }
  
  return visitorId;
}

export const optimizely = createInstance({
    sdkKey: "XKkRw1SWTRnp5WXmVMYdB",
});

export const visitorId = getOptimizelyId();

