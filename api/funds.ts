import { useCookie } from '#app';
import { BASE_URL } from '~/constants/BASE_URL';
import { COOKIE_NAME } from '~/constants/COOKIE_NAME';
import { useRequestFormData } from '#imports';
import emailjs from '@emailjs/browser';
import type { TokenTypes } from '~/types/TokenTypes';


const refreshStore = useRefreshStore();
const modal = useFundsModalStore();

const token = useCookie(COOKIE_NAME);

const user = ref<TokenTypes>();

interface Query {
  setLoading: (state: boolean) => void;
  setError: (state: boolean) => void;
  setSuccess: (state: boolean) => void;
  setStatusMessage: (message: string) => void;
  userName: string
}

export const requestFunds = async ({
  setLoading,
  setSuccess,
  setError,
  setStatusMessage,
  userName
}: Query) => {
  const token = useCookie(COOKIE_NAME);

  if (!token) throw new Error('Not authorized');

  try {
    setLoading(true);
    setSuccess(false);
    setError(false);

    if (!token) throw new Error('Not authorized');

    const formData = useRequestFormData();

    const approverId = formData.approverId;
    const amount = formData.amount;
    const currency = formData.currency;
    const description = formData.description;
    const purpose = formData.purpose;
    const requiredOn = formData.requiredOn;

    const response = await fetch(`${BASE_URL}/requests/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        approverId,
        amount,
        currency,
        description,
        purpose,
        requiredOn,
      }),
    });

    const data = await response.json();

    if (response.status == 200) {
      setSuccess(true);
      refreshStore.setRefresh();

      emailjs.init('gX3LSF-KrqtkWcAuO')

      emailjs.send('service_2jfk01f', 'template_zsumwin', {
        purpose: `${purpose}`,
        amount: `${currency} ${amount}`,
        id: data._id,
        email: ['noeljayr01@gmail.com', 'noeljayrluhanga@gmail.com'],
        name: `${userName}`,
      });

      window.setTimeout(() => {
        modal.setFundsModalActive();
      }, 500);
    } else {
      setError(true);
      setStatusMessage(data.message);
    }
  } catch (error) {
    setError(true);
  } finally {
    setLoading(false);
  }
};
