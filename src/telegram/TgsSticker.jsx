import React from 'react';
import Lottie from 'react-lottie-player';

import animData from './sticker/sticker.json' 

const TgsSticker = ({classname}) => {
  return (
    (
      <Lottie
       className={classname}
        loop
        play
        animationData={animData}
      />
    )
  );
};

export default TgsSticker;
