#include <common>

const int DOT_COUNT = 500;

uniform vec3 resolution;
uniform float time;
uniform float DOT_SIZE;
uniform vec2 DOT_LOCATIONS[DOT_COUNT];
uniform vec2 DOT_VELOCITIES[DOT_COUNT];

float hitCount ( vec2 location ) {
    float hitCount = 0.0;

    for (int i = 0; i < DOT_COUNT; i++) {
        vec2 dotPosition = mod(DOT_LOCATIONS[i] + DOT_VELOCITIES[i] * time, 500.0);

        if (length(location - dotPosition) < DOT_SIZE) {
            hitCount += 1.0;
		}
	}

    return hitCount;
}

void main() {
    vec2 location = gl_FragCoord.xy;

    float color = 0.1 * hitCount(location);

    gl_FragColor = vec4(color, color, color, 1.0);
}
