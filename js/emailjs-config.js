/**
 * EmailJS 설정 관리
 *
 * 환경 변수(.env)를 통해 EmailJS 설정을 관리하며,
 * UI에서 직접 입력한 값으로 override 가능합니다.
 */

export const emailjsConfig = {
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  testEmail: import.meta.env.VITE_EMAILJS_TEST_EMAIL || ''
};

export function hasEmailJSConfig() {
  return !!(emailjsConfig.publicKey && emailjsConfig.serviceId && emailjsConfig.templateId);
}

export function getEmailJSConfig() {
  return { ...emailjsConfig };
}
