import React, { useState, useEffect, useRef } from 'react';

import { simpleEmojiReact } from 'soapbox/actions/emoji-reacts';
import { openModal } from 'soapbox/actions/modals';
import { EmojiSelector, Portal } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector, useOwnAccount, useSoapboxConfig } from 'soapbox/hooks';
// import { userTouching } from 'soapbox/is-mobile';
import { getReactForStatus } from 'soapbox/utils/emoji-reacts';

interface IStatusReactionWrapper {
  statusId: string;
  children: JSX.Element;
}

/** Provides emoji reaction functionality to the underlying button component */
const StatusReactionWrapper: React.FC<IStatusReactionWrapper> = ({ statusId, children }): JSX.Element | null => {
  const dispatch = useAppDispatch();
  const { account: ownAccount } = useOwnAccount();
  const status = useAppSelector(state => state.statuses.get(statusId));
  const soapboxConfig = useSoapboxConfig();

  const timeout = useRef<NodeJS.Timeout>();
  const [visible, setVisible] = useState(false);

  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  if (!status) return null;

  // const handleMouseEnter = () => {
  //   if (timeout.current) {
  //     clearTimeout(timeout.current);
  //   }

  //   if (!userTouching.matches) {
  //     setVisible(true);
  //   }
  // };

  // const handleMouseLeave = () => {
  //   if (timeout.current) {
  //     clearTimeout(timeout.current);
  //   }

  //   // Unless the user is touching, delay closing the emoji selector briefly
  //   // so the user can move the mouse diagonally to make a selection.
  //   if (userTouching.matches) {
  //     setVisible(false);
  //   } else {
  //     timeout.current = setTimeout(() => {
  //       setVisible(false);
  //     }, 500);
  //   }
  // };

  const handleReact = (emoji: string, custom?: string): void => {
    if (ownAccount) {
      dispatch(simpleEmojiReact(status, emoji, custom));
    } else {
      handleUnauthorized();
    }

    setVisible(false);
  };

  const handleClick: React.EventHandler<React.MouseEvent> = e => {
    const meEmojiReact = getReactForStatus(status, soapboxConfig.allowedEmoji)?.name || '♥';

    // if (userTouching.matches) {
    //   if (ownAccount) {
    //     if (visible) {
    //       handleReact(meEmojiReact);
    //     } else {
    //       setVisible(true);
    //     }
    //   } else {
    //     handleUnauthorized();
    //   }
    // } else {
    //   handleReact(meEmojiReact);
    // }

    console.log(status);

    if (ownAccount) {
      if (status.reactions?.some((e) => e.me)) {
        handleReact(meEmojiReact);
      } else {
        setVisible(true);
      }
    } else {
      handleUnauthorized();
    }

    e.preventDefault();
    e.stopPropagation();
  };

  const handleUnauthorized = () => {
    dispatch(openModal('UNAUTHORIZED', {
      action: 'FAVOURITE',
      ap_id: status.url,
    }));
  };

  return (
    <div className='relative'>
      {React.cloneElement(children, {
        onClick: handleClick,
        ref: setReferenceElement,
      })}

      {visible && (
        <Portal>
          <EmojiSelector
            placement='top-start'
            referenceElement={referenceElement}
            onReact={handleReact}
            visible={visible}
            onClose={() => setVisible(false)}
          />
        </Portal>
      )}
    </div>
  );
};

export default StatusReactionWrapper;
