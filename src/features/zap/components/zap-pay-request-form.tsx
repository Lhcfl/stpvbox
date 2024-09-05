import React, { useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import { zap } from 'soapbox/actions/interactions';
import { openModal, closeModal } from 'soapbox/actions/modals';
import chestIcon from 'soapbox/assets/icons/blue-chest.png';
import coinStack from 'soapbox/assets/icons/coin-stack.png';
import coinIcon from 'soapbox/assets/icons/coin.png';
import moneyBag from 'soapbox/assets/icons/money-bag.png';
import pileCoin from 'soapbox/assets/icons/pile-coin.png';
import DisplayNameInline from 'soapbox/components/display-name-inline';
import { Stack, Button, Input, Avatar } from 'soapbox/components/ui';
import IconButton from 'soapbox/components/ui/icon-button/icon-button';
import { useAppDispatch } from 'soapbox/hooks';

import ZapButton from './zap-button/zap-button';

import type {  Account as AccountEntity, Status as StatusEntity   } from 'soapbox/types/entities';

const closeIcon = require('@tabler/icons/outline/x.svg');

interface IZapPayRequestForm {
  status?: StatusEntity;
  account: AccountEntity;
  onClose?(): void;
}

const messages = defineMessages({
  zap_button_rounded: { id: 'zap.button.text.rounded', defaultMessage: 'Zap {amount}K sats' },
  zap_button: { id: 'zap.button.text.raw', defaultMessage: 'Zap {amount} sats' },
  zap_commentPlaceholder: { id: 'zap.comment_input.placeholder', defaultMessage: 'Optional comment' },
});

const ZapPayRequestForm = ({ account, status, onClose }: IZapPayRequestForm) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const [zapComment, setZapComment] = useState('');
  // amount in millisatoshi
  const [zapAmount, setZapAmount] = useState(50);

  const handleSubmit = async (e?: React.FormEvent<Element>) => {
    e?.preventDefault();
    const invoice = await dispatch(zap(account, status, zapAmount * 1000, zapComment));
    // If invoice is undefined it means the user has paid through his extension
    // In this case, we simply close the modal
    if (!invoice) {
      dispatch(closeModal('ZAP_PAY_REQUEST'));
      return;
    }
    // open QR code modal
    dispatch(openModal('ZAP_INVOICE', { invoice, account }));
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    e?.preventDefault();
    const inputAmount = e.target.value.replace(/[^0-9]/g, '');

    const maxSendable = 250000000;
    // multiply by 1000 to convert from satoshi to millisatoshi
    if (maxSendable * 1000 > Number(inputAmount)) {
      setZapAmount(Number(inputAmount));
    }
  };

  const renderZapButtonText = () => {
    if (zapAmount >= 1000) {
      return intl.formatMessage(messages.zap_button_rounded, { amount: Math.round((zapAmount / 1000) * 10) / 10 });
    }
    return intl.formatMessage(messages.zap_button, { amount: zapAmount });
  };

  return (
    <Stack space={4} element='form' onSubmit={handleSubmit} justifyContent='center' alignItems='center' className='relative'>
      <Stack space={2} justifyContent='center' alignItems='center' >
        <IconButton src={closeIcon} onClick={onClose} className='absolute -right-[1%] -top-[2%] text-gray-500 hover:text-gray-700 rtl:rotate-180 dark:text-gray-300 dark:hover:text-gray-200' />
        <span className='display-name__account text-base'>
          <FormattedMessage id='zap.send_to' defaultMessage='Send zaps to {target}' values={{ target: account.display_name }} />
        </span>
        <Avatar src={account.avatar} size={50} />
        <DisplayNameInline account={account} />
      </Stack>

      <div className='flex justify-center '>
        <ZapButton onClick={() => setZapAmount(50)} className='m-1' theme={zapAmount === 50 ? 'primary' : 'muted'} icon={coinIcon} text='50' />
        <ZapButton onClick={() => setZapAmount(200)} className='m-1' theme={zapAmount === 200 ? 'primary' : 'muted'} icon={coinStack} text='200' />
        <ZapButton onClick={() => setZapAmount(1_000)} className='m-1' theme={zapAmount === 1_000 ? 'primary' : 'muted'} icon={pileCoin} text='1K' />
        <ZapButton onClick={() => setZapAmount(3_000)} className='m-1' theme={zapAmount === 3_000 ? 'primary' : 'muted'} icon={moneyBag} text='3K' />
        <ZapButton onClick={() => setZapAmount(5_000)} className='m-1' theme={zapAmount === 5_000 ? 'primary' : 'muted'} icon={chestIcon} text='5K' />
      </div>

      <Stack space={2}>
        <div className='relative flex items-end justify-center gap-4'>
          <Input
            type='text' onChange={handleCustomAmount} value={zapAmount}
            className='box-shadow:none max-w-20 rounded-none border-0 border-b-4 p-0 text-center !text-2xl font-bold !ring-0 sm:max-w-28 sm:p-0.5 sm:!text-4xl dark:bg-transparent'
          />
          <p className='absolute -right-10 font-bold sm:-right-12 sm:text-xl'>sats</p>
        </div>

      </Stack>

      <div className='w-full'>
        <Input onChange={e => setZapComment(e.target.value)} type='text' placeholder={intl.formatMessage(messages.zap_commentPlaceholder)} />
      </div>
      <Button className='m-auto w-auto' type='submit' theme='primary' icon={require('@tabler/icons/outline/bolt.svg')} text={renderZapButtonText()} disabled={zapAmount < 1 ? true : false} />
    </Stack>
  );
};

export default ZapPayRequestForm;
