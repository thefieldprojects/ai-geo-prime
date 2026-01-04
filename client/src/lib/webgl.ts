/**
 * WebGL Detection Utility
 * Checks if WebGL is available in the current environment
 */

export function hasWebGLSupport(): boolean {
  try {
    // Check if WebGLRenderingContext exists
    if (!window.WebGLRenderingContext) {
      return false;
    }

    // Try to create a WebGL context
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return false;
    }

    // Clean up
    if ('getExtension' in gl) {
      const loseContext = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context');
      if (loseContext) {
        loseContext.loseContext();
      }
    }

    return true;
  } catch (e) {
    return false;
  }
}

export function getWebGLInfo(): { supported: boolean; vendor?: string; renderer?: string } {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl || !('getParameter' in gl)) {
      return { supported: false };
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const vendor = debugInfo ? (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown';
    const renderer = debugInfo ? (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';

    return {
      supported: true,
      vendor,
      renderer,
    };
  } catch (e) {
    return { supported: false };
  }
}
