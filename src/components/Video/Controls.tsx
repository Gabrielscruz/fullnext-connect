import {
  FaCompressArrowsAlt,
  FaExpandArrowsAlt,
  FaPause,
  FaPlay,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";

interface controlsProps {
  isTheaterMode: boolean;
  setIsTheaterMode: (isTheaterMode: boolean) => void;
}
export function Controls({ isTheaterMode, setIsTheaterMode }: controlsProps) {
  return (
    <div
      className={
        isTheaterMode
          ? "flex flex-row w-fit absolute gap-2 bg-customColor p-4 rounded-xl bottom-10 left-1/2 transform -translate-x-1/2"
          : "flex flex-row bg-base-100 w-full p-4 gap-4 items-center justify-between"
      }
    >
      <div className="flex flex-row gap-4 text-sm">
        <button
          type="button"
          className="bg-primary-200 p-2 rounded hover:brightness-75"
        >
          <FaStepBackward />
        </button>
        <button
          type="button"
          className="bg-primary-200 p-2 rounded hover:brightness-75"
        >
          <FaStepForward />
        </button>
        <label className="grid cursor-pointer place-items-center">
          <input
            type="checkbox"
            value="synthwave"
            className={`toggle ${
              false ? "bg-base-100" : "bg-primary-200"
            } col-span-2 col-start-1 row-start-1`}
          />
          <FaPause className="w-2 h-2 stroke-base-100 fill-base-100 col-start-1 row-start-1" />
          <FaPlay className="w-2 h-2 stroke-base-100 fill-base-100 col-start-2 row-start-1" />
        </label>
      </div>
      <button
        type="button"
        className="bg-primary-200 p-2 rounded  hover:brightness-75 max-md:btn-disabled max-md:brightness-50"
        onClick={() => setIsTheaterMode(!isTheaterMode)}
      >
        {isTheaterMode ? <FaCompressArrowsAlt /> : <FaExpandArrowsAlt />}
      </button>
    </div>
  );
}
