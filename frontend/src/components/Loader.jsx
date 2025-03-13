import loadder from '/loader.gif';

const Loading = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // height: '20vh',
        // width: '20vw',
      }}
    >
      <img src={loadder} alt="Loading" width={150} height={150} />
    </div>
  );
};

export default Loading;
