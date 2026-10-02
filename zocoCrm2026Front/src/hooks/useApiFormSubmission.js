import { useState } from 'react';
import { extractErrorMessages } from '../utils/helpers';

export default function useApiFormSubmission() {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const submit = async (action) => {
    setErrors([]);
    setLoading(true);
    try {
      await action();
      return true;
    } catch (error) {
      setErrors(extractErrorMessages(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { errors, loading, submit, clearErrors: () => setErrors([]) };
}
