#include <common>

uniform vec3 resolution;
uniform float time;
uniform vec2 DOT_LOCATIONS[500];
uniform vec2 DOT_VELOCITIES[500];

#define COLOR 0.2, 0.2, 0.2

// vec2 dotLocation ( int index ) {
//     return DOT_LOCATIONS[index] + DOT_VELOCITIES[index] * time;
// }

float hitCount ( vec2 uv ) {
    float hitCount = 0.0;

    for (int i = 0; i < 500; i++) {
        vec2 location = mod(DOT_LOCATIONS[i] + DOT_VELOCITIES[i] * time, 1.0);

        if (length(uv - location) < .01) {
            hitCount += 1.0;
		}
	}

    return hitCount;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord / resolution.xy;

    float color = .2 * hitCount(uv);

    fragColor = vec4(color, color, color, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
