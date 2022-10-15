import React from 'react';
import LoadingOverlay from 'react-loading-overlay'
import Loader from 'react-spinners/PuffLoader'
 
export default function Spinner({ active }) {
  return (
    <LoadingOverlay
      active={active}
      styles={{
        overlay: (base) => ({
          ...base,
          background: 'rgb(180, 183, 188,0.2)',
          position:'fixed',
          zIndex: '1050',
        })
      }}
      spinner={<Loader />}
    >
    </LoadingOverlay>
  )
}