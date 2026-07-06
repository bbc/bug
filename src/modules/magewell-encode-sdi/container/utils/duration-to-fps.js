function durationToFps(duration, options = {}) {
    const {
        // durations like 166833 imply 100ns ticks (10,000,000 ticks/sec)
        ticksPerSecond = 10_000_000,
        decimals = 2,
        snapTolerance = 0.05
    } = options;

    if (!Number.isFinite(duration) || duration <= 0) return null;

    const raw = ticksPerSecond / duration;

    // Snap to common broadcast rates for nicer display
    const commonRates = [
        23.976, 24, 25, 29.97, 30,
        50, 59.94, 60
    ];

    let snapped = raw;
    for (const rate of commonRates) {
        if (Math.abs(raw - rate) <= snapTolerance) {
            snapped = rate;
            break;
        }
    }

    return Number(snapped.toFixed(decimals));
}

module.exports = durationToFps;