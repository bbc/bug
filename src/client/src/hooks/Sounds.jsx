import { useSelector } from "react-redux";
import useSound from "use-sound";

const useSounds = (path) => {
    const [play] = useSound(path);
    const quiet = () => {};

    try {
        const settings = useSelector((state) => state.settings);
        if (settings?.data?.sound) {
            return play;
        }
    } catch (error) {
        return quiet;
    }

    return quiet;
};

export default useSounds;
