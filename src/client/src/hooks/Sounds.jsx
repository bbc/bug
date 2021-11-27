import { useSelector } from "react-redux";
import useSound from "use-sound";

const useSounds = (path) => {
    const [play] = useSound(path);
    const settings = useSelector((state) => state.settings);

    const quiet = () => {};

    if (settings?.data?.sound) {
        return play;
    }

    return quiet;
};

export default useSounds;
