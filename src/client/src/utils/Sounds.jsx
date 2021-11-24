import { useApiPoller } from "@utils/ApiPoller";
import useSound from "use-sound";

const useSounds = (path) => {
    const [play] = useSound(path);
    const quiet = () => {
        console.log("Shhhh");
    };

    const settings = useApiPoller({
        url: `/api/system/settings`,
        interval: 2000,
    });

    if (settings.status === "success" && settings.data.sound) {
        return play;
    }

    return quiet;
};

export default useSounds;
