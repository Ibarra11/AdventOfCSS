import React, { useEffect, useRef, useState } from 'react';
import GearIcon from './assets/images/gear.svg';

type InputIds =
  | 'primaryMinutes'
  | 'secondaryMinutes'
  | 'primarySeconds'
  | 'secondarySeconds';

const MODES = {
  idle: 'start',
  editing: 'set',
  start: 'stop'
};

function App() {
  const [mode, setMode] = useState<'editing' | 'idle' | 'start'>('idle');
  const [primaryMinutesVal, setPrimaryMinutesVal] = useState(1);
  const [secondaryMinutesVal, setSecondaryMinutesVal] = useState(5);
  const [primarySecondsVal, setPrimarySecondsVal] = useState(0);
  const [secondarySecondsVal, setSecondarySecondsVal] = useState(0);
  const [time, setTime] = useState<number>();

  const timer = useRef<NodeJS.Timeout>();
  const startTime = useRef<number>();
  function startStopwatch() {
    const time = Date.now();
    startTime.current;
    setTime(time);
  }

  function handleEditingMode() {
    setPrimaryMinutesVal(0);
    setSecondaryMinutesVal(0);
    setPrimarySecondsVal(0);
    setSecondarySecondsVal(0);
    setMode('editing');
  }

  function handleMode(e: React.MouseEvent<HTMLButtonElement>) {
    if (mode === 'editing') {
      setMode('idle');
    }
    if (mode === 'idle') {
      setMode('start');
      const id = setInterval(startStopwatch, 1000);
      timer.current = id;
      startStopwatch();
    }
    if (mode === 'start') {
      setMode('idle');
    }
  }

  useEffect(() => {
    if (mode === 'idle') {
      if (timer.current) {
        clearInterval(timer.current);
      }
    }
  }, [mode]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, id: InputIds) {
    const regex = /\d+/;
    if (e.target instanceof HTMLInputElement) {
      if (!regex.test(e.target.value)) return;

      switch (id) {
        case 'primaryMinutes': {
          let val;
          if (+e.target.value[0] !== primaryMinutesVal) {
            val = +e.target.value[0];
          } else {
            val = +e.target.value[e.target.value.length - 1];
          }

          if (val === 6) {
            setPrimaryMinutesVal(6);
            setSecondaryMinutesVal(0);
            setPrimarySecondsVal(0);
            setSecondarySecondsVal(0);
          } else if (val <= 5) {
            setPrimaryMinutesVal(val);
          }
          break;
        }
        case 'secondaryMinutes': {
          let val;
          if (+e.target.value[0] !== secondaryMinutesVal) {
            val = +e.target.value[0];
          } else {
            val = +e.target.value[e.target.value.length - 1];
          }

          if (val <= 9) {
            setSecondaryMinutesVal(val);
          }
          break;
        }
        case 'primarySeconds': {
          let val;
          if (+e.target.value[0] !== primarySecondsVal) {
            val = +e.target.value[0];
          } else {
            val = +e.target.value[e.target.value.length - 1];
          }

          if (val <= 5) {
            setPrimarySecondsVal(val);
          }
          break;
        }
        case 'secondarySeconds': {
          let val;
          if (+e.target.value[0] !== secondarySecondsVal) {
            val = +e.target.value[0];
          } else {
            val = +e.target.value[e.target.value.length - 1];
          }

          if (val <= 9) {
            setSecondarySecondsVal(val);
          }
          break;
        }
      }
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-primary">
      <div className=" relative  flex justify-center items-center w-500 h-500 p-2 rounded-full ">
        <div
          className={`absolute w-full h-full rounded-full inner-border ${
            mode === 'idle' ? 'bg-secondary' : 'bg-green'
          }`}
        ></div>
        <div className="relative flex justify-center items-center w-full h-full bg-primary text-white  rounded-full">
          <div className="relative w-3/4">
            <div className="timer-grid  justify-content-center ">
              <div className="col-start-1 ">
                {mode !== 'editing' ? (
                  <p className="text-9xl text-center">{primaryMinutesVal}</p>
                ) : (
                  <input
                    className="w-full text-center p-0 h-32 bg-transparent text-9xl"
                    type="text"
                    value={primaryMinutesVal}
                    onChange={(e) => handleChange(e, 'primaryMinutes')}
                  />
                )}
              </div>
              <div className="col-start-2">
                {mode !== 'editing' ? (
                  <p className=" w-full text-9xl text-center">
                    {secondaryMinutesVal}
                  </p>
                ) : (
                  <input
                    className=" w-full h-32 bg-transparent text-9xl text-center"
                    type="text"
                    value={secondaryMinutesVal}
                    onChange={(e) => handleChange(e, 'secondaryMinutes')}
                    data-id="secondaryMinutes"
                  />
                )}
              </div>
              <div className="col-start-3 place-self-start text-9xl">:</div>
              <div className="col-start-4 ">
                {mode !== 'editing' ? (
                  <p className="w-full text-9xl text-center">
                    {primarySecondsVal}
                  </p>
                ) : (
                  <input
                    className="w-full  h-32 bg-transparent text-9xl text-center"
                    type="text"
                    value={primarySecondsVal}
                    onChange={(e) => handleChange(e, 'primarySeconds')}
                    data-id="primarySeconds"
                  />
                )}
              </div>
              <div className="col-start-5 ">
                {mode !== 'editing' ? (
                  <p className=" text-9xl text-center">{secondarySecondsVal}</p>
                ) : (
                  <input
                    className=" w-full  h-32 bg-transparent text-9xl text-center"
                    type="text"
                    value={secondarySecondsVal}
                    onChange={(e) => handleChange(e, 'secondarySeconds')}
                    data-id="secondarySeconds"
                  />
                )}
              </div>
            </div>

            <div className="absolute flex w-full flex-col  justify-center gap-6 controls">
              <button
                className="text-base font-bold tracking-widest uppercase start-btn"
                onClick={handleMode}
              >
                {MODES[mode]}
              </button>
              <button
                className="flex justify-center"
                onClick={() => handleEditingMode()}
              >
                <img
                  className="block w-6 h-6 fill-icon"
                  src={GearIcon}
                  alt="change time"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
