import React, { useState, useEffect } from 'react';
import { IntlProvider } from 'react-intl';

import { fetchMe } from 'soapbox/actions/me';
import { loadSoapboxConfig } from 'soapbox/actions/soapbox';
import { useSignerStream } from 'soapbox/api/hooks/nostr/useSignerStream';
import LoadingScreen from 'soapbox/components/loading-screen';
import { useNostr } from 'soapbox/contexts/nostr-context';
import {
  useAppSelector,
  useAppDispatch,
  useOwnAccount,
  useLocale,
  useInstance,
} from 'soapbox/hooks';
import MESSAGES from 'soapbox/messages';

/** Load initial data from the backend */
const loadInitial = () => {
  // @ts-ignore
  return async(dispatch) => {
    // Await for authenticated fetch
    await dispatch(fetchMe());
    // Await for configuration
    await dispatch(loadSoapboxConfig());
  };
};

interface ISoapboxLoad {
  children: React.ReactNode;
}

/** Initial data loader. */
const SoapboxLoad: React.FC<ISoapboxLoad> = ({ children }) => {
  const dispatch = useAppDispatch();

  const me = useAppSelector(state => state.me);
  const { account } = useOwnAccount();
  const instance = useInstance();
  const swUpdating = useAppSelector(state => state.meta.swUpdating);
  const { locale } = useLocale();

  const [messages, setMessages] = useState<Record<string, string>>({});
  const [localeLoading, setLocaleLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const { hasNostr, isRelayOpen } = useNostr();
  const { isSubscribed } = useSignerStream();

  /** Whether to display a loading indicator. */
  const showLoading = [
    me === null,
    me && !account,
    !isLoaded,
    localeLoading,
    instance.isLoading,
    swUpdating,
    hasNostr && me && (!isRelayOpen || !isSubscribed),
  ].some(Boolean);

  // Load the user's locale
  useEffect(() => {
    MESSAGES[locale]().then(messages => {
      setMessages(messages);
      setLocaleLoading(false);
    }).catch(() => { });
  }, [locale]);

  // Load initial data from the API
  useEffect(() => {
    if (!instance.isLoading) {
      dispatch(loadInitial()).then(() => {
        setIsLoaded(true);
      }).catch(() => {
        setIsLoaded(true);
      });
    }
  }, [instance.isLoading]);

  // intl is part of loading.
  // It's important nothing in here depends on intl.
  if (showLoading) {
    return <LoadingScreen />;
  }

  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
};

export default SoapboxLoad;
