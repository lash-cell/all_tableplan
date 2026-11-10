export const CYCLE_SEC = 5;
export const SPAWN_INTERVAL_SEC = 5;
export const FLOW_STEP_DELAY_SEC = 0.15;
export const FLOW_SPEED = 8;

export function getFlowParticleSchedule(pathLength) {
    const travelSec = pathLength / FLOW_SPEED;
    const particles = Math.ceil(travelSec / SPAWN_INTERVAL_SEC);
    const cycleSec = particles * SPAWN_INTERVAL_SEC;
    return {
        particles,
        cycleSec,
        travelKeyTime: travelSec / cycleSec,
    };
}
